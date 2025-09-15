"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  XCircle,
  Trophy,
  ArrowRight,
  RotateCcw,
} from "lucide-react";

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
}

interface QuestionPanelProps {
  questions: Question[];
  onComplete: (questionIds: number[]) => void;
}

export function QuestionPanel({ questions, onComplete }: QuestionPanelProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");

  const handleAnswerSelect = (value: string) => {
    setSelectedAnswer(value);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer) {
      setAnswers((prev) => ({
        ...prev,
        [questions[currentQuestion].id]: Number.parseInt(selectedAnswer),
      }));

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setSelectedAnswer("");
      } else {
        setShowResults(true);
        onComplete(questions.map((q) => q.id));
      }
    }
  };

  const correctAnswers = Object.entries(answers).filter(
    ([questionId, answer]) => {
      const question = questions.find(
        (q) => q.id === Number.parseInt(questionId)
      );
      return question && question.correct === answer;
    }
  ).length;

  const scorePercentage = Math.round((correctAnswers / questions.length) * 100);

  if (showResults) {
    return (
      <div className="p-6">
        {/* Results Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-green-50 dark:bg-green-950/30">
              <Trophy className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h2 className="text-xl font-semibold mb-2">Quiz Complete!</h2>
          <p className="text-muted-foreground">Here are your results</p>
        </div>

        {/* Score */}
        <div className="text-center mb-8">
          <div className="text-4xl font-bold text-foreground mb-2">
            {scorePercentage}%
          </div>
          <p className="text-muted-foreground">
            You got {correctAnswers} out of {questions.length} questions correct
          </p>
        </div>

        {/* Question Review */}
        <div className="space-y-4 mb-8">
          <h3 className="font-semibold text-foreground">Question Review</h3>
          {questions.map((question, index) => {
            const userAnswer = answers[question.id];
            const isCorrect = userAnswer === question.correct;

            return (
              <div
                key={question.id}
                className="p-4 border border-border/50 rounded-lg"
              >
                <div className="flex items-start gap-3">
                  {isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-foreground mb-2">
                      {question.question}
                    </p>
                    <div className="space-y-1 text-sm">
                      <p className="text-muted-foreground">
                        Your answer:{" "}
                        <span className="font-medium">
                          {question.options[userAnswer]}
                        </span>
                      </p>
                      {!isCorrect && (
                        <p className="text-green-600 dark:text-green-400">
                          Correct answer:{" "}
                          <span className="font-medium">
                            {question.options[question.correct]}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="text-center">
          <Button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Try Another Story
          </Button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            Question {currentQuestion + 1} of {questions.length}
          </h2>
          <div className="text-sm text-muted-foreground">
            {Math.round(progress)}% Complete
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question */}
      <div className="mb-6">
        <h3 className="text-base font-medium text-foreground mb-4">
          {question.question}
        </h3>

        <RadioGroup value={selectedAnswer} onValueChange={handleAnswerSelect}>
          <div className="space-y-2">
            {question.options.map((option, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 border border-border/50 rounded-lg hover:bg-muted/30 transition-colors"
              >
                <RadioGroupItem
                  value={index.toString()}
                  id={`option-${index}`}
                />
                <Label
                  htmlFor={`option-${index}`}
                  className="flex-1 cursor-pointer text-sm"
                >
                  {option}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </div>

      {/* Action Button */}
      <Button
        onClick={handleNextQuestion}
        disabled={!selectedAnswer}
        className="w-full flex items-center gap-2"
      >
        {currentQuestion < questions.length - 1
          ? "Next Question"
          : "Finish Quiz"}
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
