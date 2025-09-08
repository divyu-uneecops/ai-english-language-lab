"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle, XCircle, TrendingUp, MessageSquare, Lightbulb, Target, Award } from "lucide-react"

interface EvaluationResultsProps {
  evaluation: any
  onClose: () => void
  onRevise: () => void
}

export function EvaluationResults({ evaluation, onClose, onRevise }: EvaluationResultsProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-blue-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent"
    if (score >= 80) return "Good"
    if (score >= 70) return "Fair"
    return "Needs Improvement"
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "positive":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "low":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "medium":
        return <AlertCircle className="h-4 w-4 text-orange-500" />
      case "high":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Writing Evaluation Results</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onRevise}>
            Revise Writing
          </Button>
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>

      {/* Overall Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Overall Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold text-primary">{evaluation.overallScore}</div>
            <div className="flex-1">
              <Progress value={evaluation.overallScore} className="mb-2" />
              <p className={`font-semibold ${getScoreColor(evaluation.overallScore)}`}>
                {getScoreLabel(evaluation.overallScore)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Feedback */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(evaluation.feedback).map(([category, data]: [string, any]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="capitalize flex items-center justify-between">
                {category}
                <Badge variant="outline" className={getScoreColor(data.score)}>
                  {data.score}/100
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={data.score} className="mb-4" />
              <div className="space-y-2">
                {data.issues.map((issue: any, index: number) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    {getSeverityIcon(issue.severity)}
                    <span>{issue.text}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Strengths and Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {evaluation.strengths.map((strength: string, index: number) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  {strength}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-600">
              <TrendingUp className="h-5 w-5" />
              Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {evaluation.improvements.map((improvement: string, index: number) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <Target className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  {improvement}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* AI Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            AI Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {evaluation.suggestions.map((suggestion: string, index: number) => (
              <div key={index} className="flex items-start gap-2 p-3 bg-muted rounded-lg">
                <MessageSquare className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm">{suggestion}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
