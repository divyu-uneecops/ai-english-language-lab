import { Navigation } from "@/components/navigation"
import { Hero } from "@/components/hero"
import { ModuleCards } from "@/components/module-cards"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <Hero />
        <ModuleCards />
      </main>
    </div>
  )
}
