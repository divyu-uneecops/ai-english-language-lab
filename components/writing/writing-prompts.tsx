"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, Users, Star } from "lucide-react"

const prompts = {
  letter: [
    {
      id: "letter-1",
      title: "Letter to a Friend",
      description: "Write a letter to your friend about your recent vacation",
      difficulty: "Easy",
      timeEstimate: "15 mins",
      audience: "Personal",
      guidelines: [
        "Use informal language and tone",
        "Include personal experiences and emotions",
        "Ask questions about your friend's life",
        "Use proper letter format with date and greeting",
      ],
    },
    {
      id: "letter-2",
      title: "Formal Complaint Letter",
      description: "Write a complaint letter to a company about a defective product",
      difficulty: "Medium",
      timeEstimate: "20 mins",
      audience: "Business",
      guidelines: [
        "Use formal language and professional tone",
        "Clearly state the problem and desired solution",
        "Include relevant details and dates",
        "Be polite but firm in your request",
      ],
    },
    {
      id: "letter-3",
      title: "Job Application Letter",
      description: "Write a cover letter for your dream job application",
      difficulty: "Hard",
      timeEstimate: "25 mins",
      audience: "Professional",
      guidelines: [
        "Research the company and position",
        "Highlight relevant skills and experience",
        "Show enthusiasm for the role",
        "Use professional formatting and language",
      ],
    },
  ],
  article: [
    {
      id: "article-1",
      title: "School Event Report",
      description: "Write an article about a recent school sports day or cultural event",
      difficulty: "Easy",
      timeEstimate: "20 mins",
      audience: "School Community",
      guidelines: [
        "Include who, what, when, where, why",
        "Use engaging headlines and subheadings",
        "Include quotes from participants",
        "Write in third person perspective",
      ],
    },
    {
      id: "article-2",
      title: "Environmental Awareness",
      description: "Write an article about climate change and its impact on your community",
      difficulty: "Medium",
      timeEstimate: "25 mins",
      audience: "General Public",
      guidelines: [
        "Present facts and statistics",
        "Include expert opinions or research",
        "Suggest practical solutions",
        "Use persuasive but balanced language",
      ],
    },
    {
      id: "article-3",
      title: "Technology Review",
      description: "Write a review article about a new smartphone or gadget",
      difficulty: "Hard",
      timeEstimate: "30 mins",
      audience: "Tech Enthusiasts",
      guidelines: [
        "Compare features with competitors",
        "Include pros and cons analysis",
        "Use technical terminology appropriately",
        "Provide a clear recommendation",
      ],
    },
  ],
  notice: [
    {
      id: "notice-1",
      title: "School Notice",
      description: "Write a notice about upcoming school holidays and important dates",
      difficulty: "Easy",
      timeEstimate: "10 mins",
      audience: "Students & Parents",
      guidelines: [
        "Use clear, concise language",
        "Include all essential information",
        "Use proper notice format with heading",
        "Mention authority and date",
      ],
    },
    {
      id: "notice-2",
      title: "Community Event Notice",
      description: "Write a notice about a community cleanup drive or social event",
      difficulty: "Medium",
      timeEstimate: "15 mins",
      audience: "Community Members",
      guidelines: [
        "Include event details (date, time, venue)",
        "Explain the purpose and benefits",
        "Provide contact information",
        "Use formal but accessible language",
      ],
    },
    {
      id: "notice-3",
      title: "Official Government Notice",
      description: "Write an official notice about new traffic rules or regulations",
      difficulty: "Hard",
      timeEstimate: "20 mins",
      audience: "General Public",
      guidelines: [
        "Use official and authoritative tone",
        "Include legal references if applicable",
        "Clearly state consequences of non-compliance",
        "Follow government notice format",
      ],
    },
  ],
}

interface WritingPromptsProps {
  writingType: string
  onBack: () => void
  onStartWriting: (prompt: any) => void
}

export function WritingPrompts({ writingType, onBack, onStartWriting }: WritingPromptsProps) {
  const typePrompts = prompts[writingType as keyof typeof prompts] || []
  const typeName = writingType.charAt(0).toUpperCase() + writingType.slice(1)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Types
        </Button>
        <h2 className="text-2xl font-bold">{typeName} Writing Prompts</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {typePrompts.map((prompt) => (
          <Card key={prompt.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{prompt.title}</CardTitle>
                <Badge
                  variant={
                    prompt.difficulty === "Easy"
                      ? "default"
                      : prompt.difficulty === "Medium"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {prompt.difficulty}
                </Badge>
              </div>
              <p className="text-muted-foreground">{prompt.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {prompt.timeEstimate}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {prompt.audience}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  Guidelines
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {prompt.guidelines.slice(0, 2).map((guideline, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {guideline}
                    </li>
                  ))}
                  {prompt.guidelines.length > 2 && (
                    <li className="text-xs text-muted-foreground">+{prompt.guidelines.length - 2} more guidelines</li>
                  )}
                </ul>
              </div>

              <Button className="w-full" onClick={() => onStartWriting(prompt)}>
                Start Writing
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
