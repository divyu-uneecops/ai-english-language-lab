"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, RotateCcw, CheckCircle, Volume2 } from "lucide-react"

interface Word {
  word: string
  phonetic: string
  audio: string
}

interface PronunciationExercise {
  id: number
  title: string
  content: {
    words: Word[]
  }
}

interface PronunciationPracticeProps {
  exercise: PronunciationExercise
  onComplete: () => void
}

export function PronunciationPractice({ exercise, onComplete }: PronunciationPracticeProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null)
  const [completedWords, setCompletedWords] = useState<number[]>([])
  const [feedback, setFeedback] = useState<string>("")

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  const currentWord = exercise.content.words[currentWordIndex]
  const progress = ((currentWordIndex + 1) / exercise.content.words.length) * 100

  useEffect(() => {
    if (completedWords.length === exercise.content.words.length) {
      onComplete()
    }
  }, [completedWords, exercise.content.words.length, onComplete])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
        const audioUrl = URL.createObjectURL(audioBlob)
        setRecordedAudio(audioUrl)

        // Simulate pronunciation feedback
        const feedbacks = [
          "Great pronunciation! Your accent is clear.",
          "Good effort! Try to emphasize the stressed syllables more.",
          "Well done! Your pronunciation is improving.",
          "Nice work! Focus on the vowel sounds next time.",
          "Excellent! Your pronunciation is very clear.",
        ]
        setFeedback(feedbacks[Math.floor(Math.random() * feedbacks.length)])
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error("Error accessing microphone:", error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())
      setIsRecording(false)
    }
  }

  const playExample = () => {
    // In a real app, this would play the actual audio file
    const utterance = new SpeechSynthesisUtterance(currentWord.word)
    utterance.rate = 0.8
    speechSynthesis.speak(utterance)
  }

  const markWordComplete = () => {
    setCompletedWords((prev) => [...prev, currentWordIndex])
    setRecordedAudio(null)
    setFeedback("")

    if (currentWordIndex < exercise.content.words.length - 1) {
      setCurrentWordIndex((prev) => prev + 1)
    }
  }

  const resetRecording = () => {
    setRecordedAudio(null)
    setFeedback("")
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">{exercise.title}</CardTitle>
          <Badge variant="secondary">
            {currentWordIndex + 1} of {exercise.content.words.length}
          </Badge>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <h3 className="text-4xl font-bold text-primary">{currentWord.word}</h3>
            <p className="text-lg text-muted-foreground">{currentWord.phonetic}</p>
          </div>

          <Button onClick={playExample} variant="outline" className="flex items-center gap-2 bg-transparent">
            <Volume2 className="h-4 w-4" />
            Listen to Example
          </Button>
        </div>

        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">Click the microphone to record your pronunciation</p>

            <div className="flex justify-center gap-4">
              {!isRecording ? (
                <Button onClick={startRecording} size="lg" className="flex items-center gap-2">
                  <Mic className="h-5 w-5" />
                  Start Recording
                </Button>
              ) : (
                <Button onClick={stopRecording} variant="destructive" size="lg" className="flex items-center gap-2">
                  <MicOff className="h-5 w-5" />
                  Stop Recording
                </Button>
              )}

              {recordedAudio && (
                <Button
                  onClick={resetRecording}
                  variant="outline"
                  size="lg"
                  className="flex items-center gap-2 bg-transparent"
                >
                  <RotateCcw className="h-4 w-4" />
                  Try Again
                </Button>
              )}
            </div>
          </div>

          {recordedAudio && (
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-center">
                <audio controls src={recordedAudio} className="w-full max-w-md" />
              </div>

              {feedback && (
                <div className="text-center space-y-2">
                  <p className="text-sm font-medium text-secondary">{feedback}</p>
                  <Button onClick={markWordComplete} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Mark Complete & Continue
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {completedWords.length === exercise.content.words.length && (
          <div className="text-center p-6 bg-primary/10 rounded-lg">
            <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-primary mb-2">Exercise Complete!</h3>
            <p className="text-muted-foreground">
              Great job practicing pronunciation! You've completed all {exercise.content.words.length} words.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
