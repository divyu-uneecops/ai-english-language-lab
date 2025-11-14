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
import { Mic, CheckCircle2 } from "lucide-react";

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
  onListeningChange?: (listening: boolean) => void;
  onTranscriptChange?: (transcript: string) => void;
  placeholderText?: string;
  listeningText?: string;
  readyText?: string;
  clickToStartText?: string;
}

export interface LiveSpeechToTextRef {
  handleRestart: () => void;
  stopListening: () => void;
  startListening: () => void;
  getTranscript: () => string;
  isListening: () => boolean;
}

const LiveSpeechToText = forwardRef<LiveSpeechToTextRef, LiveSpeechToTextProps>(
  (
    {
      onChunksUpdate,
      onListeningChange,
      onTranscriptChange,
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

    useEffect(() => {
      onListeningChange?.(listening);
    }, [listening]);

    useEffect(() => {
      onTranscriptChange?.(transcript);
    }, [transcript]);

    const startListening = async () => {
      if (listening) return;

      setTranscript("");
      setChunks([]);

      try {
        // Create Speechmatics JWT from API key (client-side for now)
        const apiKey = process.env.NEXT_PUBLIC_SPEECHMATICS_API_KEY as string;
        if (!apiKey) {
          throw new Error("Missing NEXT_PUBLIC_SPEECHMATICS_API_KEY");
        }

        // Start JWT fetch and getUserMedia in parallel
        const [jwt, stream] = await Promise.all([
          createSpeechmaticsJWT({
            type: "rt",
            apiKey,
            ttl: 60,
          }),
          navigator.mediaDevices.getUserMedia({
            audio: {
              sampleRate: 16000,
              channelCount: 1,
              echoCancellation: true,
              noiseSuppression: true,
            },
          }),
        ]);
        streamRef.current = stream;

        setListening(true);

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

    // Expose methods to parent component via ref
    useImperativeHandle(ref, () => ({
      handleRestart,
      stopListening,
      startListening,
      getTranscript: () => transcript,
      isListening: () => listening,
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
                  <div className="flex items-center justify-baseline space-x-2">
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
                    <div className="relative flex flex-col items-center gap-4">
                      <div className="flex flex-col items-center space-y-1 mb-2">
                        <p className="text-gray-500 text-base group-hover:text-blue-600 transition-colors">
                          {clickToStartText}
                        </p>
                      </div>
                      <div className="relative flex items-center justify-center mt-2">
                        {/* Soft animated halo */}
                        <span className="absolute inline-flex h-24 w-24 rounded-full bg-blue-100 opacity-60 animate-pulse-slow"></span>
                        <span className="absolute inline-flex h-28 w-28 rounded-full bg-blue-200 opacity-40 animate-pulse-extra-slow"></span>
                        <button
                          type="button"
                          aria-label="Start Voice Input"
                          className="relative z-10 w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-200 rounded-full shadow-lg flex items-center justify-center border-2 border-blue-300 group-hover:scale-110 group-hover:shadow-2xl group-active:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-200"
                        >
                          <Mic className="h-10 w-10 text-blue-600 transition-colors group-hover:text-blue-800" />
                        </button>
                      </div>
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
