
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
  const [error, setError] = useState<string | null>(null);

  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const transcriptionBufferRef = useRef({ user: '', model: '' });

  const stopSession = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.close?.();
      sessionRef.current = null;
    }
    sourcesRef.current.forEach(s => s.stop());
    sourcesRef.current.clear();
    setIsActive(false);
    setIsConnecting(false);
  }, []);

  const startSession = async () => {
    try {
      setIsConnecting(true);
      setError(null);

      const ai = createAiClient();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setIsConnecting(false);
            
            // Start streaming microphone
            const source = inputAudioContextRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
            
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
              sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContextRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Handle Audio Output
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

            // Handle Transcriptions
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
              
              // Trigger Persona Switch detection (Simple keyword based for UI state)
              const emergencyKeywords = ["gas smell", "no heat", "water leak", "banging", "emergency"];
              if (emergencyKeywords.some(k => userText.toLowerCase().includes(k) || modelText.toLowerCase().includes(k))) {
                setCurrentPersona(Persona.SAM);
              }

              transcriptionBufferRef.current = { user: '', model: '' };
            }

            // Handle Function Calls
            if (message.toolCall) {
              for (const fc of message.toolCall.functionCalls) {
                if (fc.name === 'submitLeadData') {
                  console.log('Lead submitted:', fc.args);
                  // Simulate Webhook
                  fetch(WEBHOOK_URL, {
                    method: 'POST',
                    body: JSON.stringify(fc.args)
                  }).catch(e => console.error("Webhook simulated fail:", e));

                  sessionPromise.then(s => s.sendToolResponse({
                    functionResponses: { id: fc.id, name: fc.name, response: { result: "Success! Lead info logged to dispatch." } }
                  }));
                }
              }
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error("Gemini Live Error:", e);
            setError("Connection lost. Please try again.");
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
      console.error(err);
      setError("Failed to start microphone or connection.");
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      stopSession();
    }
  }, [isOpen, stopSession]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className={`p-6 flex items-center justify-between border-b ${currentPersona === Persona.SAM ? 'bg-red-50 text-red-900 border-red-100' : 'bg-emerald-50 text-emerald-900 border-emerald-100'}`}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-inner ${currentPersona === Persona.SAM ? 'bg-red-500 text-white' : 'bg-emerald-700 text-white'}`}>
              <i className={currentPersona === Persona.SAM ? 'fas fa-shield-halved' : 'fas fa-headset'}></i>
            </div>
            <div>
              <h2 className="text-xl font-bold">{currentPersona === Persona.SAM ? 'Sam (Emergency Dispatch)' : 'Chloe (Front Desk)'}</h2>
              <p className="text-sm opacity-80">{isActive ? 'Live on the line' : isConnecting ? 'Connecting...' : 'Ready to help'}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <i className="fas fa-times text-2xl"></i>
          </button>
        </div>

        {/* Conversation Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50 min-h-[300px]">
          {transcriptions.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              {!isActive && !isConnecting && (
                <>
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mb-4 text-2xl">
                    <i className="fas fa-microphone"></i>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800">Voice Assistant Ready</h3>
                  <p className="text-slate-500 mt-2 max-w-sm">
                    Press start to speak with Chloe about rebates, or mention an emergency to reach Sam immediately.
                  </p>
                </>
              )}
              {isConnecting && (
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-700 rounded-full animate-spin mb-4"></div>
                  <p className="text-slate-600">Connecting to secure voice channel...</p>
                </div>
              )}
              {isActive && (
                <div className="flex flex-col items-center">
                  <div className="flex gap-1 mb-4 h-8 items-end">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="w-1.5 bg-emerald-600 rounded-full animate-pulse" style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.1}s` }}></div>
                    ))}
                  </div>
                  <p className="text-emerald-700 font-medium">Listening for your voice...</p>
                </div>
              )}
            </div>
          ) : (
            transcriptions.map((t, idx) => (
              <div key={idx} className={`flex ${t.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
                  t.role === 'user' 
                    ? 'bg-emerald-800 text-white rounded-tr-none' 
                    : t.persona === Persona.SAM 
                      ? 'bg-red-100 text-red-900 border border-red-200 rounded-tl-none' 
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                }`}>
                  <p className="text-sm leading-relaxed">{t.text}</p>
                </div>
              </div>
            ))
          )}
          {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">{error}</div>}
        </div>

        {/* Footer */}
        <div className="p-6 bg-white border-t flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2">
            {!isActive ? (
              <Button onClick={startSession} isLoading={isConnecting} className="w-full sm:w-auto">
                <i className="fas fa-phone-alt mr-2"></i> Start Consultation
              </Button>
            ) : (
              <Button variant="danger" onClick={stopSession} className="w-full sm:w-auto">
                <i className="fas fa-phone-slash mr-2"></i> End Call
              </Button>
            )}
          </div>
          <div className="text-xs text-slate-400 italic">
            * All calls are recorded for quality assurance. Green Choice Inc.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistantModal;
