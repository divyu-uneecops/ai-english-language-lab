import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, Mic, TrendingUp } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <section className="text-center py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6">
          Master English with <span className="text-primary">AI-Powered</span> Learning
        </h1>
        <p className="text-xl text-muted-foreground text-balance mb-8 max-w-2xl mx-auto leading-relaxed">
          Improve your reading comprehension and speaking skills with interactive stories, personalized feedback, and AI
          assistance available whenever you need help.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/reading">
            <Button size="lg" className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Start Reading
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/speaking">
            <Button size="lg" variant="outline" className="flex items-center gap-2 bg-transparent">
              <Mic className="h-5 w-5" />
              Practice Speaking
            </Button>
          </Link>
          <Link href="/progress">
            <Button size="lg" variant="secondary" className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              View Progress
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
