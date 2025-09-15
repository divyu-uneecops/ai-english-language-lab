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
  const paragraphs = story.content.split("\n\n").filter((p) => p.trim());

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="text-xl font-semibold">{story.title}</CardTitle>
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
      {
        <div className="pt-6 border-t border-border/50">
          <div className="text-center space-y-4">
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
      }
    </div>
  );
}
