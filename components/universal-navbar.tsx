"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Kbd } from "@/components/ui/kbd"
import { ThemeToggle } from "@/components/theme-toggle"
import { 
  Menu, 
  Search, 
  Command as CommandIcon, 
  Crown, 
  Zap,
  Briefcase,
  Users,
  Building2,
  FileText,
  Heart,
  Award,
  Settings,
  LogOut,
  Plus,
  Home,
  User,
  HelpCircle,
  TrendingUp,
  Sparkles,
  Shield,
  LayoutDashboard,
  UserCircle,
  DollarSign,
  BarChart3
} from "lucide-react"
import SignOut from "@/components/auth/sign-out"
import { getDashboardBase, getDashboardProfilePath } from "@/lib/nav"

const navData = {
  main: [
    {
      title: "Jobs",
      href: "/jobs",
      icon: Briefcase,
      description: "Find volunteer opportunities",
      items: [
        { title: "Browse All Jobs", href: "/jobs", description: "View open positions" },
        { title: "Post a Job", href: "/ngos/post", description: "For organizations" },
      ]
    },
    {
      title: "Organizations",
      href: "/ngos", 
      icon: Building2,
      description: "Discover NGOs and nonprofits",
      items: [
        { title: "Browse NGOs", href: "/ngos", description: "All organizations" },
        { title: "Post a Job", href: "/ngos/post", description: "Create opportunity" },
      ]
    },
    {
      title: "Volunteers",
      href: "/volunteers",
      icon: Users,
      description: "Connect with volunteers",
      items: [
        { title: "Browse Volunteers", href: "/volunteers", description: "Find talented people" },
      ]
    },
  ],
  quickActions: [
    { title: "Dashboard", icon: Home, shortcut: "D" },
    { title: "Applications", icon: FileText, shortcut: "A" },
    { title: "Profile", icon: User, shortcut: "P" },
    { title: "Settings", icon: Settings, shortcut: "S" },
  ]
}

