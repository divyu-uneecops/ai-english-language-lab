"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Mic, MessageCircle, PenTool, ArrowRight, Lock, Sparkles, Star } from "lucide-react"
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
    isPopular = false,
  }: {
    icon: any
    title: string
    description: string
    features: string[]
    href: string
    buttonText: string
    variant?: "default" | "secondary" | "outline"
    colorClass: string
    isPopular?: boolean
  }) => (
    <Card
      className={`group relative overflow-hidden glass-effect modern-shadow hover:scale-105 transition-all duration-500 border-2 ${colorClass} h-full`}
    >
      {isPopular && (
        <div className="absolute top-4 right-4 z-10">
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary to-accent text-white text-xs font-bold shadow-lg">
            <Star className="h-3 w-3 fill-current" />
            Popular
          </div>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <CardHeader className="pb-4 relative z-10">
        <div className="flex items-center gap-4 mb-3">
          <div
            className={`p-3 rounded-xl bg-gradient-to-br ${colorClass.includes("primary") ? "from-primary/10 to-primary/20" : colorClass.includes("secondary") ? "from-secondary/10 to-secondary/20" : "from-accent/10 to-accent/20"} group-hover:scale-110 transition-transform duration-300`}
          >
            <Icon
              className={`h-6 w-6 sm:h-7 sm:w-7 ${colorClass.includes("primary") ? "text-primary" : colorClass.includes("secondary") ? "text-secondary" : "text-accent"}`}
            />
          </div>
          <div>
            <CardTitle className="text-xl sm:text-2xl font-black">{title}</CardTitle>
            <div className="flex items-center gap-1 mt-1">
              <Sparkles className="h-3 w-3 text-accent" />
              <span className="text-xs text-accent font-medium">AI-Enhanced</span>
            </div>
          </div>
        </div>
        <CardDescription className="text-sm sm:text-base leading-relaxed">{description}</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col h-full relative z-10">
        <div className="flex-grow mb-6">
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-primary to-accent flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {user ? (
          <Link href={href}>
            <Button
              variant={variant}
              className={`w-full transition-all duration-300 text-sm font-semibold py-3 modern-shadow hover:scale-105 ${
                variant === "default"
                  ? "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                  : variant === "secondary"
                    ? "bg-gradient-to-r from-secondary to-secondary/90 hover:from-secondary/90 hover:to-secondary"
                    : "bg-gradient-to-r from-accent/10 to-accent/20 hover:from-accent/20 hover:to-accent/30 border-accent/30"
              }`}
            >
              {buttonText}
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        ) : (
          <Link href="/auth/login">
            <Button
              variant="outline"
              className="w-full glass-effect modern-shadow hover:scale-105 transition-all text-sm font-semibold py-3 bg-transparent"
            >
              <Lock className="h-4 w-4 mr-2" />
              Sign In to Access
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  )

  return (
    <section className="py-12 sm:py-16 lg:py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />

      <div className="relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            Choose Your Learning Path
          </div>

          <h2 className="text-responsive-3xl gradient-text mb-4 sm:mb-6">Learning Modules</h2>
          <p className="text-responsive-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
            {user
              ? "Continue your English learning journey with our AI-powered modules designed to enhance your skills"
              : "Sign in to unlock all learning modules and start your personalized English learning experience"}
          </p>
        </div>

        <div className="grid-responsive-cards max-w-7xl mx-auto">
          <ModuleCard
            icon={BookOpen}
            title="Reading Lab"
            description="Immerse yourself in engaging stories and enhance comprehension with interactive questions"
            features={[
              "Interactive story reading",
              "AI-powered comprehension questions",
              "Vocabulary building exercises",
              "Real-time progress tracking",
            ]}
            href="/reading"
            buttonText="Start Reading"
            colorClass="hover:border-primary/30"
            isPopular={true}
          />

          <ModuleCard
            icon={Mic}
            title="Speaking Lab"
            description="Perfect your pronunciation and speaking confidence with AI-guided practice sessions"
            features={[
              "Advanced pronunciation analysis",
              "Interactive speaking exercises",
              "Voice recording & playback",
              "Instant AI feedback",
            ]}
            href="/speaking"
            buttonText="Start Speaking"
            variant="secondary"
            colorClass="hover:border-secondary/30"
          />

          <ModuleCard
            icon={PenTool}
            title="Writing Lab"
            description="Master various writing styles with comprehensive AI evaluation and personalized feedback"
            features={[
              "Letter & article composition",
              "Professional notice writing",
              "AI-powered evaluation system",
              "Detailed improvement suggestions",
            ]}
            href="/writing"
            buttonText="Start Writing"
            variant="outline"
            colorClass="hover:border-accent/30"
          />

          <ModuleCard
            icon={MessageCircle}
            title="AI Assistant"
            description="Get instant, intelligent support for all your English learning questions and challenges"
            features={[
              "24/7 intelligent AI support",
              "Grammar & syntax explanations",
              "Contextual vocabulary help",
              "Personalized learning tips",
            ]}
            href="/chat"
            buttonText="Chat with AI"
            variant="outline"
            colorClass="hover:border-muted/30"
          />
        </div>
      </div>
    </section>
  )
}
