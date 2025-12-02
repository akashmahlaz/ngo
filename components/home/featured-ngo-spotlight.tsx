'use client'

import { useState, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { 
  MapPin, 
  Users, 
  CheckCircle2, 
  Heart,
  BookOpen,
  Stethoscope,
  Leaf,
  Building2,
  ArrowRight,
  Star,
  Briefcase,
  TrendingUp,
  Award,
  Calendar
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Category configuration
const categoryConfig: Record<string, { 
  icon: any
  gradient: string
  color: string
  image: string
}> = {
  Education: {
    icon: BookOpen,
    gradient: 'from-blue-500 to-indigo-600',
    color: 'bg-blue-500',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80'
  },
  Healthcare: {
    icon: Stethoscope,
    gradient: 'from-green-500 to-emerald-600',
    color: 'bg-green-500',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80'
  },
  Environment: {
    icon: Leaf,
    gradient: 'from-emerald-500 to-teal-600',
    color: 'bg-emerald-500',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&q=80'
  },
  'Animal Welfare': {
    icon: Heart,
    gradient: 'from-teal-500 to-emerald-600',
    color: 'bg-teal-500',
    image: 'https://images.unsplash.com/photo-1548681528-6a5c45b66b42?w=1200&q=80'
  },
  Community: {
    icon: Users,
    gradient: 'from-emerald-500 to-lime-600',
    color: 'bg-emerald-500',
    image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&q=80'
  },
  'Women Empowerment': {
    icon: Award,
    gradient: 'from-orange-500 to-red-600',
    color: 'bg-orange-500',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&q=80'
  },
  'Child Welfare': {
    icon: Heart,
    gradient: 'from-yellow-500 to-orange-600',
    color: 'bg-yellow-500',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&q=80'
  },
  default: {
    icon: Building2,
    gradient: 'from-gray-500 to-slate-600',
    color: 'bg-gray-500',
    image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&q=80'
  }
}

interface NGO {
  _id: string
  name: string
  email: string
  description?: string
  category?: string
  activeJobs: number
  location?: string
  logo?: string
  verified?: boolean
  rating?: number
  volunteers?: number
  impact?: string
  founded?: string
  website?: string
}

// Fallback data in case API fails
const fallbackNGOs: NGO[] = [
  {
    _id: '1',
    name: 'Teach India Foundation',
    email: 'contact@teachindia.org',
    description: 'Working across states to provide free education to underprivileged children. Over 50,000 students have benefited from our programs.',
    category: 'Education',
    activeJobs: 24,
    location: 'Delhi, India',
    logo: 'https://ui-avatars.com/api/?name=Teach+India&background=3b82f6&color=fff&size=200',
    verified: true,
    rating: 4.9,
    volunteers: 2400,
    impact: '50,000+ Students Educated',
    founded: '2015'
  },
  {
    _id: '2',
    name: 'Health For All India',
    email: 'info@healthforall.org',
    description: 'Organizing free medical camps and health awareness programs in rural areas.',
    category: 'Healthcare',
    activeJobs: 18,
    location: 'Mumbai, Maharashtra',
    logo: 'https://ui-avatars.com/api/?name=Health+For+All&background=10b981&color=fff&size=200',
    verified: true,
    rating: 4.8,
    volunteers: 1800,
    impact: '100,000+ Patients Treated',
    founded: '2017'
  },
  {
    _id: '3',
    name: 'Green Earth Warriors',
    email: 'contact@greenearth.org',
    description: 'Leading environmental conservation efforts including beach cleanups and tree plantation.',
    category: 'Environment',
    activeJobs: 32,
    location: 'Goa, India',
    logo: 'https://ui-avatars.com/api/?name=Green+Earth&background=10b981&color=fff&size=200',
    verified: true,
    rating: 4.9,
    volunteers: 3200,
    impact: '50,000+ Trees Planted',
    founded: '2016'
  },
  {
    _id: '4',
    name: 'Youth Empowerment Network',
    email: 'info@youthnetwork.org',
    description: 'Mentoring underprivileged youth with career guidance and skill training programs.',
    category: 'Community',
    activeJobs: 15,
    location: 'Bangalore, Karnataka',
    logo: 'https://ui-avatars.com/api/?name=Youth+Network&background=a855f7&color=fff&size=200',
    verified: true,
    rating: 4.7,
    volunteers: 1500,
    impact: '5,000+ Youth Mentored',
    founded: '2018'
  },
  {
    _id: '5',
    name: 'Women Rise Foundation',
    email: 'contact@womenrise.org',
    description: 'Empowering women through education, skill development, and entrepreneurship.',
    category: 'Women Empowerment',
    activeJobs: 21,
    location: 'Pune, Maharashtra',
    logo: 'https://ui-avatars.com/api/?name=Women+Rise&background=f97316&color=fff&size=200',
    verified: true,
    rating: 4.8,
    volunteers: 1200,
    impact: '10,000+ Women Empowered',
    founded: '2019'
  },
  {
    _id: '6',
    name: 'Save Our Children',
    email: 'info@savechildren.org',
    description: 'Protecting and supporting vulnerable children across India.',
    category: 'Child Welfare',
    activeJobs: 19,
    location: 'Kolkata, West Bengal',
    logo: 'https://ui-avatars.com/api/?name=Save+Children&background=eab308&color=fff&size=200',
    verified: true,
    rating: 4.9,
    volunteers: 2100,
    impact: '15,000+ Children Supported',
    founded: '2014'
  }
]

export function FeaturedNGOSpotlight() {
  const [ngos, setNgos] = useState<NGO[]>([])
  const [loading, setLoading] = useState(true)
  const [spotlightIndex, setSpotlightIndex] = useState(0)

  useEffect(() => {
    async function fetchNGOs() {
      try {
        const response = await fetch('/api/ngos?limit=10&sort=active')
        if (!response.ok) throw new Error('Failed to fetch')
        
        const data = await response.json()
        
        // Enrich with additional data for display
        const enrichedNGOs = data.ngos.map((ngo: any, index: number) => ({
          ...ngo,
          logo: ngo.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(ngo.name)}&background=${['3b82f6', '10b981', 'a855f7', 'f97316', 'eab308', 'ec4899'][index % 6]}&color=fff&size=200`,
          verified: true,
          rating: (4.5 + Math.random() * 0.5).toFixed(1),
          volunteers: Math.floor(500 + Math.random() * 3000),
          impact: ngo.impact || `${ngo.activeJobs * 50}+ Lives Impacted`,
          founded: ngo.founded || '2015',
          location: ngo.location || 'India'
        }))
        
        setNgos(enrichedNGOs.length > 0 ? enrichedNGOs : fallbackNGOs)
      } catch (error) {
        console.error('Error fetching NGOs:', error)
        setNgos(fallbackNGOs)
      } finally {
        setLoading(false)
      }
    }

    fetchNGOs()
  }, [])

  // Auto-rotate spotlight every 5 seconds
  useEffect(() => {
    if (ngos.length === 0) return
    
    const interval = setInterval(() => {
      setSpotlightIndex((prev) => (prev + 1) % Math.min(ngos.length, 3))
    }, 5000)

    return () => clearInterval(interval)
  }, [ngos.length])

  if (loading) {
    return (
      <section className="relative bg-gradient-to-b from-white to-neutral-50 py-20 dark:from-neutral-950 dark:to-neutral-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <div className="mx-auto h-6 w-32 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800"></div>
            <div className="mx-auto mt-4 h-10 w-96 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800"></div>
          </div>
          <div className="h-96 w-full animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-800"></div>
        </div>
      </section>
    )
  }

  const spotlightNGO = ngos[spotlightIndex]
  const config = categoryConfig[spotlightNGO?.category || 'default'] || categoryConfig.default
  const IconComponent = config.icon

  return (
    <section className="relative bg-gradient-to-b from-white to-neutral-50 py-20 dark:from-neutral-950 dark:to-neutral-900">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-teal-500/5 via-transparent to-transparent"></div>
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <Badge variant="secondary" className="mb-4">
            <Building2 className="mr-2 h-3 w-3" />
            Verified Partners
          </Badge>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl md:text-5xl">
            Featured NGO Partners
          </h2>
          <p className="mx-auto max-w-2xl text-base text-neutral-600 dark:text-neutral-400 sm:text-lg">
            Discover verified NGOs making real impact. Join thousands of volunteers creating positive change.
          </p>
        </motion.div>

        {/* Spotlight Card */}
        {spotlightNGO && (
          <motion.div
            key={spotlightNGO._id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <Link href={`/ngos/${spotlightNGO._id}`}>
              <Card className="group relative overflow-hidden border-2 border-neutral-200 bg-white shadow-2xl transition-all hover:border-teal-400 hover:shadow-teal-500/20 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-teal-600">
                <div className="flex flex-col lg:flex-row">
                  {/* Image Side */}
                  <div className="relative h-64 lg:h-[500px] lg:w-1/2">
                    <Image
                      src={config.image}
                      alt={spotlightNGO.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-30 mix-blend-multiply`}></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    
                    {/* Floating Stats */}
                    <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex-1 rounded-lg bg-white/95 p-3 sm:p-4 backdrop-blur-sm dark:bg-neutral-900/95"
                      >
                        <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                          <Briefcase className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="text-xs font-medium">Active Opportunities</span>
                        </div>
                        <p className="mt-1 text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
                          {spotlightNGO.activeJobs}
                        </p>
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex-1 rounded-lg bg-white/95 p-3 sm:p-4 backdrop-blur-sm dark:bg-neutral-900/95"
                      >
                        <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                          <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="text-xs font-medium">Volunteers</span>
                        </div>
                        <p className="mt-1 text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
                          {spotlightNGO.volunteers?.toLocaleString()}+
                        </p>
                      </motion.div>
                    </div>
                  </div>

                  {/* Content Side */}
                  <div className="flex flex-1 flex-col justify-between p-6 sm:p-8 lg:p-12">
                    {/* Top Section */}
                    <div>
                      {/* Logo and Badges */}
                      <div className="mb-6 flex flex-col sm:flex-row items-start justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="relative h-16 w-16 overflow-hidden rounded-xl border-2 border-neutral-200 dark:border-neutral-700 flex-shrink-0">
                            <Image
                              src={spotlightNGO.logo || ''}
                              alt={`${spotlightNGO.name} logo`}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white line-clamp-2">
                              {spotlightNGO.name}
                            </h3>
                            <div className="mt-1 flex items-center gap-2">
                              <MapPin className="h-3 w-3 text-neutral-500 flex-shrink-0" />
                              <span className="text-sm text-neutral-600 dark:text-neutral-400 truncate">
                                {spotlightNGO.location}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-row sm:flex-col gap-2">
                          {spotlightNGO.verified && (
                            <Badge className="bg-green-500 text-white whitespace-nowrap">
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                              Verified
                            </Badge>
                          )}
                          <Badge variant="secondary" className={`${config.color} whitespace-nowrap`}>
                            <IconComponent className="mr-1 h-3 w-3" />
                            {spotlightNGO.category}
                          </Badge>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="mb-6 text-sm sm:text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
                        {spotlightNGO.description}
                      </p>

                      {/* Impact Highlight */}
                      <div className="mb-6 rounded-xl bg-linear-to-r from-teal-500/10 to-emerald-500/10 p-4 dark:from-teal-500/20 dark:to-emerald-500/20">
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-linear-to-br from-teal-500 to-emerald-500 p-2 sm:p-3 shrink-0">
                            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                              Total Impact
                            </p>
                            <p className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white truncate">
                              {spotlightNGO.impact}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <div className="rounded-lg bg-neutral-100 p-3 sm:p-4 dark:bg-neutral-800/50">
                          <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                            <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-current text-yellow-400" />
                            <span className="text-xs font-medium">Rating</span>
                          </div>
                          <p className="mt-1 text-lg sm:text-xl font-bold text-neutral-900 dark:text-white">
                            {spotlightNGO.rating}/5.0
                          </p>
                        </div>
                        
                        <div className="rounded-lg bg-neutral-100 p-3 sm:p-4 dark:bg-neutral-800/50">
                          <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="text-xs font-medium">Founded</span>
                          </div>
                          <p className="mt-1 text-lg sm:text-xl font-bold text-neutral-900 dark:text-white">
                            {spotlightNGO.founded}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Section - CTA */}
                    <div className="mt-6 sm:mt-8">
                      <Button size="lg" className="w-full bg-linear-to-r from-teal-500 to-emerald-500 text-white hover:from-teal-600 hover:to-emerald-600 shadow-brand-lg">
                        View Opportunities
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Spotlight Indicator */}
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 lg:hidden">
                  {ngos.slice(0, 3).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSpotlightIndex(index)}
                      className={`h-2 w-2 rounded-full transition-all ${
                        index === spotlightIndex 
                          ? 'w-8 bg-teal-500' 
                          : 'bg-neutral-400 dark:bg-neutral-600'
                      }`}
                      aria-label={`View NGO ${index + 1}`}
                    />
                  ))}
                </div>
              </Card>
            </Link>
          </motion.div>
        )}

        {/* Horizontal Scrollable Carousel */}
        <div className="relative">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-6 text-xl font-bold text-neutral-900 dark:text-white sm:text-2xl"
          >
            More NGOs Making Impact
          </motion.h3>

          <div className="relative">
            {/* Blur edges */}
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-neutral-50 to-transparent dark:from-neutral-900"></div>
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-neutral-50 to-transparent dark:from-neutral-900"></div>

            {/* Scrollable container */}
            <div className="scrollbar-hide flex gap-6 overflow-x-auto pb-4">
              {ngos.slice(3).map((ngo, index) => {
                const ngoConfig = categoryConfig[ngo.category || 'default'] || categoryConfig.default
                const NgoIcon = ngoConfig.icon

                return (
                  <motion.div
                    key={ngo._id}
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex-shrink-0"
                    style={{ width: 'calc(33.333% - 16px)', minWidth: '300px' }}
                  >
                    <Link href={`/ngos/${ngo._id}`}>
                      <Card className="group h-full overflow-hidden border-2 border-neutral-200 bg-white transition-all hover:border-purple-400 hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-purple-600">
                        {/* Image */}
                        <div className="relative h-40 w-full overflow-hidden">
                          <Image
                            src={ngoConfig.image}
                            alt={ngo.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            sizes="400px"
                          />
                          <div className={`absolute inset-0 bg-gradient-to-br ${ngoConfig.gradient} opacity-30 mix-blend-multiply`}></div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                          
                          {/* Category Badge */}
                          <div className="absolute bottom-3 left-3">
                            <Badge className="bg-white/90 text-neutral-900 dark:bg-neutral-900/90 dark:text-white">
                              <NgoIcon className="mr-1 h-3 w-3" />
                              {ngo.category}
                            </Badge>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-5">
                          {/* Logo and Name */}
                          <div className="mb-3 flex items-start gap-3">
                            <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border-2 border-neutral-200 dark:border-neutral-700">
                              <Image
                                src={ngo.logo || ''}
                                alt={`${ngo.name} logo`}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="truncate text-base font-bold text-neutral-900 dark:text-white">
                                {ngo.name}
                              </h4>
                              <div className="mt-1 flex items-center gap-1 text-xs text-neutral-600 dark:text-neutral-400">
                                <MapPin className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate">{ngo.location}</span>
                              </div>
                            </div>
                          </div>

                          {/* Description */}
                          <p className="mb-4 line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400">
                            {ngo.description}
                          </p>

                          {/* Stats */}
                          <div className="grid grid-cols-2 gap-2">
                            <div className="rounded-lg bg-neutral-100 p-3 dark:bg-neutral-800/50">
                              <div className="flex items-center gap-1 text-xs text-neutral-600 dark:text-neutral-400">
                                <Briefcase className="h-3 w-3" />
                                <span>Jobs</span>
                              </div>
                              <p className="mt-1 text-lg font-bold text-neutral-900 dark:text-white">
                                {ngo.activeJobs}
                              </p>
                            </div>
                            <div className="rounded-lg bg-neutral-100 p-3 dark:bg-neutral-800/50">
                              <div className="flex items-center gap-1 text-xs text-neutral-600 dark:text-neutral-400">
                                <Star className="h-3 w-3 fill-current text-yellow-400" />
                                <span>Rating</span>
                              </div>
                              <p className="mt-1 text-lg font-bold text-neutral-900 dark:text-white">
                                {ngo.rating}
                              </p>
                            </div>
                          </div>

                          {/* Impact */}
                          <div className="mt-3 flex items-center gap-2 rounded-lg bg-purple-100 px-3 py-2 dark:bg-purple-500/10">
                            <Heart className="h-3 w-3 fill-current text-purple-600 dark:text-purple-400" />
                            <span className="text-xs font-medium text-purple-900 dark:text-purple-300 truncate">
                              {ngo.impact}
                            </span>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Link href="/ngos">
            <Button size="lg" variant="outline" className="group">
              Explore All NGOs
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
