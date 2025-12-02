import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const testimonials = [
  {
    name: "Aisha Khan",
    role: "Volunteer · UI Designer",
    text: "I found a climate non-profit that matched my skills perfectly. The application tracker made everything smooth.",
    img: "/portrait-woman.png",
  },
  {
    name: "Jorge Ramirez",
    role: "NGO · Program Manager",
    text: "We filled 4 roles in two weeks. The analytics helped us understand where volunteers engage most.",
    img: "/thoughtful-man.png",
  },
]

export function Testimonials() {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h2 className="gradient-text text-balance text-2xl font-semibold md:text-3xl">What our community says</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {testimonials.map((t) => (
          <Card key={t.name} className="testimonial-card grid grid-cols-[80px_1fr] items-center gap-4">
            <CardHeader className="p-0">
              <Avatar className="avatar-ring h-16 w-16">
                <AvatarImage src={t.img || "/placeholder.svg"} alt={`${t.name} avatar`} />
                <AvatarFallback>{t.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-pretty">{`"${t.text}"`}</p>
              <div className="mt-2 text-sm text-muted-foreground">
                {t.name} — {t.role}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
