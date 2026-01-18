
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { LiveServerMessage, Modality } from '@google/genai';
import { createAiClient, encodeAudio, decodeAudio, decodeAudioData, submitLeadFunctionDeclaration } from '../services/geminiService';
import { DUAL_SYSTEM_INSTRUCTION, WEBHOOK_URL } from '../constants';
import { Persona, TranscriptionEntry } from '../types';
import Button from './Button';

interface AssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AssistantModal: React.FC<AssistantModalProps> = ({ isOpen, onClose }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [currentPersona, setCurrentPersona] = useState<Persona>(Persona.CHLOE);
  const [transcriptions, setTranscriptions] = useState<TranscriptionEntry[]>([]);
  const [error, setError] = useState<{ message: string; type: 'permission' | 'connection' | 'generic' } | null>(null);

  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const transcriptionBufferRef = useRef({ user: '', model: '' });
  const activeStreamRef = useRef<MediaStream | null>(null);

  const stopSession = useCallback(() => {
    // 1. Stop all audio tracks to release the hardware lock
    if (activeStreamRef.current) {
      activeStreamRef.current.getTracks().forEach(track => {
        track.stop();
        track.enabled = false;
      });
      activeStreamRef.current = null;
    }

    // 2. Close the Gemini session
    if (sessionRef.current) {
      try {
        sessionRef.current.close?.();
      } catch (e) {
        console.warn("Session close error:", e);
      }
      sessionRef.current = null;
    }
    
    // 3. Clear audio buffers
    sourcesRef.current.forEach(s => {
      try { s.stop(); } catch (e) {}
    });
    sourcesRef.current.clear();
    
    // 4. Cleanup AudioContexts
    if (audioContextRef.current?.state !== 'closed') {
      audioContextRef.current?.close();
    }
    if (inputAudioContextRef.current?.state !== 'closed') {
      inputAudioContextRef.current?.close();
    }
    
    audioContextRef.current = null;
    inputAudioContextRef.current = null;
    nextStartTimeRef.current = 0;
    
    setIsActive(false);
    setIsConnecting(false);
  }, []);

  const startSession = async () => {
    try {
      setIsConnecting(true);
      setError(null);

      // Check for hardware support
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw { message: "Your browser does not support voice features. Please use a modern browser like Chrome or Edge.", type: 'generic' };
      }

      // Check permission state explicitly if possible
      if (navigator.permissions && navigator.permissions.query) {
        const result = await navigator.permissions.query({ name: 'microphone' as any });
        if (result.state === 'denied') {
          throw { 
            message: "Microphone access is explicitly blocked in your browser settings for this site. Please click the lock icon in your address bar and reset the permission.",
            type: 'permission' 
          };
        }
      }

      // Request stream - ensure we catch the rejection explicitly
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      }).catch(err => {
        console.error("Mic error during getUserMedia:", err);
        throw { 
          message: "Could not access microphone. Please ensure no other apps are using it and that you've clicked 'Allow' when the browser asked.",
          type: 'permission' 
        };
      });
      
      activeStreamRef.current = stream;

      const apiKey = process.env.API_KEY;
      if (!apiKey) {
        throw { message: "Service temporarily unavailable. Please try again in a few moments.", type: 'connection' };
      }

      const ai = createAiClient();
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setIsConnecting(false);
            
            if (inputAudioContextRef.current && stream) {
              const source = inputAudioContextRef.current.createMediaStreamSource(stream);
              const scriptProcessor = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
              
              scriptProcessor.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);
                const int16 = new Int16Array(inputData.length);
                for (let i = 0; i < inputData.length; i++) {
                  int16[i] = inputData[i] * 32768;
                }
                const pcmBlob = {
                  data: encodeAudio(new Uint8Array(int16.buffer)),
                  mimeType: 'audio/pcm;rate=16000',
                };
                sessionPromise.then(session => {
                  if (session) session.sendRealtimeInput({ media: pcmBlob });
                }).catch(() => {});
              };

              source.connect(scriptProcessor);
              scriptProcessor.connect(inputAudioContextRef.current.destination);
            }
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && audioContextRef.current) {
              const ctx = audioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const audioBuffer = await decodeAudioData(decodeAudio(base64Audio), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              source.onended = () => sourcesRef.current.delete(source);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.inputTranscription) {
              transcriptionBufferRef.current.user += message.serverContent.inputTranscription.text;
            }
            if (message.serverContent?.outputTranscription) {
              transcriptionBufferRef.current.model += message.serverContent.outputTranscription.text;
            }

            if (message.serverContent?.turnComplete) {
              const userText = transcriptionBufferRef.current.user;
              const modelText = transcriptionBufferRef.current.model;
              
              if (userText) setTranscriptions(prev => [...prev, { role: 'user', text: userText, timestamp: new Date() }]);
              if (modelText) setTranscriptions(prev => [...prev, { role: 'model', text: modelText, timestamp: new Date(), persona: currentPersona }]);
              
              const emergencyKeywords = ["gas smell", "no heat", "water leak", "banging", "emergency", "urgent"];
              if (emergencyKeywords.some(k => userText.toLowerCase().includes(k) || modelText.toLowerCase().includes(k))) {
                setCurrentPersona(Persona.JESSICA);
              }

              transcriptionBufferRef.current = { user: '', model: '' };
            }

            if (message.toolCall) {
              for (const fc of message.toolCall.functionCalls) {
                if (fc.name === 'submitLeadData') {
                  fetch(WEBHOOK_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(fc.args)
                  }).catch(() => {});

                  sessionPromise.then(s => s.sendToolResponse({
                    functionResponses: { id: fc.id, name: fc.name, response: { result: "Success" } }
                  })).catch(() => {});
                }
              }
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => { try { s.stop(); } catch(e) {} });
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error("Gemini Live Error:", e);
            setError({ message: "The voice connection was interrupted. Let's try reconnecting.", type: 'connection' });
            stopSession();
          },
          onclose: () => stopSession()
        },
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: DUAL_SYSTEM_INSTRUCTION,
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          tools: [{ functionDeclarations: [submitLeadFunctionDeclaration] }],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: currentPersona === Persona.CHLOE ? 'Kore' : 'Puck' } }
          }
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err: any) {
      setError(err.type ? err : { message: err.message || "Failed to start consultation.", type: 'generic' });
      setIsConnecting(false);
      stopSession();
    }
  };

  useEffect(() => {
    return () => stopSession();
  }, [stopSession]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        <div className={`p-6 flex items-center justify-between border-b transition-colors duration-500 ${currentPersona === Persona.JESSICA ? 'bg-red-50 text-red-900 border-red-100' : 'bg-emerald-50 text-emerald-900 border-emerald-100'}`}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-inner transition-colors duration-500 ${currentPersona === Persona.JESSICA ? 'bg-red-500 text-white' : 'bg-emerald-700 text-white'}`}>
              <i className={currentPersona === Persona.JESSICA ? 'fas fa-shield-halved' : 'fas fa-headset'}></i>
            </div>
            <div>
              <h2 className="text-xl font-bold">{currentPersona === Persona.JESSICA ? 'Jessica (Emergency Dispatch)' : 'Chloe (Front Desk)'}</h2>
              <p className="text-sm opacity-80">{isActive ? 'Live on the line' : isConnecting ? 'Connecting...' : 'Ready to help'}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-2" aria-label="Close">
            <i className="fas fa-times text-2xl"></i>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50 min-h-[300px] scroll-smooth">
          {transcriptions.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              {!isActive && !isConnecting && (
                <>
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mb-6 text-3xl shadow-sm">
                    <i className="fas fa-microphone"></i>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Start Your Rebate Consultation</h3>
                  <p className="text-slate-500 mt-2 max-w-sm leading-relaxed">
                    Ready to find out if you qualify for the $7,500 government rebate? 
                    Click below to start a secure voice call with Chloe.
                  </p>
                </>
              )}
              {isConnecting && (
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-700 rounded-full animate-spin mb-4"></div>
                  <p className="text-slate-600 font-medium">Connecting to secure voice channel...</p>
                </div>
              )}
              {isActive && (
                <div className="flex flex-col items-center text-center">
                  <div className="flex gap-1.5 mb-6 h-12 items-center">
                    {[1, 2, 3, 4, 5, 6, 7].map(i => (
                      <div 
                        key={i} 
                        className="w-1.5 bg-emerald-600 rounded-full animate-pulse" 
                        style={{ 
                          height: `${40 + Math.random() * 60}%`, 
                          animationDuration: `${0.5 + Math.random()}s`,
                          animationDelay: `${i * 0.1}s` 
                        }}
                      ></div>
                    ))}
                  </div>
                  <p className="text-emerald-700 font-bold text-lg">Chloe is Listening...</p>
                  <p className="text-slate-500 text-sm mt-2 max-w-xs">Ask her about heat pump rebates or how the HRS program works.</p>
                </div>
              )}
            </div>
          ) : (
            transcriptions.map((t, idx) => (
              <div key={idx} className={`flex ${t.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
                  t.role === 'user' 
                    ? 'bg-emerald-800 text-white rounded-tr-none' 
                    : t.persona === Persona.JESSICA 
                      ? 'bg-red-100 text-red-900 border border-red-200 rounded-tl-none font-medium' 
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{t.text}</p>
                </div>
              </div>
            ))
          )}
          
          {error && (
            <div className={`p-4 rounded-xl text-sm border flex gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
              error.type === 'permission' ? 'bg-amber-50 text-amber-900 border-amber-200' : 'bg-red-50 text-red-900 border-red-200'
            }`}>
              <i className={`fas ${error.type === 'permission' ? 'fa-microphone-slash' : 'fa-exclamation-circle'} mt-1`}></i>
              <div>
                <p className="font-bold mb-1">{error.type === 'permission' ? 'Microphone Issue' : 'Oops! Something went wrong'}</p>
                <p className="leading-relaxed opacity-90">{error.message}</p>
                {error.type === 'permission' && (
                  <button onClick={startSession} className="mt-2 text-xs font-bold underline uppercase tracking-tight">Try again</button>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-white border-t flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2 w-full sm:w-auto">
            {!isActive ? (
              <Button 
                onClick={startSession} 
                isLoading={isConnecting} 
                className="w-full sm:w-auto shadow-lg"
              >
                <i className="fas fa-phone-alt mr-2"></i> Start Consultation
              </Button>
            ) : (
              <Button variant="danger" onClick={stopSession} className="w-full sm:w-auto shadow-lg">
                <i className="fas fa-phone-slash mr-2"></i> End Consultation
              </Button>
            )}
          </div>
          <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
            {isActive ? 'Live Channel Active' : 'Channel Encrypted'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistantModal;
