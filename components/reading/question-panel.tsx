"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  correct: number | string;
  explanation?: string;
}

interface QuestionPanelProps {
  questions: Question[];
  onComplete: (questionIds: number[]) => void;
}

export function QuestionPanel({ questions, onComplete }: QuestionPanelProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number | string }>(
    {}
  );
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [textAnswer, setTextAnswer] = useState<string>("");

  const handleAnswerSelect = (value: string) => {
    setSelectedAnswer(value);
  };

  const handleNextQuestion = () => {
    const question = questions[currentQuestion];
    const hasOptions = question.options && question.options.length > 0;
    const hasAnswer = hasOptions ? selectedAnswer : textAnswer.trim();

    if (hasAnswer) {
      const answerValue = hasOptions
        ? Number.parseInt(selectedAnswer)
        : textAnswer.trim();
      setAnswers((prev) => ({
        ...prev,
        [question.id]: answerValue,
      }));

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setSelectedAnswer("");
        setTextAnswer("");
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
      if (!question) return false;

      // For multiple choice questions
      if (question.options && question.options.length > 0) {
        return question.correct === answer;
      }

      // For text questions - case-insensitive comparison
      if (typeof question.correct === "string" && typeof answer === "string") {
        return (
          question.correct.toLowerCase().trim() === answer.toLowerCase().trim()
        );
      }

      return false;
    }
  ).length;

  const scorePercentage = Math.round((correctAnswers / questions.length) * 100);

  if (showResults) {
    return (
      <div className="p-12">
        {/* Enterprise Results Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto mb-6 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center">
            <Trophy className="h-10 w-10 text-neutral-600 dark:text-neutral-400" />
          </div>
          <h2 className="text-3xl font-light text-neutral-900 dark:text-neutral-100 mb-4 tracking-tight">
            Assessment Complete
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 font-light">
            Review your performance and understanding
          </p>
        </div>

        {/* Enterprise Score */}
        <div className="text-center mb-12">
          <div className="text-6xl font-light text-neutral-900 dark:text-neutral-100 mb-4 tracking-tight">
            {scorePercentage}%
          </div>
          <p className="text-lg text-neutral-500 dark:text-neutral-400 font-light">
            {correctAnswers} of {questions.length} questions answered correctly
          </p>
        </div>

        {/* Enterprise Question Review */}
        <div className="space-y-6 mb-12">
          <h3 className="text-xl font-light text-neutral-900 dark:text-neutral-100 mb-8">
            Detailed Review
          </h3>
          {questions.map((question, index) => {
            const userAnswer = answers[question.id];
            const hasOptions = question.options && question.options.length > 0;
            let isCorrect = false;
            let userAnswerText = "";
            let correctAnswerText = "";

            if (hasOptions) {
              // Multiple choice question
              isCorrect = userAnswer === question.correct;
              userAnswerText =
                question.options[userAnswer as number] || "No answer";
              correctAnswerText =
                question.options[question.correct as number] || "";
            } else {
              // Text question
              isCorrect =
                typeof question.correct === "string" &&
                typeof userAnswer === "string"
                  ? question.correct.toLowerCase().trim() ===
                    userAnswer.toLowerCase().trim()
                  : false;
              userAnswerText = (userAnswer as string) || "No answer";
              correctAnswerText = (question.correct as string) || "";
            }

            return (
              <div
                key={question.id}
                className="p-8 border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center mt-1 ${
                      isCorrect
                        ? "bg-green-100 dark:bg-green-900/30"
                        : "bg-red-100 dark:bg-red-900/30"
                    }`}
                  >
                    {isCorrect ? (
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-light text-neutral-900 dark:text-neutral-100 mb-4 leading-relaxed">
                      {question.question}
                    </p>
                    <div className="space-y-3 text-sm">
                      <div className="p-3 bg-white dark:bg-neutral-800 rounded-sm border border-neutral-200 dark:border-neutral-700">
                        <span className="text-neutral-500 dark:text-neutral-400 font-medium">
                          Your answer:
                        </span>
                        <span className="ml-2 font-light text-neutral-900 dark:text-neutral-100">
                          {userAnswerText}
                        </span>
                      </div>
                      {!isCorrect && (
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-sm border border-green-200 dark:border-green-800">
                          <span className="text-green-700 dark:text-green-400 font-medium">
                            Correct answer:
                          </span>
                          <span className="ml-2 font-light text-green-800 dark:text-green-300">
                            {correctAnswerText}
                          </span>
                        </div>
                      )}
                      {question.explanation && (
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-sm border border-blue-200 dark:border-blue-800">
                          <span className="text-blue-700 dark:text-blue-400 font-medium">
                            Explanation:
                          </span>
                          <p className="mt-2 text-blue-800 dark:text-blue-300 font-light leading-relaxed">
                            {question.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enterprise Action Button */}
        <div className="text-center">
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-4 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-sm font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors flex items-center gap-3 mx-auto"
          >
            <RotateCcw className="h-5 w-5" />
            Continue Learning
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="p-8">
      {/* Modern Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Question {currentQuestion + 1} of {questions.length}
            </h2>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {Math.round(progress)}% Complete
            </div>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Modern Question */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 leading-relaxed">
          {question.question}
        </h3>

        {/* Modern Multiple Choice Questions */}
        {question.options && question.options.length > 0 ? (
          <RadioGroup value={selectedAnswer} onValueChange={handleAnswerSelect}>
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors cursor-pointer bg-white dark:bg-gray-800 rounded-lg"
                >
                  <RadioGroupItem
                    value={index.toString()}
                    id={`option-${index}`}
                    className="border-gray-300 dark:border-gray-600"
                  />
                  <Label
                    htmlFor={`option-${index}`}
                    className="flex-1 cursor-pointer text-gray-900 dark:text-gray-100"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        ) : (
          /* Modern Text Input Questions */
          <div className="space-y-4">
            <Label
              htmlFor="text-answer"
              className="text-sm font-medium text-gray-900 dark:text-gray-100"
            >
              Your Answer
            </Label>
            <Textarea
              id="text-answer"
              placeholder="Enter your answer here..."
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              className="min-h-[120px] resize-none border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500"
            />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Provide your response based on your understanding of the passage.
            </p>
          </div>
        )}
      </div>

      {/* Modern Action Button */}
      <Button
        onClick={handleNextQuestion}
        disabled={
          question.options && question.options.length > 0
            ? !selectedAnswer
            : !textAnswer.trim()
        }
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        {currentQuestion < questions.length - 1
          ? "Next Question"
          : "Finish Quiz"}
        <ArrowRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
}
