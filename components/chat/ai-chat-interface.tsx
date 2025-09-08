"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Send, Bot, User, BookOpen, Mic, PenTool, HelpCircle } from "lucide-react"
import Link from "next/link"

interface Message {
  id: number
  type: "user" | "ai"
  content: string
  timestamp: Date
  category?: string
}

const quickPrompts = [
  {
    category: "Grammar",
    icon: PenTool,
    prompts: [
      "Explain the difference between 'a' and 'an'",
      "When do I use past perfect tense?",
      "Help me with subject-verb agreement",
      "What are modal verbs?",
    ],
  },
  {
    category: "Vocabulary",
    icon: BookOpen,
    prompts: [
      "What's the difference between 'affect' and 'effect'?",
      "Give me synonyms for 'beautiful'",
      "Explain idioms with 'break'",
      "What are some formal words for 'good'?",
    ],
  },
  {
    category: "Pronunciation",
    icon: Mic,
    prompts: [
      "How do I pronounce 'colonel'?",
      "What's the stress pattern in 'photography'?",
      "Help with silent letters in English",
      "Explain the 'th' sound",
    ],
  },
  {
    category: "Writing",
    icon: PenTool,
    prompts: [
      "Help me write a formal email",
      "How do I structure an essay?",
      "Check my paragraph for errors",
      "Give me transition words",
    ],
  },
]

