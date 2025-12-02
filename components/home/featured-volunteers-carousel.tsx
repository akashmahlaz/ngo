'use client'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { 
  MapPin, 
  Star,
  TrendingUp,
  ArrowRight,
  Briefcase
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

// Fallback data in case no volunteers exist
const fallbackVolunteers = [
  {
    id: "1",
    name: "Priya Sharma",
    title: "Education Specialist",
    category: "Education",
    tagline: "Transforming lives through knowledge",
    description: "Dedicated to empowering underprivileged children with quality education. Teaching English and Math to 100+ students across Delhi.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop",
    location: "New Delhi, India",
    hoursContributed: 450,
    rating: 4.9,
    projectsCompleted: 12,
    skills: ["Teaching", "Curriculum Design", "Child Psychology"],
    impact: "100+ Students Taught",
    since: "2023"
  },
  {
    id: "2",
    name: "Rahul Verma",
    title: "Healthcare Volunteer",
    category: "Healthcare",
    tagline: "Bringing hope through healing",
    description: "Organizing medical camps and health awareness programs in rural communities. Passionate about accessible healthcare for all.",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&q=80",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&h=200&fit=crop",
    location: "Mumbai, Maharashtra",
    hoursContributed: 620,
    rating: 5.0,
    projectsCompleted: 18,
    skills: ["Medical Support", "Community Health", "First Aid"],
    impact: "500+ Patients Helped",
    since: "2022"
  },
  {
    id: "3",
    name: "Ananya Reddy",
    title: "Environmental Activist",
    category: "Environment",
    tagline: "Protecting nature for future generations",
    description: "Leading beach cleanups and tree plantation drives. Committed to creating a sustainable future through grassroots action.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&q=80",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop",
    location: "Bangalore, Karnataka",
    hoursContributed: 380,
    rating: 4.8,
    projectsCompleted: 15,
    skills: ["Environmental Science", "Project Management", "Community Organizing"],
    impact: "2000+ Trees Planted",
    since: "2023"
  },
  {
    id: "4",
    name: "Arjun Patel",
    title: "Tech for Good",
    category: "Technology",
    tagline: "Bridging the digital divide",
    description: "Teaching digital literacy to seniors and underprivileged youth. Making technology accessible and empowering for everyone.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    location: "Pune, Maharashtra",
    hoursContributed: 520,
    rating: 4.9,
    projectsCompleted: 20,
    skills: ["Software Development", "Teaching", "Digital Literacy"],
    impact: "300+ People Trained",
    since: "2022"
  },
  {
    id: "5",
    name: "Meera Singh",
    title: "Community Builder",
    category: "Community",
    tagline: "Strengthening communities together",
    description: "Creating support networks for women and youth. Facilitating skill development and employment opportunities.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
    location: "Chennai, Tamil Nadu",
    hoursContributed: 710,
    rating: 5.0,
    projectsCompleted: 25,
    skills: ["Social Work", "Counseling", "Workshop Facilitation"],
    impact: "150+ Women Empowered",
    since: "2021"
  },
  {
    id: "6",
    name: "Vikram Joshi",
    title: "Youth Mentor",
    category: "Education",
    tagline: "Shaping tomorrow's leaders",
    description: "Mentoring underprivileged students in career planning and personal development. Helping them unlock their full potential.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop",
    location: "Hyderabad, Telangana",
    hoursContributed: 590,
    rating: 4.9,
    projectsCompleted: 22,
    skills: ["Mentoring", "Career Guidance", "Motivational Speaking"],
    impact: "80+ Youth Mentored",
    since: "2022"
  }
]

const categoryColors: Record<string, string> = {
  Education: "bg-blue-500/90",
  Healthcare: "bg-red-500/90",
  Environment: "bg-green-500/90",
  Technology: "bg-teal-500/90",
  Community: "bg-orange-500/90"
}

// Helper to get category from skills
function getCategoryFromSkills(skills?: string[]): string {
  if (!skills || skills.length === 0) return "Community"
  
  const skillStr = skills.join(" ").toLowerCase()
  if (skillStr.includes("teach") || skillStr.includes("educat") || skillStr.includes("tutor")) return "Education"
  if (skillStr.includes("health") || skillStr.includes("medical") || skillStr.includes("doctor") || skillStr.includes("nurse")) return "Healthcare"
  if (skillStr.includes("environment") || skillStr.includes("green") || skillStr.includes("sustain") || skillStr.includes("ecology")) return "Environment"
  if (skillStr.includes("tech") || skillStr.includes("software") || skillStr.includes("coding") || skillStr.includes("programming")) return "Technology"
  return "Community"
}

// Helper to get avatar image
function getAvatarUrl(avatarUrl?: string, name?: string): string {
  if (avatarUrl) return avatarUrl
  // Generate a default avatar based on name
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "Volunteer")}&size=400&background=random&bold=true`
}

// Helper to get hero image based on category
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getHeroImage(category: string): string {
  const images: Record<string, string> = {
    Education: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
    Healthcare: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
    Environment: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800&q=80",
    Technology: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
    Community: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80"
  }
  return images[category] || images.Community
}

interface VolunteerData {
  id: string
  name: string
  title: string
  category: string
  location: string
  rating: number
  projectsCompleted: number
  avatar: string
}

export function FeaturedVolunteersCarousel() {
  const [volunteers, setVolunteers] = useState<VolunteerData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchVolunteers() {
      try {
        const response = await fetch('/api/volunteers?limit=20&sort=rating')
        if (response.ok) {
          const data = await response.json()
          if (data.volunteers && data.volunteers.length > 0) {
            // Map the real data to our display format
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const mappedVolunteers = data.volunteers.map((v: any) => {
              const category = getCategoryFromSkills(v.skills)
              const avatar = getAvatarUrl(v.avatarUrl, v.name)
              
              return {
                id: v._id,
                name: v.name || "Anonymous Volunteer",
                title: v.title || "Volunteer",
                category: category,
                location: v.location || "India",
                rating: v.rating || 4.5,
                projectsCompleted: v.completedProjects || 0,
                avatar: avatar,
              }
            })
            setVolunteers(mappedVolunteers)
          } else {
            // Use fallback data if no volunteers
            setVolunteers(fallbackVolunteers.map(v => ({
              id: v.id,
              name: v.name,
              title: v.title,
              category: v.category,
              location: v.location,
              rating: v.rating,
              projectsCompleted: v.projectsCompleted,
              avatar: v.avatar,
            })))
          }
        } else {
          setVolunteers(fallbackVolunteers.map(v => ({
            id: v.id,
            name: v.name,
            title: v.title,
            category: v.category,
            location: v.location,
            rating: v.rating,
            projectsCompleted: v.projectsCompleted,
            avatar: v.avatar,
          })))
        }
      } catch (error) {
        console.error('Error fetching volunteers:', error)
        setVolunteers(fallbackVolunteers.map(v => ({
          id: v.id,
          name: v.name,
          title: v.title,
          category: v.category,
          location: v.location,
          rating: v.rating,
          projectsCompleted: v.projectsCompleted,
          avatar: v.avatar,
        })))
      } finally {
        setLoading(false)
      }
    }

    fetchVolunteers()
  }, [])

  const displayVolunteers = volunteers.length > 0 ? volunteers : fallbackVolunteers.map(v => ({
    id: v.id,
    name: v.name,
    title: v.title,
    category: v.category,
    location: v.location,
    rating: v.rating,
    projectsCompleted: v.projectsCompleted,
    avatar: v.avatar,
  }))

  if (loading) {
    return (
      <section className="relative overflow-hidden bg-gradient-to-b from-neutral-50 to-white py-20 dark:from-neutral-950 dark:to-neutral-900">
        <div className="text-center">
          <p className="text-neutral-600 dark:text-neutral-400">Loading volunteers...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-neutral-50 to-white py-20 dark:from-neutral-950 dark:to-neutral-900">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-100/20 via-transparent to-transparent dark:from-teal-900/10"></div>
      
      <div className="relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-12 px-4 text-center sm:px-6 lg:px-8"
        >
          <Badge variant="secondary" className="mb-4">
            <TrendingUp className="mr-2 h-3 w-3" />
            Top Volunteers
          </Badge>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl md:text-5xl">
            Meet Our Change Makers
          </h2>
          <p className="mx-auto max-w-2xl text-base text-neutral-600 dark:text-neutral-400 sm:text-lg">
            Inspiring individuals making a real difference in their communities
          </p>
        </motion.div>

        {/* Horizontally Scrollable Grid */}
        <div className="relative">
          <div className="scrollbar-hide flex gap-4 overflow-x-auto px-4 pb-8 sm:px-6 lg:px-8 snap-x snap-mandatory">
            {displayVolunteers.map((volunteer, index) => (
              <motion.div
                key={volunteer.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="snap-start flex-shrink-0 w-[75%] sm:w-[45%] md:w-[30%] lg:w-[23%]"
              >
                <Link href={`/volunteers/${volunteer.id}`} className="block group">
                  <div className="relative h-[50vh] sm:h-[400px] overflow-hidden rounded-2xl bg-neutral-200 dark:bg-neutral-800 shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
                    {/* Volunteer Image */}
                    <Image
                      src={volunteer.avatar}
                      alt={volunteer.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 640px) 75vw, (max-width: 1024px) 30vw, 23vw"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    
                    {/* Category Badge */}
                    <div className="absolute left-3 top-3">
                      <Badge className={`${categoryColors[volunteer.category]} text-white border-0 text-xs`}>
                        {volunteer.category}
                      </Badge>
                    </div>

                    {/* Rating Badge */}
                    <div className="absolute right-3 top-3">
                      <Badge className="bg-white/90 text-neutral-900 dark:bg-neutral-900/90 dark:text-white border-0 text-xs">
                        <Star className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {volunteer.rating}
                      </Badge>
                    </div>

                    {/* Volunteer Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
                      {/* Name */}
                      <h3 className="text-lg font-bold text-white line-clamp-1">
                        {volunteer.name}
                      </h3>
                      
                      {/* Title */}
                      <p className="text-sm text-white/90 line-clamp-1">
                        {volunteer.title}
                      </p>

                      {/* Location */}
                      <div className="flex items-center gap-1.5 text-xs text-white/80">
                        <MapPin className="h-3 w-3" />
                        <span className="line-clamp-1">{volunteer.location}</span>
                      </div>

                      {/* Projects */}
                      <div className="flex items-center gap-1.5 text-xs text-white/80">
                        <Briefcase className="h-3 w-3" />
                        <span>{volunteer.projectsCompleted} Projects</span>
                      </div>
                    </div>

                    {/* Hover Arrow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100">
                      <div className="rounded-full bg-white/20 backdrop-blur-sm p-3 text-white shadow-lg">
                        <ArrowRight className="h-6 w-6" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Scroll Indicator - Left (Blur Effect) - Hidden on mobile */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-8 w-20 bg-gradient-to-r from-neutral-50 via-neutral-50/80 to-transparent dark:from-neutral-950 dark:via-neutral-950/80 backdrop-blur-sm hidden sm:block"></div>
          
          {/* Scroll Indicator - Right (Blur Effect) - Hidden on mobile */}
          <div className="pointer-events-none absolute right-0 top-0 bottom-8 w-20 bg-gradient-to-l from-neutral-50 via-neutral-50/80 to-transparent dark:from-neutral-950 dark:via-neutral-950/80 backdrop-blur-sm hidden sm:block"></div>
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 text-center px-4"
        >
          <Link href="/volunteers">
            <Button size="lg" className="group bg-linear-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-brand-lg">
              View All Volunteers
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  )
}