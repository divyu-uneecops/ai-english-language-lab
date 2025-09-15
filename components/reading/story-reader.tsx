"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, ArrowRight } from "lucide-react";

interface Story {
  id: number;
  title: string;
  content: string;
}

interface StoryReaderProps {
  story: Story;
  onComplete: () => void;
}

export function StoryReader({ story, onComplete }: StoryReaderProps) {
  const [readingProgress, setReadingProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const paragraphs = story.content.split("\n\n").filter((p) => p.trim());

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setReadingProgress(Math.min(scrollPercent, 100));

      if (scrollPercent > 80 && !isCompleted) {
        setIsCompleted(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isCompleted]);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="text-xl font-semibold">{story.title}</CardTitle>
          {isCompleted && (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Completed</span>
            </div>
          )}
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Reading Progress</span>
            <span className="font-medium">{Math.round(readingProgress)}%</span>
          </div>
          <Progress value={readingProgress} className="h-2" />
        </div>
      </div>

      {/* Story Content */}
      <div className="space-y-6 mb-8">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="text-base leading-relaxed text-foreground">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Completion Section */}
      {isCompleted && (
        <div className="pt-6 border-t border-border/50">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 mb-4">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Story completed!</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              You've finished reading the story. Now let's test your
              comprehension.
            </p>
            <Button onClick={onComplete} className="flex items-center gap-2">
              Answer Comprehension Questions
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
