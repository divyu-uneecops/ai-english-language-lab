import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Mic, MessageCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

export function ModuleCards() {
  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Learning Modules</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Choose your learning path and start improving your English skills today
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Reading Lab</CardTitle>
            </div>
            <CardDescription>
              Read engaging stories and test your comprehension with interactive questions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-muted-foreground mb-4 space-y-1">
              <li>• Interactive story reading</li>
              <li>• Comprehension questions</li>
              <li>• Vocabulary building</li>
              <li>• Progress tracking</li>
            </ul>
            <Link href="/reading">
              <Button className="w-full group-hover:bg-primary/90 transition-colors">
                Start Reading
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <Mic className="h-6 w-6 text-secondary" />
              </div>
              <CardTitle>Speaking Lab</CardTitle>
            </div>
            <CardDescription>Practice pronunciation and speaking skills with guided exercises</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-muted-foreground mb-4 space-y-1">
              <li>• Pronunciation practice</li>
              <li>• Speaking exercises</li>
              <li>• Voice recording</li>
              <li>• Instant feedback</li>
            </ul>
            <Link href="/speaking">
              <Button variant="secondary" className="w-full group-hover:bg-secondary/90 transition-colors">
                Start Speaking
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-accent/20 md:col-span-2 lg:col-span-1">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-accent/10 rounded-lg">
                <MessageCircle className="h-6 w-6 text-accent" />
              </div>
              <CardTitle>AI Assistant</CardTitle>
            </div>
            <CardDescription>Get instant help with questions, doubts, and explanations</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-muted-foreground mb-4 space-y-1">
              <li>• 24/7 AI support</li>
              <li>• Grammar explanations</li>
              <li>• Vocabulary help</li>
              <li>• Personalized tips</li>
            </ul>
            <Link href="/chat">
              <Button variant="outline" className="w-full group-hover:bg-accent/10 transition-colors bg-transparent">
                Chat with AI
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
