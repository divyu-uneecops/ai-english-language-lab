"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Mic,
  MessageCircle,
  CheckCircle,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { PronunciationPractice } from "./pronunciation-practice";
import { SpeakingExercise } from "./speaking-exercise";
import { ChatPanel } from "../reading/chat-panel";

const exercises = [
  {
    id: 1,
    title: "Basic Pronunciation",
    difficulty: "Beginner",
    duration: "10 min",
    description: "Practice common English sounds and word pronunciation.",
    type: "pronunciation" as const,
    content: {
      words: [
        { word: "hello", phonetic: "/həˈloʊ/", audio: "hello.mp3" },
        { word: "world", phonetic: "/wɜːrld/", audio: "world.mp3" },
        { word: "beautiful", phonetic: "/ˈbjuːtɪfəl/", audio: "beautiful.mp3" },
        {
          word: "pronunciation",
          phonetic: "/prəˌnʌnsiˈeɪʃən/",
          audio: "pronunciation.mp3",
        },
        { word: "language", phonetic: "/ˈlæŋɡwɪdʒ/", audio: "language.mp3" },
      ],
    },
  },
  {
    id: 2,
    title: "Story Reading Aloud",
    difficulty: "Intermediate",
    duration: "15 min",
    description:
      "Read a short story aloud and practice fluency and expression.",
    type: "reading" as const,
    content: {
      title: "The Morning Walk",
      text: `Every morning, Sarah takes a peaceful walk through the neighborhood park. She enjoys listening to the birds singing in the tall oak trees and watching the sunrise paint the sky in beautiful colors.

The fresh morning air fills her lungs as she walks along the winding path. Other early risers wave and smile as they pass by, creating a sense of community and connection.

This daily routine helps Sarah start her day with a positive mindset and renewed energy for whatever challenges lie ahead.`,
      focusPoints: [
        "Clear pronunciation of each word",
        "Natural pauses between sentences",
        "Expressive tone that matches the content",
        "Proper stress on important words",
      ],
    },
  },
  {
    id: 3,
    title: "Conversation Practice",
    difficulty: "Advanced",
    duration: "20 min",
    description: "Practice natural conversation flow and responses.",
    type: "conversation" as const,
    content: {
      scenarios: [
        {
          situation: "Introducing yourself at a job interview",
          prompt:
            "Tell me about yourself and why you're interested in this position.",
          tips: [
            "Speak clearly and confidently",
            "Use professional language",
            "Maintain good pace",
          ],
        },
        {
          situation: "Ordering food at a restaurant",
          prompt:
            "You're at a restaurant. Order your meal and ask about ingredients.",
          tips: [
            "Be polite and clear",
            "Ask follow-up questions",
            "Use appropriate intonation",
          ],
        },
        {
          situation: "Giving directions to a tourist",
          prompt: "A tourist asks you for directions to the nearest museum.",
          tips: [
            "Speak slowly and clearly",
            "Use simple, direct language",
            "Be helpful and friendly",
          ],
        },
      ],
    },
  },
];

export function SpeakingInterface() {
  const [selectedExercise, setSelectedExercise] = useState<number | null>(null);
  const [completedExercises, setCompletedExercises] = useState<number[]>([]);

  const currentExercise = selectedExercise
    ? exercises.find((e) => e.id === selectedExercise)
    : null;

  const handleExerciseComplete = (exerciseId: number) => {
    setCompletedExercises((prev) => [...prev, exerciseId]);
  };

  if (selectedExercise && currentExercise) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <div
            onClick={() => {
              setSelectedExercise(null);
            }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Exercises
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{currentExercise.difficulty}</Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {currentExercise.duration}
            </Badge>
          </div>
        </div>

        <div>
          <div>
            {currentExercise.type === "pronunciation" ? (
              <PronunciationPractice
                exercise={currentExercise}
                onComplete={() => handleExerciseComplete(currentExercise.id)}
              />
            ) : (
              <SpeakingExercise
                exercise={currentExercise}
                onComplete={() => handleExerciseComplete(currentExercise.id)}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/">
          <div className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </div>
        </Link>{" "}
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">
          Choose a Speaking Exercise
        </h2>
        <p className="text-muted-foreground">
          Select an exercise below to practice your speaking skills. You can
          record yourself, get feedback, and ask our AI assistant for help.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exercises.map((exercise) => (
          <Card
            key={exercise.id}
            className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-secondary/20"
            onClick={() => setSelectedExercise(exercise.id)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{exercise.title}</CardTitle>
                {completedExercises.includes(exercise.id) && (
                  <CheckCircle className="h-5 w-5 text-secondary" />
                )}
              </div>
              <div className="flex gap-2">
                <Badge variant="secondary">{exercise.difficulty}</Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {exercise.duration}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {exercise.description}
              </p>
              <Button variant="secondary" className="w-full">
                <Mic className="h-4 w-4 mr-2" />
                Start Practice
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
