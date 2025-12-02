'use client'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion, useScroll, useTransform } from "framer-motion"
import { 
  MapPin, 
  Clock,
  Users,
  Briefcase,
  ArrowRight,
  TrendingUp,
  Building2,
  Calendar
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState, useRef } from "react"

// Fallback data
const fallbackJobs = [
  {
    _id: "1",
    title: "English Teacher for Underprivileged Children",
    description: "Teach English to children from underprivileged backgrounds. Help them develop language skills and confidence. Previous teaching experience preferred but not required.",
    category: "Education",
    location: "Delhi, India",
    type: "Part-time",
    skills: ["Teaching", "English", "Communication"],
    ngoId: { orgName: "Teach India Foundation", logoUrl: "" },
    applicationsCount: 12,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "2",
    title: "Medical Camp Volunteer",
    description: "Support monthly medical camps in rural areas. Assist doctors, manage patient registration, and help with health awareness programs.",
    category: "Healthcare",
    location: "Mumbai, India",
    type: "Weekend",
    skills: ["Healthcare", "Organization", "Communication"],
    ngoId: { orgName: "Health For All", logoUrl: "" },
    applicationsCount: 25,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "3",
    title: "Beach Clean-up Coordinator",
    description: "Lead beach clean-up drives and marine conservation efforts. Organize volunteers, manage waste segregation.",
    category: "Environment",
    location: "Goa, India",
    type: "Full-time",
    skills: ["Leadership", "Environment", "Organization"],
    ngoId: { orgName: "Green Earth Warriors", logoUrl: "" },
    applicationsCount: 8,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "4",
    title: "Youth Mentor Program",
    description: "Mentor young adults from economically disadvantaged backgrounds. Guide them in career planning and personal development.",
    category: "Community",
    location: "Bangalore, India",
    type: "Part-time",
    skills: ["Mentoring", "Career Guidance", "Communication"],
    ngoId: { orgName: "Youth Empowerment Network", logoUrl: "" },
    applicationsCount: 15,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "5",
    title: "Digital Literacy Trainer",
    description: "Teach basic computer skills and internet safety to adults and seniors. Help bridge the digital divide.",
    category: "Technology",
    location: "Pune, India",
    type: "Remote",
    skills: ["Computer Skills", "Teaching", "Patience"],
    ngoId: { orgName: "Tech For Good", logoUrl: "" },
    applicationsCount: 20,
    createdAt: new Date().toISOString(),
  },
]

const categoryColors: Record<string, string> = {
  Education: "from-blue-500 to-blue-600",
  Healthcare: "from-red-500 to-red-600",
  Environment: "from-green-500 to-green-600",
  Technology: "from-teal-500 to-teal-600",
  Community: "from-amber-500 to-amber-600",
  "Animal Welfare": "from-emerald-500 to-emerald-600",
}

const categoryImages: Record<string, string> = {
  Education: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
  Healthcare: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
  Environment: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80",
  Technology: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
  Community: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80",
  "Animal Welfare": "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=800&q=80",
}

interface Job {
  _id: string
  title: string
  description: string
  category?: string
  location?: string
  type?: string
  skills?: string[]
  ngoId: {
    orgName?: string
    logoUrl?: string
  }
  applicationsCount?: number
  createdAt: string
}

function getTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInHours / 24)
  
  if (diffInDays > 7) return `${Math.floor(diffInDays / 7)}w ago`
  if (diffInDays > 0) return `${diffInDays}d ago`
  if (diffInHours > 0) return `${diffInHours}h ago`
  return 'Just now'
}

