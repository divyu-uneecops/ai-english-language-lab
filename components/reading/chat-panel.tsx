"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, User } from "lucide-react"

interface Message {
  id: number
  type: "user" | "ai"
  content: string
  timestamp: Date
}

interface ChatPanelProps {
  storyContext: {
    title: string
    content: string
  }
}

export function ChatPanel({ storyContext }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "ai",
      content: `Hi! I'm here to help you with "${storyContext.title}". You can ask me about vocabulary, plot details, character motivations, or anything else you'd like to understand better!`,
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: messages.length + 1,
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        type: "ai",
        content: generateAIResponse(inputValue, storyContext),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
    }, 1000)

    setInputValue("")
  }

  const generateAIResponse = (question: string, story: any): string => {
    const lowerQuestion = question.toLowerCase()

    if (lowerQuestion.includes("meaning") || lowerQuestion.includes("define")) {
      return "I'd be happy to explain any words or phrases from the story! Could you tell me which specific word or phrase you'd like me to define?"
    }

    if (lowerQuestion.includes("character") || lowerQuestion.includes("who")) {
      return `In "${story.title}", the main character faces interesting challenges. What specifically about the character would you like to understand better?`
    }

    if (lowerQuestion.includes("why") || lowerQuestion.includes("because")) {
      return "That's a great analytical question! Understanding the 'why' behind events and character actions helps us comprehend the story better. Let me help you think through this..."
    }

    if (lowerQuestion.includes("summary") || lowerQuestion.includes("what happened")) {
      return `"${story.title}" tells the story of discovery and learning. Would you like me to break down specific parts of the story or explain the main themes?`
    }

    return "That's an interesting question about the story! I'm here to help you understand any part of the reading. Could you be more specific about what you'd like to explore?"
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          AI Reading Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex gap-2 max-w-[80%] ${message.type === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`p-2 rounded-full ${message.type === "user" ? "bg-primary" : "bg-muted"}`}>
                    {message.type === "user" ? (
                      <User className="h-4 w-4 text-primary-foreground" />
                    ) : (
                      <Bot className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div
                    className={`p-3 rounded-lg ${
                      message.type === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me about the story..."
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <Button onClick={handleSendMessage} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
