"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { 
  Heart, 
  Mail, 
  ArrowRight, 
  Github, 
  Twitter, 
  Linkedin, 
  Instagram,
  Briefcase,
  Users,
  Building2,
  FileText,
  Shield,
  HelpCircle,
  Phone,
  MapPin,
  Crown,
  Zap,
  Sparkles
} from "lucide-react"

const footerSections = {
  platform: {
    title: "Platform",
    links: [
      { title: "Browse Jobs", href: "/jobs" },
      { title: "Find Volunteers", href: "/volunteers" },
      { title: "Organizations", href: "/ngos" },
      { title: "Success Stories", href: "/stories" },
    ]
  },
  forNGOs: {
    title: "For Organizations", 
    links: [
      { title: "Post a Job", href: "/ngos/post" },
      { title: "Pricing Plans", href: "/pricing" },
      { title: "How It Works", href: "/ngos/how-it-works" },
      { title: "Best Practices", href: "/ngos/best-practices" },
    ]
  },
  forVolunteers: {
    title: "For Volunteers",
    links: [
      { title: "Build Profile", href: "/volunteers/profile" },
      { title: "Application Tips", href: "/volunteers/tips" },
      { title: "Skill Badges", href: "/volunteers/badges" },
      { title: "Community", href: "/community" },
    ]
  },
  resources: {
    title: "Resources",
    links: [
      { title: "Help Center", href: "/help" },
      { title: "Blog", href: "/blog" },
      { title: "API Documentation", href: "/api-docs" },
      { title: "Guides", href: "/guides" },
    ]
  },
  company: {
    title: "Company",
    links: [
      { title: "About Us", href: "/about" },
      { title: "Careers", href: "/careers" },
      { title: "Press Kit", href: "/press" },
      { title: "Contact", href: "/contact" },
    ]
  },
  legal: {
    title: "Legal",
    links: [
      { title: "Privacy Policy", href: "/privacy" },
      { title: "Terms of Service", href: "/terms" },
      { title: "Cookie Policy", href: "/cookies" },
      { title: "Data Protection", href: "/data-protection" },
    ]
  }
}

const quickActions = [
  { title: "Dashboard", href: "/dashboard", icon: Briefcase, description: "Access your dashboard" },
  { title: "Applications", href: "/applications", icon: FileText, description: "Track your applications" },
  // { title: "Messages", href: "/messages", icon: Mail, description: "View conversations" },
  { title: "Settings", href: "/settings", icon: Shield, description: "Account settings" },
]

