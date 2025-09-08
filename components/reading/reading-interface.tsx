"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, BookOpen, MessageCircle, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"
import { StoryReader } from "./story-reader"
import { QuestionPanel } from "./question-panel"
import { ChatPanel } from "./chat-panel"

const stories = [
  {
    id: 1,
    title: "The Lost Treasure",
    difficulty: "Beginner",
    readTime: "5 min",
    description: "A young explorer discovers an ancient map leading to hidden treasure.",
    content: `Once upon a time, in a small coastal village, there lived a curious young girl named Maya. She loved exploring the old buildings and forgotten corners of her hometown.

One rainy afternoon, while cleaning her grandmother's attic, Maya discovered an old wooden chest hidden behind dusty books. Inside the chest, wrapped in faded silk, was an ancient map with strange symbols and a red X marking a location near the village harbor.

"This must be a treasure map!" Maya whispered excitedly to herself. The map showed a path from the village square, past the old lighthouse, and down to a rocky cove she had never explored before.

The next morning, Maya packed her backpack with water, snacks, and a flashlight. She followed the map's directions carefully, walking through the village square where merchants were setting up their stalls, past the towering lighthouse that had guided ships for over a hundred years.

At the rocky cove, Maya searched among the stones and tide pools. Just as she was about to give up, she noticed a loose rock that matched a symbol on the map. Behind it was a small cave entrance, just big enough for her to crawl through.

Inside the cave, Maya's flashlight revealed something amazing: not gold or jewels, but dozens of old bottles containing messages from sailors who had visited the cove over many decades. Each message told a story of adventure, hope, and dreams of home.

Maya realized she had found something more valuable than treasure - she had discovered the stories and memories of people from long ago. She carefully collected a few messages to share with her grandmother, knowing that these stories were the real treasure.`,
    questions: [
      {
        id: 1,
        question: "Where did Maya find the treasure map?",
        options: ["In her bedroom", "In her grandmother's attic", "At the village square", "Near the lighthouse"],
        correct: 1,
      },
      {
        id: 2,
        question: "What did Maya find in the cave?",
        options: ["Gold and jewels", "Old coins", "Messages in bottles", "Ancient artifacts"],
        correct: 2,
      },
      {
        id: 3,
        question: "Why did Maya think the messages were more valuable than treasure?",
        options: [
          "They were worth more money",
          "They contained stories and memories",
          "They were easier to carry",
          "They belonged to her family",
        ],
        correct: 1,
      },
    ],
  },
  {
    id: 2,
    title: "The Magic Garden",
    difficulty: "Intermediate",
    readTime: "7 min",
    description: "A young botanist discovers a garden where plants can communicate.",
    content: `Dr. Elena Rodriguez had always been fascinated by plants, but nothing had prepared her for what she discovered in the remote Amazon rainforest. As a botanist studying rare species, she had traveled to this untouched region hoping to catalog new plant varieties.

On her third day in the jungle, Elena noticed something unusual. The plants around a particular clearing seemed to move differently - not just swaying in the wind, but responding to each other in coordinated patterns. Intrigued, she set up her research equipment and began to observe more carefully.

As the sun set and the forest grew quiet, Elena heard something extraordinary: a soft humming sound coming from the plants themselves. Using her specialized audio equipment, she discovered that the plants were producing complex sound frequencies, almost like they were communicating with each other.

Over the following weeks, Elena documented this phenomenon. She observed that when one plant was stressed by drought or disease, others in the network would somehow respond, sharing nutrients through their root systems and adjusting their growth patterns to help their struggling neighbor.

The most remarkable discovery came when Elena accidentally cut her hand on a thorny vine. The plants around her seemed to sense her distress, and several medicinal plants began releasing healing compounds into the air. It was as if the entire garden was working together to help her.

Elena realized she had discovered something that could revolutionize our understanding of plant intelligence and cooperation. But she also understood the responsibility that came with this knowledge. This magical garden needed protection, not exploitation.

She decided to document her findings carefully while working with local indigenous communities to ensure the garden's preservation. Elena knew that some discoveries were too precious to be rushed into the world without proper care and respect.`,
    questions: [
      {
        id: 1,
        question: "What was Elena's profession?",
        options: ["A doctor", "A botanist", "A teacher", "A journalist"],
        correct: 1,
      },
      {
        id: 2,
        question: "How did the plants help each other?",
        options: [
          "By growing taller",
          "By changing colors",
          "By sharing nutrients through roots",
          "By producing more flowers",
        ],
        correct: 2,
      },
      {
        id: 3,
        question: "What did Elena decide to do with her discovery?",
        options: [
          "Publish it immediately",
          "Keep it secret forever",
          "Document it carefully and work with local communities",
          "Sell it to a company",
        ],
        correct: 2,
      },
    ],
  },
]

export function ReadingInterface() {
  const [selectedStory, setSelectedStory] = useState<number | null>(null)
  const [showQuestions, setShowQuestions] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [completedQuestions, setCompletedQuestions] = useState<number[]>([])

  const currentStory = selectedStory ? stories.find((s) => s.id === selectedStory) : null

  const handleStoryComplete = () => {
    setShowQuestions(true)
  }

  const handleQuestionsComplete = (questionIds: number[]) => {
    setCompletedQuestions((prev) => [...prev, ...questionIds])
  }

  if (selectedStory && currentStory) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            onClick={() => {
              setSelectedStory(null)
              setShowQuestions(false)
              setShowChat(false)
            }}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Stories
          </Button>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{currentStory.difficulty}</Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {currentStory.readTime}
            </Badge>
          </div>
          <Button variant="outline" onClick={() => setShowChat(!showChat)} className="ml-auto flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Ask AI for Help
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {!showQuestions ? (
              <StoryReader story={currentStory} onComplete={handleStoryComplete} />
            ) : (
              <QuestionPanel questions={currentStory.questions} onComplete={handleQuestionsComplete} />
            )}
          </div>

          {showChat && (
            <div className="lg:col-span-1">
              <ChatPanel storyContext={currentStory} />
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/">
          <Button variant="ghost" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Reading Lab</h1>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Choose a Story to Read</h2>
        <p className="text-muted-foreground">
          Select a story below to start reading. After reading, you'll answer comprehension questions and can ask our AI
          assistant for help.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {stories.map((story) => (
          <Card
            key={story.id}
            className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20"
            onClick={() => setSelectedStory(story.id)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{story.title}</CardTitle>
                {completedQuestions.some((id) => story.questions.some((q) => q.id === id)) && (
                  <CheckCircle className="h-5 w-5 text-primary" />
                )}
              </div>
              <div className="flex gap-2">
                <Badge variant="secondary">{story.difficulty}</Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {story.readTime}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{story.description}</p>
              <Button className="w-full">Start Reading</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
