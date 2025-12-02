"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { 
  MapPin, 
  Clock, 
  Award,
  Briefcase,
  DollarSign,
  Mail,
  CheckCircle,
  Star,
  TrendingUp,
  Zap,
  Target,
  MessageCircle,
  ArrowRight,
  CircleDot,
  Trophy
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

type VolunteerCardProps = {
  volunteer: {
    _id: string
    name: string
    email?: string
    title?: string
    bio?: string
    location?: string
    skills?: string[]
    avatarUrl?: string
    verified?: boolean
    experience?: any[]
    // Salary/earnings fields
    expectedSalary?: string
    hourlyRate?: number
    ngoHourlyRate?: number
    availability?: "full-time" | "part-time" | "flexible" | "weekends"
    totalEarnings?: number
    hoursWorked?: number
    // Performance fields
    successRate?: number
    responseTime?: string
    currentWorkStatus?: string
    completedProjects?: number
    activeProjects?: number
    rating?: number
  }
  viewMode?: "grid" | "list"
}

export function VolunteerCard({ volunteer, viewMode = "grid" }: VolunteerCardProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  
  const getAvailabilityColor = (availability?: string) => {
    switch (availability) {
      case "full-time": return "bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800"
      case "part-time": return "bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800"
      case "flexible": return "bg-purple-100 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800"
      case "weekends": return "bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800"
      default: return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
    }
  }

  const getWorkStatusColor = (status?: string) => {
    if (!status) return "text-gray-500"
    if (status.toLowerCase().includes("available")) return "text-green-600 dark:text-green-400"
    if (status.toLowerCase().includes("busy")) return "text-amber-600 dark:text-amber-400"
    return "text-red-600 dark:text-red-400"
  }

  const getSuccessRateColor = (rate?: number) => {
    if (!rate) return "text-gray-500"
    if (rate >= 90) return "text-green-600"
    if (rate >= 75) return "text-blue-600"
    if (rate >= 60) return "text-amber-600"
    return "text-red-600"
  }

  // Grid View - Creative Card Design
  if (viewMode === "grid") {
    return (
      <Card className="impact-card card-hover-lift border-2 hover:border-primary/50 bg-linear-to-br from-background via-background to-primary/5">
        {/* Decorative corner accent */}
        <div className="gradient-overlay absolute top-0 right-0 w-32 h-32 rounded-bl-full -mr-16 -mt-16" />
        
        {/* Verified/Top badge */}
        {volunteer.verified && (
          <div className="absolute top-3 left-3 z-10">
            <Badge className="bg-blue-600 text-white border-0 shadow-lg">
              <CheckCircle className="h-3 w-3 mr-1 fill-white" />
              Verified Pro
            </Badge>
          </div>
        )}

        {/* Success Rate Badge */}
        {volunteer.successRate !== undefined && volunteer.successRate >= 80 && (
          <div className="absolute top-3 right-3 z-10">
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0 shadow-lg">
              <Trophy className="h-3 w-3 mr-1" />
              {volunteer.successRate}%
            </Badge>
          </div>
        )}

        <div className="p-6 space-y-4">
          {/* Header: Avatar + Name + Title */}
          <div className="flex items-start gap-4">
            <div className="relative">
              <Avatar className="avatar-ring h-20 w-20 shadow-xl border-2 border-primary/20">
                <AvatarImage src={volunteer.avatarUrl} alt={volunteer.name} />
                <AvatarFallback className="bg-gradient-to-br from-primary via-primary/80 to-primary/60 text-white text-2xl font-bold">
                  {volunteer.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              {/* Online/Status indicator */}
              {volunteer.currentWorkStatus?.toLowerCase().includes("available") && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-background rounded-full animate-pulse" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <Link href={`/volunteers/${volunteer._id}`} className="group/link">
                <h3 className="font-bold text-lg group-hover/link:text-primary transition-colors line-clamp-1">
                  {volunteer.name}
                </h3>
              </Link>
              <p className="text-sm text-muted-foreground font-medium line-clamp-1">
                {volunteer.title || "No title set"}
              </p>
              {volunteer.location && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <MapPin className="h-3 w-3" />
                  <span className="line-clamp-1">{volunteer.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Pricing Section - Eye-Catching */}
          <div className="compensation-box border-l-4 border-primary rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <DollarSign className="h-3.5 w-3.5" />
                  <span>Your Rate</span>
                </div>
                <div className="text-2xl font-bold text-primary">
                  ₹{volunteer.hourlyRate || 0}
                  <span className="text-sm text-muted-foreground">/hr</span>
                </div>
              </div>
              
              {volunteer.ngoHourlyRate && (
                <div className="flex-1 text-right border-l pl-4">
                  <div className="text-xs text-muted-foreground mb-1">NGO Pays</div>
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">
                    ₹{volunteer.ngoHourlyRate}
                    <span className="text-sm">/hr</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stats Row - 3 Column Grid */}
          <div className="grid grid-cols-3 gap-2">
            {/* Success Rate */}
            <div className="stats-card bg-accent/50 rounded-lg p-2 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Target className="h-3 w-3 text-primary" />
              </div>
              <div className={`text-lg font-bold ${getSuccessRateColor(volunteer.successRate)}`}>
                {volunteer.successRate || 0}%
              </div>
              <div className="text-[10px] text-muted-foreground">Success</div>
            </div>

            {/* Response Time */}
            <div className="bg-accent/50 rounded-lg p-2 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Zap className="h-3 w-3 text-amber-500" />
              </div>
              <div className="text-sm font-bold text-foreground line-clamp-1">
                {volunteer.responseTime || "N/A"}
              </div>
              <div className="text-[10px] text-muted-foreground">Response</div>
            </div>

            {/* Rating */}
            <div className="bg-accent/50 rounded-lg p-2 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
              </div>
              <div className="text-lg font-bold text-foreground">
                {volunteer.rating?.toFixed(1) || "N/A"}
              </div>
              <div className="text-[10px] text-muted-foreground">Rating</div>
            </div>
          </div>

          {/* Current Work Status */}
          <div className="flex items-center gap-2 p-2 bg-accent/30 rounded-lg">
            <CircleDot className={`h-4 w-4 ${getWorkStatusColor(volunteer.currentWorkStatus)}`} />
            <span className="text-sm font-medium">{volunteer.currentWorkStatus || "Status not set"}</span>
          </div>

          {/* Projects Info */}
          {(volunteer.completedProjects !== undefined || volunteer.activeProjects !== undefined) && (
            <div className="flex gap-2 text-xs">
              {volunteer.completedProjects !== undefined && (
                <div className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400 rounded-full">
                  <CheckCircle className="h-3 w-3" />
                  <span className="font-medium">{volunteer.completedProjects} completed</span>
                </div>
              )}
              {volunteer.activeProjects !== undefined && volunteer.activeProjects > 0 && (
                <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 rounded-full">
                  <Briefcase className="h-3 w-3" />
                  <span className="font-medium">{volunteer.activeProjects} active</span>
                </div>
              )}
            </div>
          )}

          {/* Skills - Compact */}
          <div className="space-y-1">
            <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Skills</div>
            {volunteer.skills && volunteer.skills.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {volunteer.skills.slice(0, 3).map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-[10px] px-2 py-0.5 font-medium">
                    {skill}
                  </Badge>
                ))}
                {volunteer.skills.length > 3 && (
                  <Badge variant="outline" className="text-[10px] px-2 py-0.5">
                    +{volunteer.skills.length - 3}
                  </Badge>
                )}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">No skills listed</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2 border-t">
            <Button asChild className="flex-1 scale-hover-sm" size="sm">
              <Link href={`/volunteers/${volunteer._id}`}>
                View Profile
                <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="px-3">
              <Mail className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  // List View - Comprehensive Info Layout
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-l-4 border-l-primary/30 hover:border-l-primary overflow-hidden bg-gradient-to-r from-background to-primary/5">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Avatar + Basic Info */}
          <div className="flex items-start gap-4">
            <div className="relative flex-shrink-0">
              <Avatar className="h-24 w-24 ring-4 ring-background shadow-xl border-2 border-primary/20">
                <AvatarImage src={volunteer.avatarUrl} alt={volunteer.name} />
                <AvatarFallback className="bg-gradient-to-br from-primary via-primary/80 to-primary/60 text-white text-2xl font-bold">
                  {volunteer.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              {volunteer.currentWorkStatus?.toLowerCase().includes("available") && (
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 border-4 border-background rounded-full animate-pulse" />
              )}
              
              {volunteer.verified && (
                <div className="absolute -top-2 -right-2">
                  <Badge className="bg-blue-600 text-white border-0 shadow-lg px-1.5 py-0.5">
                    <CheckCircle className="h-3 w-3" />
                  </Badge>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <Link href={`/volunteers/${volunteer._id}`} className="group/link">
                <h3 className="text-2xl font-bold gradient-text group-hover/link:opacity-80 transition-opacity">
                  {volunteer.name}
                </h3>
              </Link>
              <p className="text-base text-muted-foreground font-medium mt-1">
                {volunteer.title || "No title set"}
              </p>
              
              <div className="flex flex-wrap gap-3 mt-2 text-sm">
                {volunteer.location && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{volunteer.location}</span>
                  </div>
                )}
                
                {volunteer.availability && (
                  <Badge variant="outline" className={`capitalize ${getAvailabilityColor(volunteer.availability)}`}>
                    <Clock className="h-3 w-3 mr-1" />
                    {volunteer.availability}
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2 mt-2">
                <CircleDot className={`h-3.5 w-3.5 ${getWorkStatusColor(volunteer.currentWorkStatus)}`} />
                <span className="text-sm font-medium">{volunteer.currentWorkStatus || "Status not set"}</span>
              </div>
            </div>
          </div>

          {/* Center: Performance Metrics */}
          <div className="flex-1 border-l border-border/50 pl-6 space-y-4">
            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-3">
              {/* Success Rate */}
              <div className="text-center p-3 bg-accent/50 rounded-lg">
                <Target className="h-5 w-5 text-primary mx-auto mb-1" />
                <div className={`text-xl font-bold ${getSuccessRateColor(volunteer.successRate)}`}>
                  {volunteer.successRate || 0}%
                </div>
                <div className="text-xs text-muted-foreground">Success</div>
              </div>

              {/* Response Time */}
              <div className="text-center p-3 bg-accent/50 rounded-lg">
                <Zap className="h-5 w-5 text-amber-500 mx-auto mb-1" />
                <div className="text-sm font-bold line-clamp-1">
                  {volunteer.responseTime || "N/A"}
                </div>
                <div className="text-xs text-muted-foreground">Response</div>
              </div>

              {/* Rating */}
              <div className="text-center p-3 bg-accent/50 rounded-lg">
                <Star className="h-5 w-5 text-amber-500 fill-amber-500 mx-auto mb-1" />
                <div className="text-xl font-bold">
                  {volunteer.rating?.toFixed(1) || "N/A"}
                </div>
                <div className="text-xs text-muted-foreground">Rating</div>
              </div>

              {/* Projects */}
              <div className="text-center p-3 bg-accent/50 rounded-lg">
                <Trophy className="h-5 w-5 text-green-600 mx-auto mb-1" />
                <div className="text-xl font-bold">
                  {volunteer.completedProjects || 0}
                </div>
                <div className="text-xs text-muted-foreground">Completed</div>
              </div>
            </div>

            {/* Skills */}
            <div>
              <div className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                <Award className="h-3 w-3" />
                SKILLS
              </div>
              {volunteer.skills && volunteer.skills.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {volunteer.skills.slice(0, 8).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {volunteer.skills.length > 8 && (
                    <Badge variant="outline" className="text-xs">
                      +{volunteer.skills.length - 8} more
                    </Badge>
                  )}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">No skills listed</p>
              )}
            </div>
          </div>

          {/* Right: Pricing & Actions */}
          <div className="flex flex-col justify-between gap-4 min-w-[200px]">
            {/* Pricing Card */}
            <div className="compensation-box border-2 border-primary/20 rounded-xl p-4 space-y-3">
              {/* Volunteer Rate */}
              <div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                  <DollarSign className="h-3 w-3" />
                  Your Rate
                </div>
                <div className="text-3xl font-bold text-primary">
                  ₹{volunteer.hourlyRate || 0}
                  <span className="text-sm text-muted-foreground">/hr</span>
                </div>
              </div>

              {/* NGO Rate */}
              {volunteer.ngoHourlyRate && (
                <div className="border-t border-primary/20 pt-2">
                  <div className="text-xs text-muted-foreground mb-1">NGO Pays</div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    ₹{volunteer.ngoHourlyRate}
                    <span className="text-sm">/hr</span>
                  </div>
                </div>
              )}

              {/* Earnings */}
              {volunteer.totalEarnings !== undefined && volunteer.totalEarnings > 0 && (
                <div className="border-t border-primary/20 pt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Total Earned</span>
                    <span className="font-bold text-green-600">
                      ₹{volunteer.totalEarnings.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Active Projects */}
            {volunteer.activeProjects !== undefined && volunteer.activeProjects > 0 && (
              <div className="bg-blue-100 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                  <Briefcase className="h-4 w-4" />
                  <span className="font-medium text-sm">
                    {volunteer.activeProjects} Active Project{volunteer.activeProjects > 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button asChild className="w-full" size="lg">
                <Link href={`/volunteers/${volunteer._id}`}>
                  View Full Profile
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" className="w-full" size="lg">
                <MessageCircle className="h-4 w-4 mr-2" />
                Contact Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
