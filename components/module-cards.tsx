"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Mic, MessageCircle, PenTool, ArrowRight, Lock } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

export function ModuleCards() {
  const { user } = useAuth()

  const ModuleCard = ({
    icon: Icon,
    title,
    description,
    features,
    href,
    buttonText,
    variant = "default",
    colorClass,
  }: {
    icon: any
    title: string
    description: string
    features: string[]
    href: string
    buttonText: string
    variant?: "default" | "secondary" | "outline"
    colorClass: string
  }) => (
    <Card className={`group hover:shadow-lg transition-all duration-300 border-2 ${colorClass} h-full`}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3 mb-2">
          <div className={`p-2 ${colorClass.replace("hover:border-", "bg-").replace("/20", "/10")} rounded-lg`}>
            <Icon
              className={`h-5 w-5 sm:h-6 sm:w-6 ${colorClass.includes("primary") ? "text-primary" : colorClass.includes("secondary") ? "text-secondary" : colorClass.includes("accent") ? "text-accent" : "text-muted-foreground"}`}
            />
          </div>
          <CardTitle className="text-lg sm:text-xl">{title}</CardTitle>
        </div>
        <CardDescription className="text-sm sm:text-base">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col h-full">
        <ul className="text-xs sm:text-sm text-muted-foreground mb-4 space-y-1 flex-grow">
          {features.map((feature, index) => (
            <li key={index}>• {feature}</li>
          ))}
        </ul>
        {user ? (
          <Link href={href}>
            <Button
              variant={variant}
              className={`w-full transition-colors text-sm ${
                variant === "default"
                  ? "group-hover:bg-primary/90"
                  : variant === "secondary"
                    ? "group-hover:bg-secondary/90"
                    : "group-hover:bg-accent/10 bg-transparent"
              }`}
            >
              {buttonText}
              <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-2" />
            </Button>
          </Link>
        ) : (
          <Link href="/auth/login">
            <Button variant="outline" className="w-full bg-transparent text-sm">
              <Lock className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              Sign In to Access
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  )

  return (
    <section className="py-8 sm:py-12 lg:py-16 px-4">
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Learning Modules</h2>
        <p className="text-muted-foreground text-sm sm:text-base lg:text-lg max-w-2xl mx-auto px-4">
          {user
            ? "Choose your learning path and continue improving your English skills"
            : "Sign in to access all learning modules and track your progress"}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto">
        <ModuleCard
          icon={BookOpen}
          title="Reading Lab"
          description="Read engaging stories and test your comprehension with interactive questions"
          features={[
            "Interactive story reading",
            "Comprehension questions",
            "Vocabulary building",
            "Progress tracking",
          ]}
          href="/reading"
          buttonText="Start Reading"
          colorClass="hover:border-primary/20"
        />

        <ModuleCard
          icon={Mic}
          title="Speaking Lab"
          description="Practice pronunciation and speaking skills with guided exercises"
          features={["Pronunciation practice", "Speaking exercises", "Voice recording", "Instant feedback"]}
          href="/speaking"
          buttonText="Start Speaking"
          variant="secondary"
          colorClass="hover:border-secondary/20"
        />

        <ModuleCard
          icon={PenTool}
          title="Writing Lab"
          description="Master different writing styles with AI-powered feedback and evaluation"
          features={[
            "Letter & article writing",
            "Notice composition",
            "AI evaluation & feedback",
            "Writing improvement tips",
          ]}
          href="/writing"
          buttonText="Start Writing"
          variant="outline"
          colorClass="hover:border-accent/20"
        />

        <ModuleCard
          icon={MessageCircle}
          title="AI Assistant"
          description="Get instant help with questions, doubts, and explanations"
          features={["24/7 AI support", "Grammar explanations", "Vocabulary help", "Personalized tips"]}
          href="/chat"
          buttonText="Chat with AI"
          variant="outline"
          colorClass="hover:border-muted/20"
        />
      </div>
    </section>
  )
}
