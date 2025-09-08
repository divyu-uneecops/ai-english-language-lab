"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, BookOpen, Mic, Trophy, Target, Calendar, TrendingUp, Award, Clock, Star } from "lucide-react"
import Link from "next/link"
import { ProgressChart } from "./progress-chart"
import { AchievementCard } from "./achievement-card"

// Mock data - in a real app, this would come from a database
const progressData = {
  overall: {
    totalExercises: 15,
    completedExercises: 8,
    totalTimeSpent: 240, // minutes
    currentStreak: 5, // days
    averageScore: 85,
  },
  reading: {
    storiesRead: 2,
    totalStories: 4,
    questionsAnswered: 6,
    correctAnswers: 5,
    averageReadingTime: 8, // minutes per story
    vocabularyLearned: 24,
  },
  speaking: {
    exercisesCompleted: 3,
    totalExercises: 6,
    pronunciationScore: 88,
    fluencyScore: 82,
    recordingTime: 45, // minutes
    wordsRecorded: 156,
  },
  achievements: [
    {
      id: 1,
      title: "First Steps",
      description: "Complete your first reading exercise",
      icon: BookOpen,
      earned: true,
      earnedDate: "2024-01-15",
    },
    {
      id: 2,
      title: "Speaking Star",
      description: "Complete 3 pronunciation exercises",
      icon: Mic,
      earned: true,
      earnedDate: "2024-01-18",
    },
    {
      id: 3,
      title: "Consistent Learner",
      description: "Study for 5 days in a row",
      icon: Calendar,
      earned: true,
      earnedDate: "2024-01-20",
    },
    {
      id: 4,
      title: "Quiz Master",
      description: "Score 90% or higher on 3 quizzes",
      icon: Trophy,
      earned: false,
      progress: 2,
      target: 3,
    },
    {
      id: 5,
      title: "Vocabulary Builder",
      description: "Learn 50 new words",
      icon: Star,
      earned: false,
      progress: 24,
      target: 50,
    },
    {
      id: 6,
      title: "Conversation Pro",
      description: "Complete all speaking exercises",
      icon: Award,
      earned: false,
      progress: 3,
      target: 6,
    },
  ],
  weeklyProgress: [
    { day: "Mon", reading: 2, speaking: 1, total: 3 },
    { day: "Tue", reading: 1, speaking: 2, total: 3 },
    { day: "Wed", reading: 0, speaking: 1, total: 1 },
    { day: "Thu", reading: 2, speaking: 0, total: 2 },
    { day: "Fri", reading: 1, speaking: 1, total: 2 },
    { day: "Sat", reading: 0, speaking: 0, total: 0 },
    { day: "Sun", reading: 1, speaking: 2, total: 3 },
  ],
}

export function ProgressDashboard() {
  const [selectedTab, setSelectedTab] = useState("overview")

  const overallProgress = Math.round(
    (progressData.overall.completedExercises / progressData.overall.totalExercises) * 100,
  )
  const readingProgress = Math.round((progressData.reading.storiesRead / progressData.reading.totalStories) * 100)
  const speakingProgress = Math.round(
    (progressData.speaking.exercisesCompleted / progressData.speaking.totalExercises) * 100,
  )

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
          <TrendingUp className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Learning Progress</h1>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reading">Reading</TabsTrigger>
          <TabsTrigger value="speaking">Speaking</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Overall Stats Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{overallProgress}%</div>
                <p className="text-xs text-muted-foreground">
                  {progressData.overall.completedExercises} of {progressData.overall.totalExercises} exercises
                </p>
                <Progress value={overallProgress} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-secondary">{progressData.overall.currentStreak}</div>
                <p className="text-xs text-muted-foreground">days in a row</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent">{progressData.overall.averageScore}%</div>
                <p className="text-xs text-muted-foreground">across all exercises</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Time Spent</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Math.floor(progressData.overall.totalTimeSpent / 60)}h</div>
                <p className="text-xs text-muted-foreground">{progressData.overall.totalTimeSpent % 60}m total</p>
              </CardContent>
            </Card>
          </div>

          {/* Module Progress */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Reading Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Stories Completed</span>
                  <Badge variant="secondary">
                    {progressData.reading.storiesRead}/{progressData.reading.totalStories}
                  </Badge>
                </div>
                <Progress value={readingProgress} />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium">{progressData.reading.questionsAnswered}</div>
                    <div className="text-muted-foreground">Questions Answered</div>
                  </div>
                  <div>
                    <div className="font-medium">{progressData.reading.vocabularyLearned}</div>
                    <div className="text-muted-foreground">Words Learned</div>
                  </div>
                </div>
                <Link href="/reading">
                  <Button className="w-full">Continue Reading</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="h-5 w-5 text-secondary" />
                  Speaking Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Exercises Completed</span>
                  <Badge variant="secondary">
                    {progressData.speaking.exercisesCompleted}/{progressData.speaking.totalExercises}
                  </Badge>
                </div>
                <Progress value={speakingProgress} />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium">{progressData.speaking.pronunciationScore}%</div>
                    <div className="text-muted-foreground">Pronunciation</div>
                  </div>
                  <div>
                    <div className="font-medium">{progressData.speaking.fluencyScore}%</div>
                    <div className="text-muted-foreground">Fluency</div>
                  </div>
                </div>
                <Link href="/speaking">
                  <Button variant="secondary" className="w-full">
                    Continue Speaking
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Activity Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ProgressChart data={progressData.weeklyProgress} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reading" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Reading Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Stories Read</span>
                    <span className="font-medium">{progressData.reading.storiesRead}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Questions Answered</span>
                    <span className="font-medium">{progressData.reading.questionsAnswered}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Correct Answers</span>
                    <span className="font-medium text-primary">{progressData.reading.correctAnswers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Accuracy Rate</span>
                    <span className="font-medium">
                      {Math.round((progressData.reading.correctAnswers / progressData.reading.questionsAnswered) * 100)}
                      %
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Vocabulary Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-primary">{progressData.reading.vocabularyLearned}</div>
                  <p className="text-sm text-muted-foreground">new words learned</p>
                  <Progress value={(progressData.reading.vocabularyLearned / 50) * 100} />
                  <p className="text-xs text-muted-foreground">Goal: 50 words</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Reading Speed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-secondary">{progressData.reading.averageReadingTime}</div>
                  <p className="text-sm text-muted-foreground">minutes per story</p>
                  <Badge variant="outline">Improving</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="speaking" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Speaking Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Exercises Completed</span>
                    <span className="font-medium">{progressData.speaking.exercisesCompleted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Words Recorded</span>
                    <span className="font-medium">{progressData.speaking.wordsRecorded}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Recording Time</span>
                    <span className="font-medium">{progressData.speaking.recordingTime}m</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pronunciation Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-primary">{progressData.speaking.pronunciationScore}%</div>
                  <Progress value={progressData.speaking.pronunciationScore} />
                  <Badge variant="secondary">Excellent</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Fluency Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-secondary">{progressData.speaking.fluencyScore}%</div>
                  <Progress value={progressData.speaking.fluencyScore} />
                  <Badge variant="outline">Good</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {progressData.achievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
