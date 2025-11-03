"use client";

import {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { RealtimeClient } from "@speechmatics/real-time-client";
import { createSpeechmaticsJWT } from "@speechmatics/auth";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, CheckCircle2, RotateCcw } from "lucide-react";

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
  onChunksUpdate?: (
    chunks: { text: string; startTime: number; endTime: number }[]
  ) => void;
  placeholderText?: string;
  listeningText?: string;
  readyText?: string;
  clickToStartText?: string;
}

export interface LiveSpeechToTextRef {
  handleRestart: () => void;
  stopListening: () => void;
}

const LiveSpeechToText = forwardRef<LiveSpeechToTextRef, LiveSpeechToTextProps>(
  (
    {
      onChunksUpdate,
      placeholderText = "Start reading the story aloud",
      listeningText = "Listening...",
      readyText = "Ready to practice",
      clickToStartText = "Click the microphone to begin",
    },
    ref
  ) => {
    const [transcript, setTranscript] = useState("");
    const [listening, setListening] = useState(false);
    const [chunks, setChunks] = useState<
      { text: string; startTime: number; endTime: number }[]
    >([]);

    const clientRef = useRef<RealtimeClient | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);

    useEffect(() => {
      onChunksUpdate?.(chunks);
    }, [chunks]);

    const startListening = async () => {
      if (listening) return;

      setTranscript("");
      setChunks([]);
      setListening(true);

      try {
        // Create Speechmatics JWT from API key (client-side for now)
        const apiKey = process.env.NEXT_PUBLIC_SPEECHMATICS_API_KEY as string;
        if (!apiKey) {
          throw new Error("Missing NEXT_PUBLIC_SPEECHMATICS_API_KEY");
        }

        const jwt = await createSpeechmaticsJWT({
          type: "rt",
          apiKey,
          ttl: 60,
        });

        const client = new RealtimeClient();
        clientRef.current = client;

        // Listen for transcript events
        client.addEventListener("receiveMessage", ({ data }: any) => {
          // Final transcripts
          if (data?.message === "AddTranscript") {
            // Accumulate words into full string
            let finalText = "";
            for (const result of data?.results || []) {
              const content = result?.alternatives?.[0]?.content || "";
              if (!content) continue;
              // Insert space before words (per docs)
              if (result?.type === "word") finalText += " ";
              finalText += content;
            }

            const startTime = data?.metadata?.start_time;
            const endTime = data?.metadata?.end_time;

            if (finalText?.trim()) {
              const newChunk = {
                text: finalText.trim(),
                startTime,
                endTime,
              };
              setChunks((prev) => [...prev, newChunk]);
              setTranscript((prev) => `${prev} ${finalText}`.trim());
            }
          }

          if (data?.message === "EndOfTranscript") {
            // Stream finished
            setListening(false);
          }

          if (data?.message === "Error") {
            console.error("Speechmatics Error:", data);
          }
        });

        await client.start(jwt, {
          transcription_config: {
            language: "en",
            operating_point: "enhanced",
            max_delay: 1.0,
            enable_partials: true,
            transcript_filtering_config: {
              remove_disfluencies: true,
            },
          },
          audio_format: {
            type: "raw",
            encoding: "pcm_s16le",
            sample_rate: 16000,
          },
        });

        // Set up microphone capture and stream PCM16 to Speechmatics
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
          if (!clientRef.current) return;
          const inputData = event.inputBuffer.getChannelData(0);
          const int16Data = new Int16Array(inputData.length);
          for (let i = 0; i < inputData.length; i++) {
            int16Data[i] = Math.max(
              -32768,
              Math.min(32767, inputData[i] * 32768)
            );
          }
          const bytes = new Uint8Array(int16Data.buffer);
          try {
            clientRef.current.sendAudio(bytes);
          } catch (e) {
            // Avoid noisy logs if stopping
          }
        };

        source.connect(processor);
        processor.connect(audioContext.destination);
      } catch (error) {
        console.error("Error starting speech recognition:", error);
        setListening(false);
      }
    };

    const stopListening = () => {
      // Clean up audio processing
      if (scriptProcessorRef?.current) {
        scriptProcessorRef?.current?.disconnect();
        scriptProcessorRef.current = null;
      }

      if (audioContextRef?.current) {
        audioContextRef?.current?.close();
        audioContextRef.current = null;
      }

      if (streamRef?.current) {
        streamRef.current
          .getTracks()
          .forEach((track: MediaStreamTrack) => track.stop());
        streamRef.current = null;
      }

      if (clientRef.current) {
        try {
          clientRef.current.stopRecognition({ noTimeout: true });
        } catch (e) {}
      }

      setListening(false);
    };

    const handleRestart = () => {
      stopListening();
      setTranscript("");
      setChunks([]);
    };

    // Expose handleRestart to parent component via ref
    useImperativeHandle(ref, () => ({
      handleRestart,
      stopListening,
    }));

    // Cleanup on component unmount
    useEffect(() => {
      return () => {
        stopListening();
      };
    }, []);

    return (
      <div className={`h-full flex flex-col`}>
        {/* Main Content: Transcript Area */}
        <div className="flex-1 bg-white border border-gray-200 rounded-lg overflow-hidden relative">
          <div className="h-full p-6 overflow-y-auto">
            {transcript ? (
              <div className="space-y-4">
                <div className="space-y-4 pb-4 border-b border-gray-100">
                  {/* Header Section */}
                  <div className="flex justify-between">
                    <div className="flex items-center justify-baseline space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-700">
                        Live Transcript
                      </span>
                    </div>

                    {/* Action Buttons Section */}
                    <div className="flex items-center gap-1">
                      <Button
                        onClick={handleRestart}
                        size="sm"
                        variant="outline"
                        className="border-gray-300 hover:bg-gray-50 text-gray-700 hover:text-gray-900 transition-colors"
                      >
                        <RotateCcw className="h-4 w-4 mr-1.5" />
                        Restart
                      </Button>
                      {listening && (
                        <Button
                          onClick={stopListening}
                          variant="destructive"
                          size="sm"
                          className="rounded-full shadow-lg hover:shadow-xl transition-all duration-200 animate-pulse"
                        >
                          <MicOff className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
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
                        {listeningText}
                      </p>
                      <p className="text-gray-500 text-sm">{placeholderText}</p>
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
                        {readyText}
                      </p>
                      <p className="text-gray-500 text-sm group-hover:text-blue-500 transition-colors">
                        {clickToStartText}
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
);

LiveSpeechToText.displayName = "LiveSpeechToText";

export default LiveSpeechToText;
