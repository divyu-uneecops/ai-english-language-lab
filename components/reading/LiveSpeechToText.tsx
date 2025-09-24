"use client";

import { useEffect, useRef, useState } from "react";
import { SarvamAIClient } from "sarvamai";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, CheckCircle2, AlertCircle } from "lucide-react";

interface SarvamResponse {
  request_id: string;
  transcript: string;
  timestamps: any | null;
  diarized_transcript: any | null;
  language_code: string;
  metrics: {
    audio_duration: number;
    processing_latency: number;
  };
}

interface LiveSpeechToTextProps {
  targetText?: string;
  onTranscriptUpdate?: (transcript: string) => void;
  onAccuracyUpdate?: (accuracy: number) => void;
  className?: string;
}

export default function LiveSpeechToText({
  className = "",
}: LiveSpeechToTextProps) {
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);

  const wsRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);

  const startListening = async () => {
    if (listening) return;

    setTranscript("");
    setListening(true);

    try {
      const client = new SarvamAIClient({
        apiSubscriptionKey: process.env.NEXT_PUBLIC_SARVAM_API_KEY,
      });

      const socket = await client.speechToTextStreaming.connect({
        "language-code": "en-IN",
        high_vad_sensitivity: "true",
      });

      wsRef.current = socket;

      socket.on("open", async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
              sampleRate: 16000,
              channelCount: 1,
              echoCancellation: true,
              noiseSuppression: true,
            },
          });

          streamRef.current = stream;

          const audioContext = new AudioContext({ sampleRate: 16000 });
          audioContextRef.current = audioContext;

          const source = audioContext.createMediaStreamSource(stream);
          const processor = audioContext.createScriptProcessor(4096, 1, 1);
          scriptProcessorRef.current = processor;

          processor.onaudioprocess = (event) => {
            if (socket.readyState === WebSocket.OPEN) {
              const inputData = event.inputBuffer.getChannelData(0);

              const int16Data = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                int16Data[i] = Math.max(
                  -32768,
                  Math.min(32767, inputData[i] * 32768)
                );
              }

              const base64Audio = btoa(
                String.fromCharCode(...new Uint8Array(int16Data.buffer))
              );

              socket.transcribe({
                audio: base64Audio,
                sample_rate: 16000,
                encoding: "audio/wav",
              });
            }
          };

          source.connect(processor);
          processor.connect(audioContext.destination);
        } catch (error) {
          console.error("Error accessing microphone:", error);
          stopListening();
        }
      });

      socket.on("message", (message: any) => {
        console.log("Received message:", message);

        // Handle the Sarvam API response format
        if (message.data && typeof message.data === "object") {
          const response: SarvamResponse = message.data;

          // Update transcript
          if (response.transcript) {
            setTranscript((prev) => prev + " " + response.transcript);
          }
        }
        // Fallback handling for different message formats
        else if (message.text) {
          setTranscript((prev) => prev + " " + message.text);
        } else if (message.transcript) {
          setTranscript((prev) => prev + " " + message.transcript);
        }
      });

      socket.on("error", (err: any) => {
        console.error("WebSocket Error:", err);
      });

      socket.on("close", () => {
        console.log("WebSocket closed");
        setListening(false);
      });
    } catch (error) {
      console.error("Error starting speech recognition:", error);
      setListening(false);
    }
  };

  const stopListening = () => {
    // Clean up audio processing
    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect();
      scriptProcessorRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track: MediaStreamTrack) => track.stop());
      streamRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close();
    }

    setListening(false);
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      stopListening();
    };
  }, []);

  return (
    <div className={`h-full flex flex-col ${className}`}>
      {/* Main Content: Transcript Area */}
      <div className="flex-1 bg-white border border-gray-200 rounded-lg overflow-hidden relative">
        {/* Floating Stop Button - Only visible when listening */}
        {listening && (
          <div className="absolute top-4 right-4 z-10">
            <Button
              onClick={stopListening}
              variant="destructive"
              size="sm"
              className="rounded-full shadow-lg hover:shadow-xl transition-all duration-200 animate-pulse"
            >
              <MicOff className="h-4 w-4" />
            </Button>
          </div>
        )}

        <div className="h-full p-6 overflow-y-auto">
          {transcript ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 pb-3 border-b border-gray-100">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">
                    Live Transcript
                  </span>
                </div>
              </div>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-900 leading-relaxed text-base">
                  {transcript}
                </p>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              {listening ? (
                <div className="text-center space-y-6">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-r from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto shadow-lg">
                      <Mic className="h-10 w-10 text-orange-600" />
                    </div>
                    {/* Animated rings */}
                    <div className="absolute inset-0 w-20 h-20 mx-auto">
                      <div className="absolute inset-0 border-2 border-orange-300 rounded-full animate-ping opacity-75"></div>
                      <div className="absolute inset-2 border-2 border-orange-400 rounded-full animate-ping opacity-50 animation-delay-100"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-900 font-semibold text-lg">
                      Listening...
                    </p>
                    <p className="text-gray-500 text-sm">
                      Start reading the story aloud
                    </p>
                  </div>
                </div>
              ) : (
                <div
                  className="text-center space-y-6 cursor-pointer group"
                  onClick={startListening}
                >
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto shadow-md group-hover:shadow-lg transition-all duration-200 group-hover:scale-105">
                      <Mic className="h-10 w-10 text-gray-500 group-hover:text-gray-600 transition-colors" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-900 font-semibold text-lg group-hover:text-blue-600 transition-colors">
                      Ready to practice
                    </p>
                    <p className="text-gray-500 text-sm group-hover:text-blue-500 transition-colors">
                      Click the microphone to begin
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
