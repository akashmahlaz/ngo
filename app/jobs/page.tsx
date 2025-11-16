"use client"

import { useState, useEffect, useMemo } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { JobCard } from "@/components/job-card"
import { 
  Search, 
  MapPin, 
  Filter,
  X,
  Grid,
  List,
  CheckCircle,
  Briefcase,
  Loader2
} from "lucide-react"
import { JobDoc } from "@/lib/models"

type EnrichedJob = {
  _id: string
  ngoId: string
  title: string
  description: string
  category?: string
  locationType?: string
  location?: string
  skills?: string[]
  benefits?: string[]
  requirements?: string[]
  applicationCount?: number
  viewCount?: number
  status: string
  createdAt: Date | string
  updatedAt: Date | string
  ngoName?: string
  ngoLogoUrl?: string | null
  ngoVerified?: boolean
  ngoPlan?: string
  compensationType?: string
  salaryRange?: any
  stipendAmount?: number
  commitment?: string
}

// Categories for filtering
const CATEGORIES = [
  "Education",
  "Healthcare",
  "Environment",
  "Animal Welfare",
  "Community Development",
  "Arts & Culture",
  "Disaster Relief",
  "Human Rights",
  "Marketing",
  "Technology",
  "Finance",
  "Legal",
]

// Location types
const LOCATION_TYPES = [
  { id: "onsite", label: "On-site" },
  { id: "remote", label: "Remote" },
  { id: "hybrid", label: "Hybrid" },
]