export function UniversalFooter() {
  const { data: session } = useSession()
  const user = session?.user as any
  const role = (session as any)?.role
  const plan = (session as any)?.plan
  const isPlusUser = plan === "volunteer_plus" || plan === "ngo_plus"
  const isAuthenticated = !!session

  const [email, setEmail] = useState("")
  const [subscribing, setSubscribing] = useState(false)

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault()
    
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address")
      return
    }

    setSubscribing(true)
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      })

      const data = await res.json()

      if (res.ok) {
        toast.success(data.message || "Successfully subscribed!")
        setEmail("")
      } else {
        toast.error(data.error || "Failed to subscribe")
      }
    } catch (error) {
      console.error("Subscribe error:", error)
      toast.error("Failed to subscribe. Please try again.")
    } finally {
      setSubscribing(false)
    }
  }

  return (
    <footer className="bg-linear-to-br from-white via-purple-50/30 to-pink-50/30 dark:from-neutral-950 dark:via-purple-950/10 dark:to-pink-950/10 border-t-2 border-purple-200 dark:border-purple-800">
      <div className="container mx-auto px-4 py-12">
        
        {/* Authenticated User Section */}
        {isAuthenticated && (
          <div className="mb-12">
            <div className="bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border border-purple-200 dark:border-purple-800 rounded-4xl p-6 shadow-lg shadow-purple-500/10">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-4xl bg-linear-to-br from-purple-600 via-pink-600 to-orange-600 flex items-center justify-center relative shadow-lg">
                    <Image src={"/ASIA.png"} alt="Just Because Asia" width={100} height={100} className="h-12 w-12 rounded-4xl text-white" />
                    {isPlusUser && (
                      <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-linear-to-r from-purple-600 to-pink-600 flex items-center justify-center border-2 border-white dark:border-neutral-950 shadow-lg">
                        <Sparkles className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg">Welcome back, {user?.name?.split(' ')[0] || 'there'}!</h3>
                      {isPlusUser && (
                        <Badge className="bg-linear-to-r from-purple-600 to-pink-600 text-white border-0 shadow-lg">
                          <Crown className="h-3 w-3 mr-1" />
                          Plus
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground">
                      {role === "volunteer" 
                        ? "Keep making a difference in your community" 
                        : "Continue building your team of changemakers"
                      }
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {quickActions.map((action) => (
                    <Link 
                      key={action.title}
                      href={action.href}
                      className="group flex items-center gap-3 p-3 rounded-2xl bg-white/60 dark:bg-neutral-900/60 hover:bg-white dark:hover:bg-neutral-900 border-2 border-transparent hover:border-purple-300 dark:hover:border-purple-700 transition-all"
                    >
                      <div className="h-8 w-8 rounded-xl bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center group-hover:shadow-lg transition-all">
                        <action.icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="hidden xl:block">
                        <p className="font-semibold text-sm">{action.title}</p>
                        <p className="text-xs text-muted-foreground">{action.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="mb-12">
          <div className="relative bg-linear-to-r from-purple-600 via-pink-600 to-orange-600 rounded-3xl p-8 text-center overflow-hidden shadow-xl">
            {/* Decorative elements */}
            <div className="absolute -top-10 -left-10 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
            <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
            
            <div className="relative max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="h-10 w-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Stay Connected
                </h3>
              </div>
              <p className="text-white/90 mb-6 text-lg">
                Get the latest opportunities, success stories, and platform updates delivered to your inbox
              </p>
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..." 
                  className="rounded-2xl border-2 border-white/30 focus:border-white bg-white/20 backdrop-blur-sm text-white placeholder:text-white/70"
                  disabled={subscribing}
                  required
                />
                <Button 
                  type="submit"
                  disabled={subscribing}
                  className="rounded-2xl bg-white text-purple-600 hover:bg-white/90 px-6 font-semibold shadow-lg"
                >
                  {subscribing ? "Subscribing..." : "Subscribe"}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </form>
              <p className="text-xs text-white/70 mt-3">
                Join 10,000+ changemakers. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          {Object.entries(footerSections).map(([key, section]) => (
            <div key={key} className="space-y-4">
              <h4 className="font-bold text-sm uppercase tracking-wide bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors hover:underline underline-offset-4"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="mb-8 bg-linear-to-r from-transparent via-purple-300 dark:via-purple-800 to-transparent" />

        {/* Bottom Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Brand & Copyright */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <Image
                src="/ASIA.png"
                alt="Just Because Asia"
                width={40}
                height={40}
                className="rounded-2xl group-hover:shadow-lg group-hover:shadow-purple-500/50 transition-all"
              />
              <div>
                <span className="font-bold text-lg bg-linear-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
                  Just Because Asia
                </span>
                <p className="text-xs text-muted-foreground -mt-1">
                  Connecting hearts, changing lives
                </p>
              </div>
            </Link>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Mail className="h-3 w-3 text-purple-600" />
              </div>
              <a href="mailto:hello@justbecauseasia.org" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                hello@justbecauseasia.org
              </a>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                <Phone className="h-3 w-3 text-pink-600" />
              </div>
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <MapPin className="h-3 w-3 text-orange-600" />
              </div>
              <span>Singapore, Asia</span>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            {[
              { icon: Twitter, href: "https://twitter.com", label: "Twitter", color: "hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-600" },
              { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn", color: "hover:bg-pink-100 dark:hover:bg-pink-900/30 hover:text-pink-600" },
              { icon: Instagram, href: "https://instagram.com", label: "Instagram", color: "hover:bg-orange-100 dark:hover:bg-orange-900/30 hover:text-orange-600" },
              { icon: Github, href: "https://github.com", label: "GitHub", color: "hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-600" },
            ].map((social) => (
              <Button
                key={social.label}
                variant="ghost"
                size="sm"
                className={`h-10 w-10 rounded-2xl ${social.color} transition-all`}
                asChild
              >
                <a 
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              </Button>
            ))}
          </div>
        </div>

        <Separator className="mt-8 mb-6 bg-linear-to-r from-transparent via-purple-300 dark:via-purple-800 to-transparent" />

        {/* Final Copyright */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-sm text-muted-foreground">
            © 2025 Just Because Asia. All rights reserved. Made with{" "}
            <Heart className="inline h-4 w-4 text-pink-600" />{" "}
            for changemakers worldwide.
          </p>
          <div className="flex items-center justify-center sm:justify-end gap-6 text-xs text-muted-foreground">
            <Link href="/privacy" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors">Terms</Link>
            <Link href="/cookies" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">Cookies</Link>
            <Link href="/accessibility" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
