'use client'

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Heart, Users, Target, ArrowRight, Sparkles, TrendingUp, Globe, Shield, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const volunteerImages = [
  {
    url: "/akash.jpg",
    name: "Community Impact",
    role: "Teaching & Mentoring",
    volunteers: "2,400+"
  },
  {
    url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687",
    name: "Healthcare Support",
    role: "Medical Volunteering",
    volunteers: "1,800+"
  },
  {
    url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687",
    name: "Environmental Action",
    role: "Green Initiatives",
    volunteers: "3,200+"
  },
  {
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687",
    name: "Youth Development",
    role: "Skill Training",
    volunteers: "1,500+"
  },
]

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-teal-50/30 to-slate-50 dark:from-neutral-950 dark:via-teal-950/10 dark:to-neutral-950">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      {/* Single Gradient Orb */}
      <div className="absolute top-20 right-1/4 h-96 w-96 animate-pulse rounded-full bg-teal-500/10 blur-3xl"></div>
      
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          {/* Left Content */}
          <div className="flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge variant="secondary" className="mb-4 w-fit border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-800 dark:bg-teal-950 dark:text-teal-300">
                <Globe className="mr-2 h-3 w-3" />
                🌍 Trusted by 1,200+ NGOs across Asia
              </Badge>
              
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-5xl md:text-6xl lg:text-6xl">
                Transform Lives Through
                <span className="block gradient-text m-2"> Meaningful Action</span>
              </h1>
              
              <p className="mb-8 max-w-xl text-lg text-neutral-600 dark:text-neutral-400">
                Connect with verified organizations, track your impact in real-time, 
                and join Asia&apos;s largest community of changemakers.
              </p>

              {/* Stats */}
              <div className="mb-10 grid grid-cols-3 gap-4 sm:gap-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/30 scale-hover-sm">
                      <Users className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-white sm:text-3xl">50K+</p>
                  <div className="flex items-center gap-1 text-xs text-teal-600 dark:text-teal-400">
                    <TrendingUp className="h-3 w-3" />
                    <span>12% this month</span>
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 sm:text-sm">Active Volunteers</p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                      <Target className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-white sm:text-3xl">1.2K+</p>
                  <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                    <Shield className="h-3 w-3" />
                    <span>100% verified</span>
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 sm:text-sm">Verified NGOs</p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lime-100 dark:bg-lime-900/30">
                      <Heart className="h-5 w-5 text-lime-600 dark:text-lime-400" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-white sm:text-3xl">2M+</p>
                  <div className="flex items-center gap-1 text-xs text-lime-600 dark:text-lime-400">
                    <TrendingUp className="h-3 w-3" />
                    <span>Growing daily</span>
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 sm:text-sm">Impact Hours</p>
                </motion.div>
              </div>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="flex flex-col gap-4 sm:flex-row"
              >
                <Link href="/signup" className="w-full sm:w-auto">
                  <Button size="lg" className="btn-primary w-full group">
                    Start Your Journey
                    <ArrowRight className="ml-2 h-4 w-4 slide-in-right" />
                  </Button>
                </Link>
                <Link href="/jobs" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full border-teal-300 hover:bg-teal-50 dark:border-teal-700 dark:hover:bg-teal-950/30">
                    Explore Opportunities
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Content - 3D Draggable Volunteer Cards */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {volunteerImages.map((volunteer, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className={index === 1 || index === 2 ? "mt-6 sm:mt-8" : ""}
                >
                  <Card className="group relative h-full w-full overflow-hidden rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm card-hover-lift hover:border-teal-300 dark:border-neutral-800 dark:bg-neutral-950 sm:p-4">
                    <div className="relative aspect-3/4 w-full overflow-hidden rounded-xl">
                      <Image
                        src={volunteer.url}
                        alt={volunteer.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent"></div>
                      
                      {/* Hover overlay */}
                      <div className="gradient-overlay absolute inset-0 flex items-center justify-center">
                        <div className="fade-in-hover text-white">
                          <Heart className="h-8 w-8" />
                        </div>
                      </div>
                      
                      <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                        <p className="text-xs font-semibold sm:text-sm">{volunteer.name}</p>
                        <p className="text-[10px] text-neutral-300 sm:text-xs">{volunteer.role}</p>
                        <p className="mt-1 text-[10px] text-teal-300 sm:text-xs">{volunteer.volunteers} volunteers</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Floating Badge */}
            <motion.div
              className="absolute -right-2 top-1/2 hidden -translate-y-1/2 sm:-right-4 lg:block"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="trust-badge rounded-2xl p-4 shadow-brand-xl">
                <div className="text-center">
                  <div className="mb-2 flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span className="ml-2 text-xs text-neutral-600 dark:text-neutral-400">Verified</span>
                  </div>
                  <p className="text-2xl font-bold gradient-text">100%</p>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">Trusted NGOs</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