export default function JobsPage() {
  const { data: session } = useSession()
  const [jobs, setJobs] = useState<JobDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedLocationTypes, setSelectedLocationTypes] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch('/api/jobs?limit=100')
        if (res.ok) {
          const data = await res.json()
          setJobs(data.jobs.map((job: EnrichedJob) => ({
            ...job,
            _id: job._id,
            createdAt: new Date(job.createdAt),
            updatedAt: new Date(job.updatedAt),
          })))
        }
      } catch (error) {
        console.error('Failed to fetch jobs:', error)
        setJobs([])
      } finally {
        setLoading(false)
      }
    }
    
    fetchJobs()
  }, [])

  // Filter and sort jobs
  const filteredJobs = useMemo(() => {
    let result = [...jobs]
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(job => 
        job.title.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        job.category?.toLowerCase().includes(query) ||
        job.skills?.some(skill => skill.toLowerCase().includes(query))
      )
    }
    
    // Apply category filter
    if (selectedCategories.length > 0) {
      result = result.filter(job => 
        job.category && selectedCategories.includes(job.category)
      )
    }
    
    // Apply location type filter
    if (selectedLocationTypes.length > 0) {
      result = result.filter(job => 
        job.locationType && selectedLocationTypes.includes(job.locationType)
      )
    }
    
    // Apply sorting
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        break
      case "applications":
        result.sort((a, b) => (b.applicationCount || 0) - (a.applicationCount || 0))
        break
      case "popular":
        result.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
        break
    }
    
    return result
  }, [jobs, searchQuery, selectedCategories, selectedLocationTypes, sortBy])

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    )
  }

  const toggleLocationType = (type: string) => {
    setSelectedLocationTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type) 
        : [...prev, type]
    )
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedLocationTypes([])
    setSearchQuery("")
  }

  const hasActiveFilters = selectedCategories.length > 0 || selectedLocationTypes.length > 0 || searchQuery

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-white to-neutral-50 dark:from-neutral-950 dark:to-neutral-900">
        {/* Hero Skeleton */}
        <div className="relative overflow-hidden bg-linear-to-br from-purple-600 via-pink-500 to-orange-500">
          <div className="relative container mx-auto px-4 py-16 sm:py-20">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <Skeleton className="h-6 w-48 mx-auto bg-white/30" />
              <Skeleton className="h-14 w-full max-w-2xl mx-auto bg-white/30" />
              <Skeleton className="h-6 w-3/4 mx-auto bg-white/20" />
              <Skeleton className="h-14 w-full max-w-2xl mx-auto bg-white/40" />
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-7 w-24 bg-white/20" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Results Skeleton */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-6 w-40" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
          
          <div className="grid gap-6 lg:grid-cols-4">
            {/* Sidebar Skeleton */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <Skeleton className="h-5 w-24" />
                </CardHeader>
                <CardContent className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 flex-1" />
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Skeleton className="h-5 w-32" />
                </CardHeader>
                <CardContent className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 flex-1" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Jobs Grid Skeleton */}
            <div className="lg:col-span-3 space-y-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <Skeleton className="h-16 w-16 rounded-lg shrink-0" />
                      <div className="flex-1 space-y-3">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-20 w-full" />
                        <div className="flex flex-wrap gap-2">
                          <Skeleton className="h-6 w-20" />
                          <Skeleton className="h-6 w-24" />
                          <Skeleton className="h-6 w-16" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-neutral-50 dark:from-neutral-950 dark:to-neutral-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-linear-to-br from-purple-600 via-pink-500 to-orange-500">
        {/* Decorative blur circles */}
        <div className="absolute -left-20 -top-24 h-72 w-72 rounded-full bg-white/30 blur-3xl opacity-40"></div>
        <div className="absolute -right-20 top-10 h-96 w-96 rounded-full bg-white/20 blur-3xl opacity-40"></div>
        <div className="absolute bottom-[-120px] left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-white/10 blur-[120px] opacity-70"></div>
        
        <div className="relative container mx-auto px-4 py-16 sm:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="outline" className="mb-6 bg-white/20 text-white border-white/30 backdrop-blur-sm">
              <Briefcase className="mr-2 h-3 w-3" />
              {jobs.length}+ Active Opportunities
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white drop-shadow-lg tracking-tight">
              Find Your Next Impact
            </h1>
            <p className="text-lg md:text-xl text-white/90 drop-shadow mb-8 max-w-2xl mx-auto">
              Discover meaningful volunteer opportunities that match your skills and passion
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-600" />
              <Input
                placeholder="Search by title, skills, category, or organization..."
                className="pl-12 pr-4 py-6 text-base bg-white/95 dark:bg-neutral-900/90 text-foreground border-white/40 shadow-2xl backdrop-blur-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Quick Category Badges */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {CATEGORIES.slice(0, 6).map((category) => (
                <Badge
                  key={category}
                  variant="outline"
                  className="cursor-pointer bg-white/20 border-white/40 text-white backdrop-blur-sm hover:bg-white/30 transition-all"
                  onClick={() => toggleCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="container relative z-20 -mt-12 px-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white/80 dark:bg-neutral-900/90 border-white/20 backdrop-blur-xl shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Open Positions</p>
                  <p className="text-3xl font-bold mt-1">{jobs.filter(j => j.status === 'open').length}</p>
                  <p className="text-xs text-muted-foreground mt-1">Ready to apply now</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-neutral-900/90 border-white/20 backdrop-blur-xl shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Categories</p>
                  <p className="text-3xl font-bold mt-1">{CATEGORIES.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">Different impact areas</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-pink-500/20 flex items-center justify-center">
                  <Grid className="h-6 w-6 text-pink-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-neutral-900/90 border-white/20 backdrop-blur-xl shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Remote Options</p>
                  <p className="text-3xl font-bold mt-1">{jobs.filter(j => j.locationType === 'remote').length}</p>
                  <p className="text-xs text-muted-foreground mt-1">Work from anywhere</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-4">
          <Button 
            variant="outline" 
            className="w-full justify-between"
            onClick={() => setShowFilters(!showFilters)}
          >
            <span className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <Badge variant="destructive" className="ml-2 px-1.5 py-0.5 text-xs">
                  {selectedCategories.length + selectedLocationTypes.length}
                </Badge>
              )}
            </span>
            {showFilters ? <X className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filter Sidebar */}
          <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <Card className="sticky top-4 bg-white/80 dark:bg-neutral-900/90 border-neutral-200 dark:border-neutral-800 shadow-lg">
              <CardHeader className="pb-3 sm:pb-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Filter className="h-4 w-4" />
                    Filters
                  </CardTitle>
                  {hasActiveFilters && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={clearFilters}
                      className="text-xs h-7 sm:h-8"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Clear
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                {/* Categories */}
                <div>
                  <h3 className="font-medium mb-2 sm:mb-3 text-sm">Categories</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {CATEGORIES.map((category) => (
                      <div key={category} className="flex items-center">
                        <Checkbox
                          id={`category-${category}`}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={() => toggleCategory(category)}
                        />
                        <Label
                          htmlFor={`category-${category}`}
                          className="ml-2 text-xs sm:text-sm font-normal cursor-pointer"
                        >
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Location Type */}
                <div>
                  <h3 className="font-medium mb-2 sm:mb-3 text-sm">Location Type</h3>
                  <div className="space-y-2">
                    {LOCATION_TYPES.map((type) => (
                      <div key={type.id} className="flex items-center">
                        <Checkbox
                          id={`location-${type.id}`}
                          checked={selectedLocationTypes.includes(type.id)}
                          onCheckedChange={() => toggleLocationType(type.id)}
                        />
                        <Label
                          htmlFor={`location-${type.id}`}
                          className="ml-2 text-xs sm:text-sm font-normal cursor-pointer"
                        >
                          {type.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Job Listings */}
          <div className="lg:col-span-3">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between mb-4 sm:mb-6">
              <div className="flex-1">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Showing <span className="font-semibold text-foreground">{filteredJobs.length}</span> of <span className="font-semibold text-foreground">{jobs.length}</span> opportunities
                </p>
              </div>
              <div className="flex gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="applications">Most Applications</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="shrink-0"
                  onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                >
                  {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Empty State */}
            {filteredJobs.length === 0 ? (
              <Card className="bg-white/80 dark:bg-neutral-900/90">
                <CardContent className="py-12 sm:py-16 text-center px-4">
                  <Search className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">No opportunities found</h3>
                  <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 max-w-md mx-auto">
                    {hasActiveFilters 
                      ? "Try adjusting your search or filters to find more opportunities"
                      : "No volunteer opportunities are currently available"}
                  </p>
                  {hasActiveFilters && (
                    <Button onClick={clearFilters}>Clear All Filters</Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              // Job Listings
              <div className={viewMode === "grid" 
                ? "grid grid-cols-1 md:grid-cols-2 gap-6" 
                : "space-y-4"
              }>
                {filteredJobs.map((job) => {
                  const enrichedJob = job as unknown as EnrichedJob
                  return (
                    <JobCard 
                      key={job._id.toString()}
                      job={{
                        _id: job._id.toString(),
                        title: job.title,
                        description: job.description,
                        category: job.category,
                        location: job.location,
                        locationType: job.locationType,
                        createdAt: new Date(job.createdAt),
                        skills: job.skills,
                        compensationType: job.compensationType,
                        salaryRange: job.salaryRange,
                        stipendAmount: job.stipendAmount,
                        commitment: job.commitment,
                        applicationCount: job.applicationCount
                      }}
                      ngo={{
                        name: enrichedJob.ngoName || "Unknown NGO",
                        logoUrl: enrichedJob.ngoLogoUrl,
                        verified: enrichedJob.ngoVerified,
                        plan: enrichedJob.ngoPlan
                      }}
                      viewMode={viewMode}
                    />
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
