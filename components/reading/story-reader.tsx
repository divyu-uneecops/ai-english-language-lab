"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle } from "lucide-react"

interface Story {
  id: number
  title: string
  content: string
}

interface StoryReaderProps {
  story: Story
  onComplete: () => void
}

export function StoryReader({ story, onComplete }: StoryReaderProps) {
  const [readingProgress, setReadingProgress] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)

  const paragraphs = story.content.split("\n\n").filter((p) => p.trim())

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = (scrollTop / docHeight) * 100
      setReadingProgress(Math.min(scrollPercent, 100))

      if (scrollPercent > 80 && !isCompleted) {
        setIsCompleted(true)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isCompleted])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">{story.title}</CardTitle>
          {isCompleted && <CheckCircle className="h-6 w-6 text-primary" />}
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Reading Progress</span>
            <span>{Math.round(readingProgress)}%</span>
          </div>
          <Progress value={readingProgress} className="h-2" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="text-lg leading-relaxed text-foreground">
            {paragraph}
          </p>
        ))}

        {isCompleted && (
          <div className="pt-6 border-t">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 text-primary">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Story completed!</span>
              </div>
              <Button onClick={onComplete} size="lg">
                Answer Comprehension Questions
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