export function UniversalNavbar() {
  const [cmdOpen, setCmdOpen] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const router = useRouter()

  // Session helpers
  const user = session?.user as any
  const role = (session as any)?.role
  const plan = (session as any)?.plan
  const isAdmin = (session as any)?.isAdmin || false
  const isAuthenticated = status === "authenticated"
  const hasMemberRole = role === "volunteer" || role === "ngo"
  const normalizedRole = hasMemberRole ? (role as "volunteer" | "ngo") : undefined
  const isPureAdmin = isAdmin && !hasMemberRole
  const isPlusUser = hasMemberRole && (plan === "volunteer_plus" || plan === "ngo_plus")
  const dashboardHref = isPureAdmin ? "/admin" : getDashboardBase(normalizedRole)
  const profileHref = normalizedRole ? getDashboardProfilePath(normalizedRole) : null
  const billingHref = normalizedRole ? `/${normalizedRole}/billing` : null
  const applicationsHref = normalizedRole === "volunteer" ? "/volunteer/applications" : null
  const secondaryAction = profileHref
    ? { href: profileHref, label: "Profile", Icon: User }
    : { href: normalizedRole ? `/${normalizedRole}/settings` : "/settings", label: "Settings", Icon: Settings }
  const SecondaryActionIcon = secondaryAction.Icon

  // Command palette shortcuts
  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setCmdOpen((open) => !open)
      }
      
      // Quick shortcuts when command is open
      if (cmdOpen) {
        if (e.key === "d" && isAuthenticated) {
          e.preventDefault()
          router.push(dashboardHref)
          setCmdOpen(false)
        }
        if (e.key === "p" && isAuthenticated && profileHref) {
          e.preventDefault()
          router.push(profileHref)
          setCmdOpen(false)
        }
        // Admin shortcut
        if (e.key === "a" && isAuthenticated && isAdmin) {
          e.preventDefault()
          router.push("/admin")
          setCmdOpen(false)
        }
      }
    }
    
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [cmdOpen, isAuthenticated, isAdmin, dashboardHref, profileHref, router])

  return (
    <>
      {/* Mobile Floating Navbar */}
      <div className="md:hidden">
        {/* Add padding to body so content doesn't hide behind fixed navbar */}
        <div className="h-20 w-full"></div>
        <div className="fixed top-4 left-4 rounded-4xl right-4 z-50 max-w-screen-sm mx-auto">
          <div className="bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border border-purple-200 dark:border-purple-600 rounded-4xl shadow-2xl shadow-purple-500/20 px-4 py-3 mx-2">
            <div className="flex items-center justify-between">
              {/* Mobile Menu */}
              <Drawer open={mobileOpen} onOpenChange={setMobileOpen}>
                <DrawerTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/30"
                    aria-label="Open navigation menu"
                  >
                    <Menu className="h-4 w-4" />
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="h-[85vh] max-h-[85vh]">
                  <div className="p-6 pb-8 space-y-6 overflow-y-auto">
                    <div className="text-center">
                      <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
                        Navigation
                      </h2>
                      <p className="text-sm text-muted-foreground">Quick access to everything</p>
                    </div>

                    {/* User Section */}
                    {isAuthenticated && (
                      <div className={`${isAdmin ? 'bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border-2 border-red-200 dark:border-red-800' : 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-2 border-purple-200 dark:border-purple-800'} rounded-2xl p-4`}>
                        <div className="flex items-center gap-3 mb-3">
                          <Avatar className={`h-10 w-10 ring-2 ${isAdmin ? 'ring-red-400 dark:ring-red-600' : 'ring-purple-400 dark:ring-purple-600'}`}>
                            <AvatarImage src={user?.avatarUrl} />
                            <AvatarFallback className={`${isAdmin ? 'bg-gradient-to-br from-red-600 to-orange-600' : 'bg-gradient-to-br from-purple-600 to-pink-600'} text-white font-bold`}>
                              {user?.name?.slice(0,2)?.toUpperCase() || "ME"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-semibold text-sm">{user?.name}</p>
                            <div className="flex items-center gap-2 flex-wrap">
                              {isAdmin && (
                                <Badge className="bg-gradient-to-r from-red-600 to-orange-600 text-white border-0 text-xs">
                                  <Shield className="h-3 w-3 mr-1" />
                                  Admin
                                </Badge>
                              )}
                              {role && (
                                <Badge variant="outline" className={`text-xs capitalize ${isAdmin ? 'border-red-300 dark:border-red-700' : 'border-purple-300 dark:border-purple-700'}`}>
                                  {role}
                                </Badge>
                              )}
                              {isPlusUser && (
                                <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 text-xs">
                                  <Crown className="h-3 w-3 mr-1" />
                                  Plus
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {isPureAdmin ? (
                          <div className="grid grid-cols-2 gap-2">
                            <Button 
                              variant="default" 
                              size="sm" 
                              className="rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white" 
                              onClick={() => {
                                router.push("/admin")
                                setMobileOpen(false)
                              }}
                            >
                              <Shield className="h-4 w-4 mr-2" />
                              Admin Panel
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="rounded-xl border-red-300 dark:border-red-700 hover:bg-red-100 dark:hover:bg-red-900/30"
                              onClick={() => {
                                router.push("/")
                                setMobileOpen(false)
                              }}
                            >
                              <Home className="h-4 w-4 mr-2" />
                              Home
                            </Button>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="rounded-xl border-purple-300 dark:border-purple-700 hover:bg-purple-100 dark:hover:bg-purple-900/30" 
                              onClick={() => {
                                router.push(dashboardHref)
                                setMobileOpen(false)
                              }}
                            >
                              <Home className="h-4 w-4 mr-2" />
                              Dashboard
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="rounded-xl border-purple-300 dark:border-purple-700 hover:bg-purple-100 dark:hover:bg-purple-900/30"
                              onClick={() => {
                                router.push(secondaryAction.href)
                                setMobileOpen(false)
                              }}
                            >
                              <SecondaryActionIcon className="h-4 w-4 mr-2" />
                              {secondaryAction.label}
                            </Button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Navigation Items */}
                    <div className="grid gap-3">
                      {navData.main.map((item) => (
                        <div key={item.title} className="space-y-2">
                          <div 
                            className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-white to-purple-50 dark:from-neutral-900 dark:to-purple-950/20 border-2 border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 transition-all cursor-pointer"
                            onClick={() => {
                              router.push(item.href)
                              setMobileOpen(false)
                            }}
                          >
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
                              <item.icon className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-sm">{item.title}</h3>
                              <p className="text-xs text-muted-foreground">{item.description}</p>
                            </div>
                          </div>
                          
                          <div className="grid gap-1 ml-4">
                            {item.items.slice(0, 2).map((subItem) => (
                              <button
                                key={subItem.title}
                                className="text-left p-2 text-sm text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-all"
                                onClick={() => {
                                  router.push(subItem.href)
                                  setMobileOpen(false)
                                }}
                              >
                                {subItem.title}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Auth Actions */}
                    {!isAuthenticated ? (
                      <div className="grid grid-cols-2 gap-3 pt-4 border-t">
                        <Button 
                          variant="outline" 
                          className="rounded-xl border-purple-300 dark:border-purple-700"
                          onClick={() => {
                            router.push("/signup")
                            setMobileOpen(false)
                          }}
                        >
                          Sign up
                        </Button>
                        <Button
                          className="rounded-xl bg-linear-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 text-white border-0"
                          onClick={() => {
                            router.push("/signin")
                            setMobileOpen(false)
                          }}
                        >
                          Sign in
                        </Button>
                      </div>
                    ) : (
                      <div className="pt-4 border-t">
                        <SignOut />
                      </div>
                    )}
                    
                    {/* Extra bottom padding for mobile browsers */}
                    <div className="h-8 w-full"></div>
                  </div>
                </DrawerContent>
              </Drawer>

              {/* Brand */}
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/ASIA.png"
                  alt="Just Because Asia"
                  width={28}
                  height={28}
                  className="rounded-lg h-12 w-12"
                />
                <span className="font-bold text-sm bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  JBA
                </span>
              </Link>

              {/* Right Actions */}
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/30"
                  onClick={() => setCmdOpen(true)}
                  aria-label="Open search"
                >
                  <Search className="h-4 w-4" />
                </Button>
                
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
        {/* Bottom padding for mobile so content isn't hidden - increased */}
        <div className="h-12 w-full"></div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <div className="fixed top-0 z-10 pt-4 px-4 w-full ">  {/* pt-4 px-4*/}
          <div className="bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border   rounded-full shadow-lg shadow-purple-500/10 max-w-7xl mx-auto">
            <div className="container mx-auto px-6">
              <div className="flex h-16 items-center justify-between">
                {/* Brand */}
                <ContextMenu>
                  <ContextMenuTrigger>
                    <Link href="/" className="flex items-center gap-3 group">
                      <Image
                        src="/ASIA.png"
                        alt="Just Because Asia"
                        width={32}
                        height={32}
                        className="rounded-4xl h-11 w-11 group-hover:shadow-lg group-hover:shadow-purple-500/50 transition-all duration-300"
                      />
                      <div>
                        <span className="font-bold text-lg bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
                          Just Because Asia
                        </span>
                        <p className="text-xs text-muted-foreground -mt-1">Volunteer Platform</p>
                      </div>
                    </Link>
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem onClick={() => router.push("/")}>
                      <Home className="h-4 w-4 mr-2" />
                      Home
                    </ContextMenuItem>
                    <ContextMenuItem onClick={() => router.push("/about")}>
                      <Award className="h-4 w-4 mr-2" />
                      About Us
                    </ContextMenuItem>
                    <ContextMenuSeparator />
                    <ContextMenuItem onClick={() => router.push("/jobs")}>
                      <Briefcase className="h-4 w-4 mr-2" />
                      Browse Jobs
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>

                {/* Main Navigation */}
                <NavigationMenu>
                  <NavigationMenuList>
                    {navData.main.map((item) => (
                      <NavigationMenuItem key={item.title}>
                        <NavigationMenuTrigger className="bg-transparent hover:bg-purple-100 dark:hover:bg-purple-900/30 data-[active]:bg-purple-100 dark:data-[active]:bg-purple-900/30 data-[state=open]:bg-purple-100 dark:data-[state=open]:bg-purple-900/30 rounded-xl">
                          <item.icon className="h-4 w-4 mr-2 text-purple-600" />
                          {item.title}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <div className="grid gap-3 p-6 w-[400px]">
                            <div className="grid gap-1">
                              <h3 className="font-semibold text-lg flex items-center gap-2">
                                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                                  <item.icon className="h-4 w-4 text-white" />
                                </div>
                                {item.title}
                              </h3>
                              <p className="text-sm text-muted-foreground">{item.description}</p>
                            </div>
                            <Separator />
                            <div className="grid gap-2">
                              {item.items.map((subItem) => (
                                <Link
                                  key={subItem.title}
                                  href={subItem.href}
                                  className="group grid gap-1 rounded-lg p-3 hover:bg-purple-50 dark:hover:bg-purple-950/20 border-2 border-transparent hover:border-purple-200 dark:hover:border-purple-800 transition-all"
                                >
                                  <div className="font-medium text-sm group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                    {subItem.title}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {subItem.description}
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    ))}
                  </NavigationMenuList>
                </NavigationMenu>

                {/* Right Actions */}
                <div className="flex items-center gap-3">
                  {/* Search Command */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          className="gap-2 rounded-xl bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:border-purple-400 dark:hover:border-purple-600"
                          onClick={() => setCmdOpen(true)}
                          aria-label="Open search (Cmd+K)"
                        >
                          <CommandIcon className="h-4 w-4 text-purple-600" />
                          <span className="hidden lg:inline">Search...</span>
                          <div className="hidden lg:flex items-center gap-1">
                            <Kbd>⌘</Kbd>
                            <Kbd>K</Kbd>
                          </div>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Search everything <Kbd className="ml-1">⌘K</Kbd></p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <ThemeToggle />

                  {isAuthenticated ? (
                    <div className="flex items-center gap-2">
                      {/* Admin Badge */}
                      {isAdmin && (
                        <Badge className="bg-gradient-to-r from-red-600 to-orange-600 text-white border-0 hidden xl:flex shadow-lg">
                          <Shield className="h-3 w-3 mr-1" />
                          Admin
                        </Badge>
                      )}
                      
                      {/* Plus Badge */}
                      {isPlusUser && !isPureAdmin && (
                        <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 hidden xl:flex shadow-lg">
                          <Crown className="h-3 w-3 mr-1" />
                          Plus
                        </Badge>
                      )}

                      {/* User Menu */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            className={`relative p-1 rounded-xl ${isAdmin ? 'hover:bg-red-100 dark:hover:bg-red-900/30' : 'hover:bg-purple-100 dark:hover:bg-purple-900/30'}`}
                            aria-label="Open user menu"
                          >
                            <Avatar className={`h-8 w-8 ring-2 ${isAdmin ? 'ring-red-400 dark:ring-red-600 hover:ring-red-500 dark:hover:ring-red-500' : 'ring-purple-400 dark:ring-purple-600 hover:ring-purple-500 dark:hover:ring-purple-500'} transition-all`}>
                              <AvatarImage src={user?.avatarUrl} />
                              <AvatarFallback className={`${isAdmin ? 'bg-gradient-to-br from-red-600 to-orange-600' : 'bg-gradient-to-br from-purple-600 to-pink-600'} text-white font-bold`}>
                                {user?.name?.slice(0,2)?.toUpperCase() || "ME"}
                              </AvatarFallback>
                            </Avatar>
                            {isAdmin && (
                              <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-gradient-to-r from-red-600 to-orange-600 border-2 border-background flex items-center justify-center shadow-lg">
                                <Shield className="h-2.5 w-2.5 text-white" />
                              </div>
                            )}
                            {isPlusUser && !isPureAdmin && (
                              <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 border-2 border-background flex items-center justify-center shadow-lg">
                                <Sparkles className="h-2.5 w-2.5 text-white" />
                              </div>
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="min-w-64">
                          <DropdownMenuLabel className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold">{user?.name}</p>
                              <p className="text-xs text-muted-foreground">{user?.email}</p>
                            </div>
                            <div className="flex gap-1">
                              {isAdmin && (
                                <Badge className="bg-gradient-to-r from-red-600 to-orange-600 text-white border-0 text-xs">
                                  <Shield className="h-3 w-3" />
                                </Badge>
                              )}
                              {isPlusUser && !isPureAdmin && (
                                <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 text-xs">
                                  Plus
                                </Badge>
                              )}
                            </div>
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />

                          {isPureAdmin ? (
                            <>
                              <DropdownMenuItem
                                onClick={() => router.push("/admin")}
                                className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20"
                              >
                                <LayoutDashboard className="h-4 w-4 mr-2 text-red-600" />
                                <div className="flex items-center justify-between w-full">
                                  <span className="font-semibold text-red-600 dark:text-red-400">Admin Dashboard</span>
                                  <Kbd>D</Kbd>
                                </div>
                              </DropdownMenuItem>

                              <DropdownMenuItem onClick={() => router.push("/admin/users")}>
                                <Users className="h-4 w-4 mr-2" />
                                All Users
                              </DropdownMenuItem>

                              <DropdownMenuItem onClick={() => router.push("/admin/volunteers")}>
                                <UserCircle className="h-4 w-4 mr-2" />
                                Volunteers
                              </DropdownMenuItem>

                              <DropdownMenuItem onClick={() => router.push("/admin/ngos")}>
                                <Building2 className="h-4 w-4 mr-2" />
                                NGOs
                              </DropdownMenuItem>

                              <DropdownMenuItem onClick={() => router.push("/admin/jobs")}>
                                <Briefcase className="h-4 w-4 mr-2" />
                                Jobs
                              </DropdownMenuItem>

                              <DropdownMenuItem onClick={() => router.push("/admin/billing")}>
                                <DollarSign className="h-4 w-4 mr-2" />
                                Billing
                              </DropdownMenuItem>

                              <DropdownMenuItem onClick={() => router.push("/admin/analytics")}>
                                <BarChart3 className="h-4 w-4 mr-2" />
                                Analytics
                              </DropdownMenuItem>

                              <DropdownMenuItem onClick={() => router.push("/admin/team")}>
                                <Shield className="h-4 w-4 mr-2" />
                                Team
                              </DropdownMenuItem>

                              <DropdownMenuSeparator />
                            </>
                          ) : isAdmin && normalizedRole ? (
                            <>
                              <DropdownMenuItem
                                onClick={() => router.push("/admin")}
                                className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20"
                              >
                                <Shield className="h-4 w-4 mr-2 text-red-600" />
                                <div className="flex items-center justify-between w-full">
                                  <span className="font-semibold text-red-600 dark:text-red-400">Admin Panel</span>
                                </div>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />

                              <DropdownMenuItem onClick={() => router.push(dashboardHref)}>
                                <Home className="h-4 w-4 mr-2" />
                                <div className="flex items-center justify-between w-full">
                                  <span>Dashboard</span>
                                  <Kbd>D</Kbd>
                                </div>
                              </DropdownMenuItem>

                              {profileHref && (
                                <DropdownMenuItem onClick={() => router.push(profileHref)}>
                                  <User className="h-4 w-4 mr-2" />
                                  <div className="flex items-center justify-between w-full">
                                    <span>Profile</span>
                                    <Kbd>P</Kbd>
                                  </div>
                                </DropdownMenuItem>
                              )}

                              {applicationsHref && (
                                <DropdownMenuItem onClick={() => router.push(applicationsHref)}>
                                  <FileText className="h-4 w-4 mr-2" />
                                  Applications
                                </DropdownMenuItem>
                              )}

                              {billingHref && (
                                <DropdownMenuItem onClick={() => router.push(billingHref)}>
                                  <TrendingUp className="h-4 w-4 mr-2" />
                                  <div className="flex items-center justify-between w-full">
                                    <span>Billing</span>
                                    {!isPlusUser && (
                                      <Badge variant="outline" className="text-xs">Free</Badge>
                                    )}
                                  </div>
                                </DropdownMenuItem>
                              )}

                              <DropdownMenuSeparator />
                            </>
                          ) : normalizedRole ? (
                            <>
                              <DropdownMenuItem onClick={() => router.push(dashboardHref)}>
                                <Home className="h-4 w-4 mr-2" />
                                <div className="flex items-center justify-between w-full">
                                  <span>Dashboard</span>
                                  <Kbd>D</Kbd>
                                </div>
                              </DropdownMenuItem>

                              {profileHref && (
                                <DropdownMenuItem onClick={() => router.push(profileHref)}>
                                  <User className="h-4 w-4 mr-2" />
                                  <div className="flex items-center justify-between w-full">
                                    <span>Profile</span>
                                    <Kbd>P</Kbd>
                                  </div>
                                </DropdownMenuItem>
                              )}

                              {applicationsHref && (
                                <DropdownMenuItem onClick={() => router.push(applicationsHref)}>
                                  <FileText className="h-4 w-4 mr-2" />
                                  Applications
                                </DropdownMenuItem>
                              )}

                              {billingHref && (
                                <DropdownMenuItem onClick={() => router.push(billingHref)}>
                                  <TrendingUp className="h-4 w-4 mr-2" />
                                  <div className="flex items-center justify-between w-full">
                                    <span>Billing</span>
                                    {!isPlusUser && (
                                      <Badge variant="outline" className="text-xs">Free</Badge>
                                    )}
                                  </div>
                                </DropdownMenuItem>
                              )}

                              <DropdownMenuSeparator />
                            </>
                          ) : null}

                          <DropdownMenuItem
                            onClick={() => router.push(
                              isPureAdmin ? "/admin/settings" : normalizedRole ? `/${normalizedRole}/settings` : "/settings"
                            )}
                          >
                            <Settings className="h-4 w-4 mr-2" />
                            Settings
                          </DropdownMenuItem>

                          <DropdownMenuItem onClick={() => router.push("/help")}>
                            <HelpCircle className="h-4 w-4 mr-2" />
                            Help Center
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          <DropdownMenuItem className="text-destructive focus:text-destructive">
                            <LogOut className="h-4 w-4 mr-2" />
                            <SignOut />
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        className="rounded-xl border-purple-300 dark:border-purple-700"
                        onClick={() => router.push("/signup")}
                      >
                        Sign up
                      </Button>
                      <Button
                        className="rounded-xl bg-linear-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 text-white shadow-lg"
                        onClick={() => router.push("/signin")}
                      >
                        Sign in
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Universal Command Palette */}
      <CommandDialog open={cmdOpen} onOpenChange={setCmdOpen}>
        <CommandInput placeholder="Search everything... jobs, NGOs, people, actions" />
        <CommandList>
          <CommandEmpty>
            <div className="text-center py-6">
              <Search className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-lg font-semibold">No results found</p>
              <p className="text-sm text-muted-foreground">Try a different search term</p>
            </div>
          </CommandEmpty>
          
          {isAuthenticated && (
            <CommandGroup heading="Quick Actions">
              {navData.quickActions
                .filter((action) => {
                  if (action.title === "Profile" && !profileHref) return false
                  if (action.title === "Applications" && applicationsHref === null) return false
                  return true
                })
                .map((action) => (
                  <CommandItem
                    key={action.title}
                    onSelect={() => {
                      if (action.title === "Dashboard") router.push(dashboardHref)
                      else if (action.title === "Profile" && profileHref) router.push(profileHref)
                      else if (action.title === "Applications" && applicationsHref) router.push(applicationsHref)
                      else if (action.title === "Settings") router.push(
                        isPureAdmin ? "/admin/settings" : normalizedRole ? `/${normalizedRole}/settings` : "/settings"
                      )
                      setCmdOpen(false)
                    }}
                  >
                    <action.icon className="mr-2 h-4 w-4" />
                    <span className="flex-1">{action.title}</span>
                    <Kbd>{action.shortcut}</Kbd>
                  </CommandItem>
                ))}
            </CommandGroup>
          )}
          
          <CommandGroup heading="Navigation">
            {navData.main.map((item) => (
              <CommandItem
                key={item.href}
                onSelect={() => {
                  router.push(item.href)
                  setCmdOpen(false)
                }}
              >
                <item.icon className="mr-2 h-4 w-4" />
                <span className="flex-1">{item.title}</span>
                <span className="text-xs text-muted-foreground">{item.description}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          
          <CommandGroup heading="Popular">
            <CommandItem onSelect={() => { router.push("/jobs"); setCmdOpen(false) }}>
              <Briefcase className="mr-2 h-4 w-4" />
              Browse All Jobs
            </CommandItem>
            <CommandItem onSelect={() => { router.push("/ngos/post"); setCmdOpen(false) }}>
              <Plus className="mr-2 h-4 w-4" />
              Post a Job
            </CommandItem>
            <CommandItem onSelect={() => { router.push("/volunteers"); setCmdOpen(false) }}>
              <Users className="mr-2 h-4 w-4" />
              Find Volunteers
            </CommandItem>
          </CommandGroup>
          
          <CommandGroup heading="Resources">
            <CommandItem onSelect={() => { router.push("/help"); setCmdOpen(false) }}>
              <HelpCircle className="mr-2 h-4 w-4" />
              Help Center
            </CommandItem>
            <CommandItem onSelect={() => { router.push("/blog"); setCmdOpen(false) }}>
              <FileText className="mr-2 h-4 w-4" />
              Blog & Insights
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
