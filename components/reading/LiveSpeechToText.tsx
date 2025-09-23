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
    <div className={`h-full flex flex-col space-y-6 ${className}`}>
      {/* Professional Header - Clean & Functional */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
        <Button
          onClick={listening ? stopListening : startListening}
          variant={listening ? "destructive" : "default"}
          className="font-medium"
        >
          {listening ? (
            <>
              <MicOff className="h-4 w-4 mr-2" />
              Stop Recording
            </>
          ) : (
            <>
              <Mic className="h-4 w-4 mr-2" />
              Start Recording
            </>
          )}
        </Button>
      </div>

      {/* Main Content: Transcript Area */}
      <div className="flex-1 bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="h-full p-6 overflow-y-auto">
          {transcript ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-2 pb-2 border-b border-gray-100">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">
                  Live Transcript
                </span>
              </div>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-900 leading-relaxed">{transcript}</p>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              {listening ? (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
                    <Mic className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium">Listening...</p>
                    <p className="text-gray-500 text-sm mt-1">
                      Start reading aloud
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                    <Mic className="h-8 w-8 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium">
                      Ready to practice
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      Click "Start Recording" to begin
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
