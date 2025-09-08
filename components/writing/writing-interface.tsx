"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { WritingEditor } from "./writing-editor"
import { WritingPrompts } from "./writing-prompts"
import { FileText, Mail, Newspaper, Clock, Target, BookOpen } from "lucide-react"

const writingTypes = [
  {
    id: "letter",
    title: "Letter Writing",
    description: "Personal and formal letters",
    icon: Mail,
    color: "bg-blue-500",
    difficulty: "Beginner",
  },
  {
    id: "article",
    title: "Article Writing",
    description: "News articles and blog posts",
    icon: Newspaper,
    color: "bg-green-500",
    difficulty: "Intermediate",
  },
  {
    id: "notice",
    title: "Notice Writing",
    description: "Official notices and announcements",
    icon: FileText,
    color: "bg-purple-500",
    difficulty: "Advanced",
  },
]

export function WritingInterface() {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedPrompt, setSelectedPrompt] = useState<any>(null)
  const [isWriting, setIsWriting] = useState(false)

  const handleStartWriting = (prompt: any) => {
    setSelectedPrompt(prompt)
    setIsWriting(true)
  }

  const handleBackToSelection = () => {
    setIsWriting(false)
    setSelectedPrompt(null)
    setSelectedType(null)
  }

  if (isWriting && selectedPrompt) {
    return <WritingEditor prompt={selectedPrompt} writingType={selectedType} onBack={handleBackToSelection} />
  }

  if (selectedType) {
    return (
      <WritingPrompts
        writingType={selectedType}
        onBack={() => setSelectedType(null)}
        onStartWriting={handleStartWriting}
      />
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {writingTypes.map((type) => {
          const IconComponent = type.icon
          return (
            <Card
              key={type.id}
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
              onClick={() => setSelectedType(type.id)}
            >
              <CardHeader className="text-center">
                <div className={`w-16 h-16 ${type.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <IconComponent className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">{type.title}</CardTitle>
                <p className="text-muted-foreground">{type.description}</p>
              </CardHeader>
              <CardContent className="text-center">
                <Badge variant="secondary" className="mb-4">
                  {type.difficulty}
                </Badge>
                <Button className="w-full">Start Writing</Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Writing Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-primary mt-1" />
              <div>
                <h4 className="font-semibold">Plan Your Time</h4>
                <p className="text-sm text-muted-foreground">Spend time planning before you start writing</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <BookOpen className="h-5 w-5 text-primary mt-1" />
              <div>
                <h4 className="font-semibold">Read Examples</h4>
                <p className="text-sm text-muted-foreground">Study good examples of each writing type</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Target className="h-5 w-5 text-primary mt-1" />
              <div>
                <h4 className="font-semibold">Stay Focused</h4>
                <p className="text-sm text-muted-foreground">Keep your writing clear and to the point</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
