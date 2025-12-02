"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { Home, Search, Briefcase, Menu, User } from "lucide-react"
import { cn } from "@/lib/utils"

const tabs = [
  {
    title: "Home",
    href: "/",
    icon: Home,
    activeFor: ["/"],
  },
  {
    title: "Search",
    href: "/jobs",
    icon: Search,
    activeFor: ["/jobs", "/volunteers", "/ngos"],
  },
  {
    title: "Jobs",
    href: "/jobs",
    icon: Briefcase,
    activeFor: ["/jobs"],
  },
  {
    title: "Profile",
    href: "/profile",
    icon: User,
    auth: true,
    activeFor: ["/volunteer", "/ngo", "/profile"],
  },
  {
    title: "Menu",
    href: "/menu",
    icon: Menu,
    activeFor: ["/menu"],
  },
]

export function MobileBottomNav() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const isAuthenticated = !!session
  const role = (session as any)?.role

  // Hide on these routes
  const hideRoutes = ["/signin", "/signup", "/forgot-password", "/reset-password"]
  if (hideRoutes.some(route => pathname?.startsWith(route))) {
    return null
  }

  const getActiveHref = (tab: typeof tabs[0]) => {
    if (tab.title === "Profile" && isAuthenticated) {
      return role === "volunteer" ? "/volunteer" : role === "ngo" ? "/ngo" : "/profile"
    }
    return tab.href
  }

  const isActive = (tab: typeof tabs[0]) => {
    if (!pathname) return false
    
    // Special handling for profile tab
    if (tab.title === "Profile" && pathname.startsWith("/volunteer")) return true
    if (tab.title === "Profile" && pathname.startsWith("/ngo")) return true
    
    return tab.activeFor.some(route => {
      if (route === "/") return pathname === route
      return pathname.startsWith(route)
    })
  }

  return (
    <>
      {/* Spacer to prevent content from being hidden */}
      <div className="h-20 w-full md:hidden" />
      
      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white/95 backdrop-blur-xl dark:bg-neutral-900/95 md:hidden">
        <div className="mx-auto max-w-lg">
          <div className="flex items-center justify-around">
            {tabs
              .filter(tab => !tab.auth || isAuthenticated)
              .map((tab) => {
                const Icon = tab.icon
                const active = isActive(tab)
                const href = getActiveHref(tab)
                
                return (
                  <Link
                    key={tab.title}
                    href={href}
                    className={cn(
                      "flex flex-1 flex-col items-center justify-center gap-1 py-3 text-xs font-medium transition-colors",
                      active
                        ? "text-teal-600 dark:text-teal-400"
                        : "text-neutral-600 hover:text-teal-600 dark:text-neutral-400 dark:hover:text-teal-400"
                    )}
                  >
                    <div className={cn(
                      "relative flex h-10 w-10 items-center justify-center rounded-full transition-all",
                      active && "bg-teal-100 dark:bg-teal-900/30"
                    )}>
                      <Icon className="h-5 w-5" />
                      {active && (
                        <div className="absolute -top-1 h-1 w-8 rounded-full bg-teal-600" />
                      )}
                    </div>
                    <span>{tab.title}</span>
                  </Link>
                )
              })}
          </div>
        </div>
      </nav>
    </>
  )
}
