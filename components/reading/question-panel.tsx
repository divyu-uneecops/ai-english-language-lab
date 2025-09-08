"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CheckCircle, XCircle, Trophy } from "lucide-react"

interface Question {
  id: number
  question: string
  options: string[]
  correct: number
}

interface QuestionPanelProps {
  questions: Question[]
  onComplete: (questionIds: number[]) => void
}

export function QuestionPanel({ questions, onComplete }: QuestionPanelProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ [key: number]: number }>({})
  const [showResults, setShowResults] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string>("")

  const handleAnswerSelect = (value: string) => {
    setSelectedAnswer(value)
  }

  const handleNextQuestion = () => {
    if (selectedAnswer) {
      setAnswers((prev) => ({
        ...prev,
        [questions[currentQuestion].id]: Number.parseInt(selectedAnswer),
      }))

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1)
        setSelectedAnswer("")
      } else {
        setShowResults(true)
        onComplete(questions.map((q) => q.id))
      }
    }
  }

  const correctAnswers = Object.entries(answers).filter(([questionId, answer]) => {
    const question = questions.find((q) => q.id === Number.parseInt(questionId))
    return question && question.correct === answer
  }).length

  const scorePercentage = Math.round((correctAnswers / questions.length) * 100)

  if (showResults) {
    return (
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Trophy className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="space-y-2">
            <div className="text-4xl font-bold text-primary">{scorePercentage}%</div>
            <p className="text-muted-foreground">
              You got {correctAnswers} out of {questions.length} questions correct
            </p>
          </div>

          <div className="space-y-4">
            {questions.map((question, index) => {
              const userAnswer = answers[question.id]
              const isCorrect = userAnswer === question.correct

              return (
                <div key={question.id} className="text-left p-4 border rounded-lg">
                  <div className="flex items-start gap-2 mb-2">
                    {isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{question.question}</p>
                      <p className="text-sm text-muted-foreground mt-1">Your answer: {question.options[userAnswer]}</p>
                      {!isCorrect && (
                        <p className="text-sm text-green-600 mt-1">
                          Correct answer: {question.options[question.correct]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <Button onClick={() => window.location.reload()} size="lg">
            Try Another Story
          </Button>
        </CardContent>
      </Card>
    )
  }

  const question = questions[currentQuestion]

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>
            Question {currentQuestion + 1} of {questions.length}
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            {Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <h3 className="text-lg font-medium">{question.question}</h3>

        <RadioGroup value={selectedAnswer} onValueChange={handleAnswerSelect}>
          {question.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
              <RadioGroupItem value={index.toString()} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>

        <Button onClick={handleNextQuestion} disabled={!selectedAnswer} className="w-full" size="lg">
          {currentQuestion < questions.length - 1 ? "Next Question" : "Finish Quiz"}
        </Button>
      </CardContent>
    </Card>
  )
}
