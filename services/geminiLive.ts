import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { base64ToUint8Array, float32ToInt16PCM, pcm16ToAudioBuffer, uint8ArrayToBase64 } from "../utils/audioUtils";
import { ChatMessage } from "../types";

const MODEL_NAME = 'gemini-2.5-flash-native-audio-preview-09-2025';
const INPUT_SAMPLE_RATE = 16000;
const OUTPUT_SAMPLE_RATE = 24000;

export class GeminiLiveService {
  private client: GoogleGenAI;
  private sessionPromise: Promise<any> | null = null;
  
  // Audio contexts
  private audioContext: AudioContext | null = null;      // Output (Speaker)
  private inputAudioContext: AudioContext | null = null; // Input (Mic)
  
  private inputScriptProcessor: ScriptProcessorNode | null = null;
  private mediaStream: MediaStream | null = null;
  private nextStartTime = 0;
  private sources = new Set<AudioBufferSourceNode>();
  private isMuted = false;
  
  public onMessageUpdate: (msg: ChatMessage) => void = () => {};
  public onAudioLevel: (level: number) => void = () => {};
  public onDisconnect: () => void = () => {};

  constructor() {
    this.client = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async connect(systemInstruction: string, voiceName: string = 'Kore') {
    // 1. Initialize Output AudioContext
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
      sampleRate: OUTPUT_SAMPLE_RATE,
    });
    
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    // 2. Configure Live API
    const config = {
      model: MODEL_NAME,
      callbacks: {
        onopen: this.handleOpen.bind(this),
        onmessage: this.handleMessage.bind(this),
        onclose: this.handleClose.bind(this),
        onerror: this.handleError.bind(this),
      },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName } },
        },
        systemInstruction: systemInstruction,
        inputAudioTranscription: {}, 
        outputAudioTranscription: {},
      },
    };

    // 3. Connect
    this.sessionPromise = this.client.live.connect(config);
    return this.sessionPromise;
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
  }

  private async handleOpen() {
    console.log("Gemini Live: Connection Opened");
    await this.startRecording();
    
    // Send an initial trigger safely
    if (this.sessionPromise) {
      this.sessionPromise.then(async (session) => {
        try {
            // Small delay to ensure session is fully ready
            await new Promise(resolve => setTimeout(resolve, 500));
            
            if (typeof session.send === 'function') {
                session.send({
                    clientContent: {
                        turns: [{ role: 'user', parts: [{ text: "Hello teacher, I am connected and ready to learn." }] }],
                        turnComplete: true
                    }
                });
                console.log("Sent initial trigger");
            }
        } catch (e) {
          console.warn("Failed to send initial prompt", e);
        }
      });
    }
  }

  private async startRecording() {
    try {
      // 1. Get Media Stream
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // 2. Initialize Input Context (Fixed: Assign to class property to clean up later)
      this.inputAudioContext = new AudioContext({ sampleRate: INPUT_SAMPLE_RATE });
      
      // Critical: Ensure input context is running
      if (this.inputAudioContext.state === 'suspended') {
        await this.inputAudioContext.resume();
      }

      const source = this.inputAudioContext.createMediaStreamSource(this.mediaStream);
      this.inputScriptProcessor = this.inputAudioContext.createScriptProcessor(4096, 1, 1);
      
      this.inputScriptProcessor.onaudioprocess = (e) => {
        if (this.isMuted) {
            this.onAudioLevel(0);
            return; 
        }

        const inputData = e.inputBuffer.getChannelData(0);
        
        // Audio Level Visualization
        let sum = 0;
        for(let i=0; i<inputData.length; i++) sum += inputData[i] * inputData[i];
        const rms = Math.sqrt(sum / inputData.length);
        this.onAudioLevel(rms);

        // Convert and Send
        const pcm16 = float32ToInt16PCM(inputData);
        const uint8 = new Uint8Array(pcm16.buffer);
        const base64 = uint8ArrayToBase64(uint8);

        if (this.sessionPromise) {
            this.sessionPromise.then(session => {
                session.sendRealtimeInput({
                    media: {
                        mimeType: 'audio/pcm;rate=16000',
                        data: base64
                    }
                });
            });
        }
      };

      source.connect(this.inputScriptProcessor);
      
      // Connect to destination to keep the processor alive (muted to prevent feedback)
      const muteNode = this.inputAudioContext.createGain();
      muteNode.gain.value = 0;
      this.inputScriptProcessor.connect(muteNode);
      muteNode.connect(this.inputAudioContext.destination);

    } catch (err) {
      console.error("Microphone Access Error:", err);
      // Fallback: Notify user they might need to check browser permissions
      this.onMessageUpdate({
          id: Date.now().toString(),
          role: 'system',
          text: "Error: Could not access microphone. Please check your browser permissions.",
          timestamp: Date.now()
      });
    }
  }

  private async handleMessage(message: LiveServerMessage) {
    // Audio Output
    const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
    if (base64Audio && this.audioContext) {
      try {
        const pcmData = base64ToUint8Array(base64Audio).buffer;
        const audioBuffer = await pcm16ToAudioBuffer(pcmData, this.audioContext, OUTPUT_SAMPLE_RATE);
        this.playAudioBuffer(audioBuffer);
      } catch (e) { console.error("Audio Decode Error", e); }
    }

    // Subtitles (User)
    const userText = message.serverContent?.inputTranscription?.text;
    if (userText) {
        this.onMessageUpdate({ id: Date.now() + 'u', role: 'user', text: userText, timestamp: Date.now() });
    }

    // Subtitles (Assistant)
    const aiText = message.serverContent?.outputTranscription?.text;
    if (aiText) {
         this.onMessageUpdate({ id: Date.now() + 'a', role: 'assistant', text: aiText, timestamp: Date.now() });
    }

    if (message.serverContent?.interrupted) {
      this.stopAllAudio();
    }
  }

  private playAudioBuffer(buffer: AudioBuffer) {
    if (!this.audioContext) return;

    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(this.audioContext.destination);

    const currentTime = this.audioContext.currentTime;
    if (this.nextStartTime < currentTime) {
      this.nextStartTime = currentTime;
    }
    
    source.start(this.nextStartTime);
    this.nextStartTime += buffer.duration;
    
    this.sources.add(source);
    source.onended = () => this.sources.delete(source);
  }

  private stopAllAudio() {
    this.sources.forEach(s => { try { s.stop(); } catch(e) {} });
    this.sources.clear();
    if(this.audioContext) this.nextStartTime = this.audioContext.currentTime;
  }

  private handleClose(e: CloseEvent) {
    console.log("Gemini Live Closed", e);
    this.cleanup();
    this.onDisconnect();
  }

  private handleError(e: ErrorEvent) {
    console.error("Gemini Live Error", e);
    this.cleanup();
    this.onDisconnect();
  }

  public async disconnect() {
      this.cleanup();
  }

  private cleanup() {
    this.stopAllAudio();
    
    // Clean up input
    if (this.inputScriptProcessor) {
      try { 
        this.inputScriptProcessor.disconnect(); 
        this.inputScriptProcessor.onaudioprocess = null; 
      } catch (e) {}
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(t => t.stop());
    }
    
    // Clean up contexts
    if (this.inputAudioContext && this.inputAudioContext.state !== 'closed') {
        try { this.inputAudioContext.close(); } catch (e) {}
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
        try { this.audioContext.close(); } catch (e) {}
    }
    
    this.sessionPromise = null;
    this.inputAudioContext = null;
    this.audioContext = null;
  }
}