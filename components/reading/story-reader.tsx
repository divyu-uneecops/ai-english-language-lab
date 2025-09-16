"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, ArrowRight } from "lucide-react";

interface Story {
  id: string;
  title: string;
  content: string;
}

interface StoryReaderProps {
  story: Story;
  onComplete: () => void;
}

export function StoryReader({ story, onComplete }: StoryReaderProps) {
  const paragraphs = story.content.split("\n\n").filter((p) => p.trim());

  return (
    <div className="p-8">
      {/* Modern Story Content */}
      <div className="max-w-3xl mx-auto">
        <div className="space-y-6 mb-8">
          {paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className="text-lg leading-relaxed text-gray-700 dark:text-gray-300"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* Modern Completion Section */}
      <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
            You've finished reading the story. Now let's test your comprehension
            with some questions.
          </p>
          <Button
            onClick={onComplete}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Start Questions
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
