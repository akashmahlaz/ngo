import { Separator } from "@/components/ui/separator"

export function StatsStrip() {
  const stats = [
    { value: "12k+", label: "Active Volunteers" },
    { value: "1.8k+", label: "NGOs onboarded" },
    { value: "9.4k+", label: "Roles posted" },
    { value: "96%", label: "Satisfaction" },
  ]

  return (
    <section className="border-y bg-secondary">
      <div className="container mx-auto flex flex-wrap items-center justify-center gap-6 px-4 py-8 md:gap-10">
        {stats.map((s, i) => (
          <div key={s.label} className="flex items-center gap-6">
            <div className="stats-card text-center">
              <div className="text-2xl font-semibold gradient-text">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </div>
            {i < stats.length - 1 && <Separator orientation="vertical" className="hidden h-10 md:block" />}
          </div>
        ))}
      </div>
    </section>
  )
}
