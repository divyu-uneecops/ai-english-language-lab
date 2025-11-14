"use client";

import { useState, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Mic, Loader2, Sparkles, MicOff, RotateCcw, Send } from "lucide-react";
import LiveSpeechToText, {
  LiveSpeechToTextRef,
} from "@/components/shared/components/LiveSpeechToText";
import { getDifficultyColor, getLevelColor, isEmpty } from "@/lib/utils";
import {
  SpeakingTopicComponentProps,
  SpeakingEvaluationData,
} from "../types/index";
import { speakingService } from "@/services/speakingService";
import { SpeakingEvaluationResults } from "../../shared/components/SpeakingEvaluationResults";

export function SpeakingTopicComponent({
  topic,
  onBack,
}: SpeakingTopicComponentProps) {
  const [speechChunks, setSpeechChunks] = useState<
    { text: string; startTime: number; endTime: number }[]
  >([]);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<SpeakingEvaluationData | null>(
    null
  );
  const [showEvaluation, setShowEvaluation] = useState(false);
  const liveSpeechRef = useRef<LiveSpeechToTextRef>(null);

  const handleSubmitForEvaluation = async () => {
    liveSpeechRef.current?.stopListening();
    if (speechChunks?.length === 0) {
      alert("Please speak something before submitting for evaluation");
      return;
    }

    setIsEvaluating(true);

    try {
      const evaluationData = await speakingService.submitForEvaluation(
        speechChunks,
        topic?.topic_id
      );
      // Add transcription to evaluation data
      setEvaluation(evaluationData);
      setShowEvaluation(true);
      // Submission history removed
    } catch (error) {
      alert(
        "An error occurred while evaluating your speech. Please try again."
      );
    } finally {
      setIsEvaluating(false);
    }
  };

  // Removed submissions list helpers

  const handleCloseEvaluation = () => {
    onBack();
  };

  const handlePracticeAgain = () => {
    setShowEvaluation(false);
    setSpeechChunks([]);
    setTranscript("");
    liveSpeechRef.current?.handleRestart();
  };

  const handleStopListening = () => {
    liveSpeechRef.current?.stopListening();
  };

  const handleRestartListening = () => {
    liveSpeechRef.current?.handleRestart();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Bar - HackerRank Style */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <nav className="flex items-center space-x-2 text-sm text-gray-500">
              <span
                className="hover:text-blue-600 transition-colors cursor-pointer"
                onClick={onBack}
              >
                Speaking
              </span>
              <span>/</span>
              <span className="text-gray-900 font-medium">{topic?.title}</span>
            </nav>
          </div>
          <div className="flex items-center space-x-3">
            <Badge
              variant="secondary"
              className={`text-xs font-medium px-3 py-1 capitalize ${getLevelColor(
                topic?.level
              )}`}
            >
              {topic?.level}
            </Badge>
            <Badge
              variant="secondary"
              className={`text-xs font-medium px-3 py-1 capitalize ${getDifficultyColor(
                topic?.difficulty
              )}`}
            >
              {topic?.difficulty}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content - Two Panel Layout */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Topic Only */}
        <div className="flex-1 bg-white border-r border-gray-200 flex flex-col">
          <div className="bg-gray-50 border-b border-gray-200 px-6 h-16 flex items-center">
            <h3 className="text-base font-semibold text-gray-900">Topic</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-6 m-0">
            <div className="space-y-6">
              {/* Topic Card */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Mic className="h-5 w-5 text-blue-600" />
                  <h3 className="text-base font-semibold text-gray-900">
                    Your Speaking Topic
                  </h3>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                  <p className="text-gray-800 leading-relaxed text-lg">
                    {topic?.description}
                  </p>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">
                  How to Practice:
                </h4>
                <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                  <li>Read the topic carefully</li>
                  <li>Think about your response for a moment</li>
                  <li>Click the microphone icon to start recording</li>
                  <li>Speak naturally and clearly about the topic</li>
                  <li>Review your transcript and practice again if needed</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Speech Practice */}
        <div className="w-1/2 bg-white flex flex-col">
          {/* Right Panel Header */}
          <div className="bg-gray-50 border-b border-gray-200 px-6 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-1 h-6 bg-green-500 rounded-full"></div>
              <h2 className="text-lg font-semibold text-gray-900">
                Live Speech Recognition
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {isListening ? (
                <Button
                  onClick={handleStopListening}
                  variant="destructive"
                  size="sm"
                  className="shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <MicOff className="h-4 w-4 mr-1.5" />
                  Stop
                </Button>
              ) : transcript ? (
                <>
                  <Button
                    onClick={handleRestartListening}
                    size="sm"
                    variant="outline"
                    className="border-gray-300 hover:bg-gray-50 text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    <RotateCcw className="h-4 w-4 mr-1.5" />
                    Restart
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSubmitForEvaluation}
                    disabled={isEvaluating || speechChunks.length === 0}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                  >
                    {isEvaluating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Evaluating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Get AI Feedback
                      </>
                    )}
                  </Button>
                </>
              ) : null}
            </div>
          </div>

          {/* Speech Practice Content */}
          <div className="flex-1 overflow-hidden flex flex-col p-6 space-y-4">
            <div className="flex-1 overflow-hidden">
              <LiveSpeechToText
                ref={liveSpeechRef}
                onChunksUpdate={setSpeechChunks}
                onListeningChange={setIsListening}
                onTranscriptChange={setTranscript}
                placeholderText="Start speaking about your topic"
                listeningText="Listening to your speech..."
                readyText="Ready to speak"
                clickToStartText="Click the microphone to start speaking"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Evaluation Results Dialog */}
      <Dialog open={showEvaluation} onOpenChange={setShowEvaluation}>
        <DialogContent
          className="sm:max-w-6xl max-h-[90vh] overflow-hidden p-0 rounded-2xl shadow-2xl border-0"
          showCloseButton={false}
        >
          <div className="overflow-y-auto max-h-[90vh]">
            {evaluation && (
              <SpeakingEvaluationResults
                evaluation={evaluation}
                onClose={handleCloseEvaluation}
                onRevise={handlePracticeAgain}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