function StackedCard({ job, index, total }: { job: Job; index: number; total: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  })

  // Calculate transforms based on scroll and card index
  const scale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.8 + (index * 0.05), 1, 1]
  )
  
  const rotateX = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [10, 0, -10]
  )
  
  const y = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [100, 0, -100]
  )

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0.3, 1, 1, 0.3]
  )

  return (
    <motion.div
      ref={cardRef}
      style={{
        scale,
        rotateX,
        y,
        opacity,
        transformPerspective: 1000,
      }}
      className="sticky top-20 mb-8"
    >
      <Link href={`/jobs/${job._id}`} className="block group">
        <div className="relative h-[500px] lg:h-[400px] overflow-hidden rounded-3xl bg-white dark:bg-neutral-900 shadow-2xl transition-all duration-500 hover:shadow-3xl border-2 border-neutral-200 dark:border-neutral-800">
          {/* Background Image */}
          <div className="absolute inset-0 lg:w-1/2">
            <Image
              src={categoryImages[job.category || 'Community']}
              alt={job.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-black/20 to-black/40 lg:to-transparent"></div>
          </div>

          {/* Content */}
          <div className="relative h-full flex flex-col lg:flex-row">
            {/* Left side - Image overlay content on mobile, empty on desktop */}
            <div className="lg:w-1/2 p-6 lg:p-8 flex flex-col justify-between lg:justify-end">
              <div className="lg:hidden">
                {/* Category Badge */}
                <Badge className={`bg-linear-to-r ${categoryColors[job.category || 'Community']} text-white border-0 mb-4`}>
                  {job.category || 'Community'}
                </Badge>
              </div>
              
              <div className="hidden lg:block">
                {/* Desktop: Category Badge at bottom */}
                <Badge className={`bg-linear-to-r ${categoryColors[job.category || 'Community']} text-white border-0`}>
                  {job.category || 'Community'}
                </Badge>
              </div>
            </div>

            {/* Right side - Main content */}
            <div className="lg:w-1/2 p-6 lg:p-8 flex flex-col justify-between bg-white dark:bg-neutral-900 lg:bg-transparent">
              <div className="space-y-4">
                {/* Mobile: Category badge */}
                <div className="lg:hidden">
                  <Badge className={`bg-linear-to-r ${categoryColors[job.category || 'Community']} text-white border-0`}>
                    {job.category || 'Community'}
                  </Badge>
                </div>

                {/* Title */}
                <h3 className="text-2xl lg:text-3xl font-bold text-neutral-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {job.title}
                </h3>

                {/* Description */}
                <p className="text-sm lg:text-base text-neutral-600 dark:text-neutral-400 line-clamp-3">
                  {job.description}
                </p>

                {/* NGO */}
                <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                  <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="font-medium line-clamp-1">
                    {job.ngoId?.orgName || 'NGO Partner'}
                  </span>
                </div>

                {/* Skills */}
                {job.skills && job.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {job.skills.slice(0, 3).map((skill, idx) => (
                      <Badge 
                        key={idx} 
                        variant="secondary" 
                        className="text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                      >
                        {skill}
                      </Badge>
                    ))}
                    {job.skills.length > 3 && (
                      <Badge 
                        variant="secondary" 
                        className="text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                      >
                        +{job.skills.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Stats */}
              <div className="space-y-4 mt-6">
                <div className="grid grid-cols-2 gap-3">
                  {/* Location */}
                  <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                    <MapPin className="h-4 w-4 shrink-0" />
                    <span className="line-clamp-1">{job.location || 'Remote'}</span>
                  </div>

                  {/* Type */}
                  <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                    <Briefcase className="h-4 w-4 shrink-0" />
                    <span>{job.type || 'Flexible'}</span>
                  </div>

                  {/* Time */}
                  <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                    <Clock className="h-4 w-4 shrink-0" />
                    <span>{getTimeAgo(job.createdAt)}</span>
                  </div>

                  {/* Applicants */}
                  {job.applicationsCount !== undefined && (
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                      <Users className="h-4 w-4 shrink-0" />
                      <span>{job.applicationsCount} applied</span>
                    </div>
                  )}
                </div>

                {/* Apply Button */}
                <Button className="w-full group/btn bg-linear-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-brand-lg">
                  Apply Now
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </div>
            </div>
          </div>

          {/* Hover Effect Indicator */}
          <div className="absolute top-6 right-6 opacity-0 transition-opacity group-hover:opacity-100">
            <div className="rounded-full bg-blue-600 p-3 text-white shadow-lg">
              <ArrowRight className="h-5 w-5" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export function RecentJobsStacked() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await fetch('/api/jobs?limit=5&sort=recent')
        if (response.ok) {
          const data = await response.json()
          if (data.jobs && data.jobs.length > 0) {
            setJobs(data.jobs)
          } else {
            setJobs(fallbackJobs)
          }
        } else {
          setJobs(fallbackJobs)
        }
      } catch (error) {
        console.error('Error fetching jobs:', error)
        setJobs(fallbackJobs)
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  const displayJobs = jobs.length > 0 ? jobs : fallbackJobs

  if (loading) {
    return (
      <section className="relative bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-950 dark:to-neutral-900 py-20">
        <div className="text-center">
          <p className="text-neutral-600 dark:text-neutral-400">Loading opportunities...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="relative bg-gradient-to-b from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 py-20">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-transparent dark:from-blue-900/10"></div>
      
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <Badge variant="secondary" className="mb-4">
            <TrendingUp className="mr-2 h-3 w-3" />
            Latest Opportunities
          </Badge>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl md:text-5xl">
            Recent Volunteer Jobs
          </h2>
          <p className="mx-auto max-w-2xl text-base text-neutral-600 dark:text-neutral-400 sm:text-lg">
            Discover meaningful opportunities to make a difference. Scroll to explore cards.
          </p>
        </motion.div>

        {/* Stacked Cards */}
        <div className="space-y-8">
          {displayJobs.map((job, index) => (
            <StackedCard
              key={job._id}
              job={job}
              index={index}
              total={displayJobs.length}
            />
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <Link href="/jobs">
            <Button size="lg" className="group bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
              View All Jobs
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
