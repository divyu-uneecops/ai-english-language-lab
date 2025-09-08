import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Lock } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface Achievement {
  id: number
  title: string
  description: string
  icon: LucideIcon
  earned: boolean
  earnedDate?: string
  progress?: number
  target?: number
}

interface AchievementCardProps {
  achievement: Achievement
}

export function AchievementCard({ achievement }: AchievementCardProps) {
  const IconComponent = achievement.icon
  const progressPercentage =
    achievement.progress && achievement.target ? (achievement.progress / achievement.target) * 100 : 0

  return (
    <Card className={`${achievement.earned ? "border-primary/50 bg-primary/5" : "border-muted"}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className={`p-2 rounded-lg ${achievement.earned ? "bg-primary/10" : "bg-muted"}`}>
            <IconComponent className={`h-5 w-5 ${achievement.earned ? "text-primary" : "text-muted-foreground"}`} />
          </div>
          {achievement.earned ? (
            <CheckCircle className="h-5 w-5 text-primary" />
          ) : (
            <Lock className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
        <CardTitle className="text-lg">{achievement.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{achievement.description}</p>

        {achievement.earned ? (
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            Earned {achievement.earnedDate && new Date(achievement.earnedDate).toLocaleDateString()}
          </Badge>
        ) : achievement.progress !== undefined && achievement.target !== undefined ? (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>
                {achievement.progress}/{achievement.target}
              </span>
            </div>
            <Progress value={progressPercentage} />
          </div>
        ) : (
          <Badge variant="outline">Not Started</Badge>
        )}
      </CardContent>
    </Card>
  )
}