export function AIChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "ai",
      content: `Hello! I'm your AI English Learning Assistant. I'm here to help you with:

• **Grammar** - Rules, explanations, and corrections
• **Vocabulary** - Word meanings, synonyms, and usage
• **Pronunciation** - How to say words correctly
• **Writing** - Essays, emails, and composition help
• **Reading** - Comprehension and analysis
• **Speaking** - Conversation practice and tips

What would you like to learn about today?`,
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = (content?: string) => {
    const messageContent = content || inputValue
    if (!messageContent.trim()) return

    const userMessage: Message = {
      id: messages.length + 1,
      type: "user",
      content: messageContent,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        type: "ai",
        content: generateAIResponse(messageContent),
        timestamp: new Date(),
        category: detectCategory(messageContent),
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const detectCategory = (message: string): string => {
    const lowerMessage = message.toLowerCase()
    if (lowerMessage.includes("grammar") || lowerMessage.includes("tense") || lowerMessage.includes("verb")) {
      return "Grammar"
    }
    if (lowerMessage.includes("word") || lowerMessage.includes("meaning") || lowerMessage.includes("synonym")) {
      return "Vocabulary"
    }
    if (lowerMessage.includes("pronounce") || lowerMessage.includes("sound") || lowerMessage.includes("accent")) {
      return "Pronunciation"
    }
    if (lowerMessage.includes("write") || lowerMessage.includes("essay") || lowerMessage.includes("email")) {
      return "Writing"
    }
    return "General"
  }

  const generateAIResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase()

    // Grammar responses
    if (lowerQuestion.includes("a and an") || lowerQuestion.includes("a vs an")) {
      return `Great question! Here's the rule for 'a' vs 'an':

**Use 'a' before consonant sounds:**
• a book, a car, a university (sounds like "you-niversity")
• a one-time event (sounds like "wun")

**Use 'an' before vowel sounds:**
• an apple, an hour (silent 'h'), an honest person
• an umbrella, an elephant

**Remember:** It's about the SOUND, not the letter! 

Would you like me to give you more examples or explain any other grammar rules?`
    }

    if (lowerQuestion.includes("past perfect")) {
      return `The past perfect tense shows an action completed before another past action.

**Structure:** had + past participle

**Examples:**
• "I had finished my homework before dinner." (finished first, then dinner)
• "She had already left when I arrived." (left first, then I arrived)

**Key uses:**
1. Show sequence of past events
2. In reported speech: "He said he had seen the movie"
3. In conditional sentences: "If I had known, I would have helped"

Try making a sentence with past perfect! I'll help you check it.`
    }

    // Vocabulary responses
    if (lowerQuestion.includes("affect") && lowerQuestion.includes("effect")) {
      return `This is a common confusion! Here's the difference:

**AFFECT** (verb) = to influence or change something
• "The rain will affect our picnic plans."
• "How did the medicine affect you?"

**EFFECT** (noun) = the result or consequence
• "The effect of rain was a cancelled picnic."
• "The medicine had a positive effect."

**Memory trick:** 
• **A**ffect = **A**ction (verb)
• **E**ffect = **E**nd result (noun)

Can you try using both words in sentences?`
    }

    if (lowerQuestion.includes("synonyms") && lowerQuestion.includes("beautiful")) {
      return `Here are great synonyms for "beautiful":

**Formal/Literary:**
• gorgeous, stunning, magnificent
• exquisite, elegant, graceful
• breathtaking, captivating

**Casual/Everyday:**
• pretty, lovely, attractive
• nice-looking, good-looking
• cute (for smaller things)

**Specific contexts:**
• scenic (landscapes), handsome (men)
• charming (personality), striking (appearance)

**Advanced:**
• resplendent, sublime, aesthetic

Which context are you writing for? I can suggest the best options!`
    }

    // Pronunciation responses
    if (lowerQuestion.includes("colonel")) {
      return `"Colonel" is pronounced like "kernel" (/ˈkɜːrnəl/)!

This is one of English's trickiest words because:
• It comes from French "coronel"
• The spelling changed but pronunciation stayed similar to the original

**Practice tip:** Think "kernel of corn" - same sound!

**Other tricky military ranks:**
• Lieutenant = "loo-TEN-ant" (British) or "loo-TEN-ant" (American)
• Sergeant = "SAR-jent"

Would you like help with other difficult pronunciations?`
    }

    // Writing responses
    if (lowerQuestion.includes("formal email")) {
      return `Here's a structure for formal emails:

**Subject Line:** Clear and specific
• "Meeting Request for Project Discussion"
• "Application for Marketing Position"

**Greeting:**
• Dear Mr./Ms. [Last Name]
• Dear Hiring Manager (if name unknown)

**Opening:**
• "I hope this email finds you well."
• "I am writing to..."

**Body:** 2-3 paragraphs, clear and concise

**Closing:**
• "Thank you for your time and consideration."
• "I look forward to hearing from you."

**Sign-off:**
• Sincerely, Best regards, Kind regards

Would you like me to help you write a specific formal email?`
    }

    // General responses
    if (lowerQuestion.includes("help") || lowerQuestion.includes("learn")) {
      return `I'm here to help you improve your English! I can assist with:

📚 **Grammar:** Rules, explanations, error correction
📖 **Vocabulary:** Word meanings, usage, synonyms
🗣️ **Pronunciation:** How to say words correctly
✍️ **Writing:** Essays, emails, creative writing
📝 **Reading:** Comprehension, analysis, discussion
💬 **Speaking:** Conversation tips, fluency practice

What specific area would you like to focus on? Feel free to ask me anything or use the quick prompts below!`
    }

    return `That's an interesting question! I'd be happy to help you with that. Could you provide a bit more context or be more specific about what you'd like to learn? 

I can help with grammar, vocabulary, pronunciation, writing, reading, and speaking. Just let me know what aspect of English you'd like to explore!`
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/">
          <Button variant="ghost" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-accent" />
          <h1 className="text-2xl font-bold">AI English Assistant</h1>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-accent" />
                Chat with AI Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">
              <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex gap-2 max-w-[85%] ${
                          message.type === "user" ? "flex-row-reverse" : "flex-row"
                        }`}
                      >
                        <div className={`p-2 rounded-full ${message.type === "user" ? "bg-primary" : "bg-accent/10"}`}>
                          {message.type === "user" ? (
                            <User className="h-4 w-4 text-primary-foreground" />
                          ) : (
                            <Bot className="h-4 w-4 text-accent" />
                          )}
                        </div>
                        <div
                          className={`p-4 rounded-lg ${
                            message.type === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                          }`}
                        >
                          {message.category && message.type === "ai" && (
                            <Badge variant="secondary" className="mb-2">
                              {message.category}
                            </Badge>
                          )}
                          <div className="text-sm whitespace-pre-line">{message.content}</div>
                          <div className="text-xs opacity-70 mt-2">{message.timestamp.toLocaleTimeString()}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex gap-3 justify-start">
                      <div className="flex gap-2">
                        <div className="p-2 rounded-full bg-accent/10">
                          <Bot className="h-4 w-4 text-accent" />
                        </div>
                        <div className="p-4 rounded-lg bg-muted">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-accent rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-accent rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-accent rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask me anything about English..."
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  disabled={isTyping}
                />
                <Button onClick={() => handleSendMessage()} disabled={isTyping || !inputValue.trim()} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <HelpCircle className="h-5 w-5" />
                Quick Help
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {quickPrompts.map((category) => (
                <div key={category.category} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <category.icon className="h-4 w-4 text-accent" />
                    <h4 className="font-semibold text-sm">{category.category}</h4>
                  </div>
                  <div className="space-y-1">
                    {category.prompts.map((prompt, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        className="w-full text-left justify-start h-auto p-2 text-xs"
                        onClick={() => handleSendMessage(prompt)}
                      >
                        {prompt}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
