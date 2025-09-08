"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, CheckCircle, Volume2 } from "lucide-react"

interface SpeakingExerciseData {
  id: number
  title: string
  type: "reading" | "conversation"
  content: any
}

interface SpeakingExerciseProps {
  exercise: SpeakingExerciseData
  onComplete: () => void
}

export function SpeakingExercise({ exercise, onComplete }: SpeakingExerciseProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null)
  const [currentScenario, setCurrentScenario] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

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
    if (exercise.type === "reading") {
      const utterance = new SpeechSynthesisUtterance(exercise.content.text)
      utterance.rate = 0.8
      speechSynthesis.speak(utterance)
    }
  }

  const handleComplete = () => {
    setIsCompleted(true)
    onComplete()
  }

  if (exercise.type === "reading") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{exercise.title}</CardTitle>
          <p className="text-muted-foreground">Read the story aloud with clear pronunciation and natural expression.</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Button onClick={playExample} variant="outline" className="flex items-center gap-2 bg-transparent">
                <Volume2 className="h-4 w-4" />
                Listen to Example
              </Button>
            </div>

            <div className="p-6 bg-muted/50 rounded-lg">
              <h3 className="text-xl font-bold mb-4">{exercise.content.title}</h3>
              <div className="space-y-4 text-lg leading-relaxed">
                {exercise.content.text.split("\n\n").map((paragraph: string, index: number) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Focus Points:</h4>
              <ul className="space-y-2">
                {exercise.content.focusPoints.map((point: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span className="text-sm">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">Record yourself reading the story aloud</p>

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
            </div>

            {recordedAudio && (
              <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                <audio controls src={recordedAudio} className="w-full max-w-md mx-auto" />
                <Button onClick={handleComplete} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Complete Exercise
                </Button>
              </div>
            )}
          </div>

          {isCompleted && (
            <div className="text-center p-6 bg-secondary/10 rounded-lg">
              <CheckCircle className="h-12 w-12 text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-secondary mb-2">Exercise Complete!</h3>
              <p className="text-muted-foreground">
                Great job reading aloud! Your fluency and expression are improving.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  // Conversation practice
  const scenario = exercise.content.scenarios[currentScenario]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">{exercise.title}</CardTitle>
          <Badge variant="secondary">
            Scenario {currentScenario + 1} of {exercise.content.scenarios.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="p-4 bg-primary/10 rounded-lg">
            <h3 className="font-bold text-primary mb-2">Situation:</h3>
            <p>{scenario.situation}</p>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-semibold mb-2">Your Task:</h4>
            <p className="text-lg">{scenario.prompt}</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">Tips for Success:</h4>
            <ul className="space-y-1">
              {scenario.tips.map((tip: string, index: number) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-secondary">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">Record your response to this scenario</p>

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
          </div>

          {recordedAudio && (
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <audio controls src={recordedAudio} className="w-full max-w-md mx-auto" />
              <div className="flex justify-center gap-2">
                {currentScenario < exercise.content.scenarios.length - 1 ? (
                  <Button
                    onClick={() => {
                      setCurrentScenario((prev) => prev + 1)
                      setRecordedAudio(null)
                    }}
                    className="flex items-center gap-2"
                  >
                    Next Scenario
                  </Button>
                ) : (
                  <Button onClick={handleComplete} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Complete Exercise
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        {isCompleted && (
          <div className="text-center p-6 bg-secondary/10 rounded-lg">
            <CheckCircle className="h-12 w-12 text-secondary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-secondary mb-2">All Scenarios Complete!</h3>
            <p className="text-muted-foreground">
              Excellent work on your conversation practice! Your speaking confidence is growing.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
