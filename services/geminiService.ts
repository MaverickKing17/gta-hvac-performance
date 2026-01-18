
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { DUAL_SYSTEM_INSTRUCTION } from "../constants";

export const createAiClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
};

export function encodeAudio(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function decodeAudio(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const submitLeadFunctionDeclaration: FunctionDeclaration = {
  name: 'submitLeadData',
  parameters: {
    type: Type.OBJECT,
    description: 'Submits customer lead information to the dispatch system.',
    properties: {
      name: { type: Type.STRING, description: 'Customer full name' },
      phone: { type: Type.STRING, description: 'Customer phone number' },
      age: { type: Type.STRING, description: 'Age of current HVAC unit' },
      summary: { type: Type.STRING, description: 'Summary of the issue or inquiry' },
      temp: { type: Type.STRING, description: 'Priority level: HOT INSTALL, REPAIR, or REBATE' },
      agent: { type: Type.STRING, description: 'The persona that handled the lead (Chloe or Jessica)' },
      address: { type: Type.STRING, description: 'Home address for dispatch' }
    },
    required: ['name', 'phone', 'summary', 'temp', 'agent']
  }
};
