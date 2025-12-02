import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, ShieldCheck, Filter, Users } from "lucide-react"

const features = [
  {
    icon: ShieldCheck,
    title: "Verified NGOs",
    desc: "Trust and safety built-in with verification workflows.",
    badge: "Quality",
  },
  {
    icon: Filter,
    title: "Advanced Search",
    desc: "Filter by skills, impact area, time, and location.",
    badge: "Focus",
  },
  {
    icon: Users,
    title: "Smart Matching",
    desc: "Match volunteers to roles with skill badges.",
    badge: "Match",
  },
  {
    icon: BarChart3,
    title: "Impact Analytics",
    desc: "Track applications, engagement, and completions.",
    badge: "Insights",
  },
]

export function FeatureCards() {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="mb-8 flex items-end justify-between">
        <h2 className="gradient-text text-balance text-2xl font-semibold md:text-3xl">A platform built for impact</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => (
          <Card key={f.title} className="feature-card group">
            <CardHeader>
              <div className="mb-2 flex items-center gap-2">
                <f.icon className="h-5 w-5 text-primary scale-hover-sm" />
                <Badge variant="secondary">{f.badge}</Badge>
              </div>
              <CardTitle>{f.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">{f.desc}</CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
