"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ImageUploader } from "@/components/upload/image-uploader"
import { 
  Save, Plus, X, Building2, Globe, MapPin, Phone, Users, CheckCircle, 
  Edit, Mail, ExternalLink, Calendar, Target, TrendingUp, Award,
  Linkedin, Twitter, Facebook, Instagram, Upload, Image as ImageIcon
} from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

export default function NgoProfile() {
  const { data: session, update } = useSession()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [profile, setProfile] = useState({
    orgName: "",
    bio: "",
    description: "",
    website: "",
    orgType: "",
    registrationNumber: "",
    yearEstablished: "",
    phone: "",
    address: "",
    focusAreas: [] as string[],
    teamSize: "",
    verified: false,
    impactStats: {
      volunteersHelped: 0,
      projectsCompleted: 0,
      peopleImpacted: 0,
    },
    socialLinks: {
      linkedin: "",
      twitter: "",
      facebook: "",
      instagram: "",
    },
  })
  const [newFocusArea, setNewFocusArea] = useState("")

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/profile")
        if (res.ok) {
          const data = await res.json()
          setProfile({
            orgName: data.orgName || "",
            bio: data.bio || "",
            description: data.description || "",
            website: data.website || "",
            orgType: data.orgType || "",
            registrationNumber: data.registrationNumber || "",
            yearEstablished: data.yearEstablished || "",
            phone: data.phone || "",
            address: data.address || "",
            focusAreas: data.focusAreas || [],
            teamSize: data.teamSize || "",
            verified: data.verified || false,
            impactStats: {
              volunteersHelped: data.impactStats?.volunteersHelped || 0,
              projectsCompleted: data.impactStats?.projectsCompleted || 0,
              peopleImpacted: data.impactStats?.peopleImpacted || 0,
            },
            socialLinks: data.socialLinks || {
              linkedin: "",
              twitter: "",
              facebook: "",
              instagram: "",
            },
          })
        }
      } catch (error) {
        console.error("Error loading profile:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  async function handleImageUpload(file: File, type: "logo" | "cover"): Promise<string> {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("type", type)
    
    const endpoint = type === "logo" ? "/api/profile/avatar" : "/api/profile/cover"
    const res = await fetch(endpoint, {
      method: "POST",
      body: formData,
    })
    
    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.error || "Failed to upload image")
    }
    
    const data = await res.json()
    await update() // Update session
    return type === "logo" ? data.avatarUrl : data.coverPhotoUrl
  }

  async function handleImageRemove(type: "logo" | "cover") {
    try {
      const endpoint = type === "logo" ? "/api/profile/avatar" : "/api/profile/cover"
      await fetch(endpoint, { method: "DELETE" })
      await update() // Update session
    } catch (error) {
      console.error("Error removing image:", error)
    }
  }

  async function saveProfile() {
    setSaving(true)
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      })
      if (!res.ok) throw new Error("Failed to save")
      toast.success("Profile updated successfully")
      await update() // Update session
      setIsEditMode(false) // Switch back to view mode
    } catch (e: any) {
      toast.error(e.message || "Failed to save profile")
    } finally {
      setSaving(false)
    }
  }

  function addFocusArea() {
    if (newFocusArea.trim() && !profile.focusAreas.includes(newFocusArea.trim())) {
      setProfile(prev => ({ ...prev, focusAreas: [...prev.focusAreas, newFocusArea.trim()] }))
      setNewFocusArea("")
    }
  }

  function removeFocusArea(area: string) {
    setProfile(prev => ({ ...prev, focusAreas: prev.focusAreas.filter(a => a !== area) }))
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-6">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-9 w-48" />
              <Skeleton className="h-4 w-96" />
            </div>
            <Skeleton className="h-10 w-28" />
          </div>

          {/* Cover Photo Skeleton */}
          <Skeleton className="h-48 w-full rounded-xl" />

          {/* Main Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Sidebar Skeleton */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-20 w-20 rounded-lg" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Skeleton className="h-5 w-28" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            </div>

            {/* Content Skeleton */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-5 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-24 w-full" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Skeleton className="h-5 w-24" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!session?.user) return null

  const user = session.user as any
  const coverPhotoUrl = user.coverPhotoUrl
  const logoUrl = user.avatarUrl
  const currentYear = new Date().getFullYear()
  const yearsActive = profile.yearEstablished 
    ? currentYear - parseInt(profile.yearEstablished)
    : 0

  // VIEW MODE - Beautiful Profile Display
  if (!isEditMode) {
    return (
      <div className="min-h-screen bg-linear-to-b from-background to-muted/20">
        {/* Cover Photo Section */}
        <div className="relative h-80 bg-linear-to-br from-primary/90 via-primary to-primary/80 overflow-hidden">
          {coverPhotoUrl ? (
            <div className="absolute inset-0">
              <img 
                src={coverPhotoUrl} 
                alt="Cover" 
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="absolute inset-0 bg-linear-to-br from-primary/90 via-primary to-primary/80">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
              </div>
            </div>
          )}
          
          {/* Edit Button - Top Right */}
          <div className="absolute top-6 right-6 z-10">
            <Button 
              onClick={() => setIsEditMode(true)}
              className="bg-background text-foreground hover:bg-background/90 shadow-lg"
              size="lg"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Profile Content */}
        <div className="container mx-auto px-4 -mt-32 pb-12 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Logo + Name Card */}
            <Card className="mb-8 shadow-2xl">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  {/* Logo */}
                  <div className="relative -mt-20">
                    <Avatar className="h-40 w-40 border-8 border-background shadow-2xl">
                      <AvatarImage src={logoUrl} alt={profile.orgName} />
                      <AvatarFallback className="bg-linear-to-br from-primary via-primary/80 to-primary/60 text-white text-5xl font-bold">
                        {profile.orgName?.charAt(0).toUpperCase() || "N"}
                      </AvatarFallback>
                    </Avatar>
                    {profile.verified && (
                      <div className="absolute -bottom-2 -right-2 bg-blue-600 rounded-full p-2 shadow-lg">
                        <CheckCircle className="h-6 w-6 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Name and Quick Info */}
                  <div className="flex-1 pt-0 md:pt-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h1 className="text-4xl font-bold mb-2">
                          {profile.orgName || "Organization Name Not Set"}
                        </h1>
                        <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
                          {profile.orgType && (
                            <Badge variant="secondary" className="text-sm">
                              {profile.orgType}
                            </Badge>
                          )}
                          {profile.yearEstablished && (
                            <div className="flex items-center gap-1 text-sm">
                              <Calendar className="h-4 w-4" />
                              <span>Est. {profile.yearEstablished}</span>
                            </div>
                          )}
                          {profile.teamSize && (
                            <div className="flex items-center gap-1 text-sm">
                              <Users className="h-4 w-4" />
                              <span>{profile.teamSize}</span>
                            </div>
                          )}
                          {profile.address && (
                            <div className="flex items-center gap-1 text-sm">
                              <MapPin className="h-4 w-4" />
                              <span>{profile.address.split(',')[0]}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Focus Areas */}
                    {profile.focusAreas.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {profile.focusAreas.map((area, index) => (
                          <Badge key={index} variant="outline" className="text-sm">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Impact Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Volunteers Helped */}
              <Card className="border-2 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Volunteers Helped</p>
                      <p className="text-4xl font-bold text-primary">
                        {profile.impactStats.volunteersHelped.toLocaleString()}
                      </p>
                    </div>
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Projects Completed */}
              <Card className="border-2 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Projects Completed</p>
                      <p className="text-4xl font-bold text-green-600">
                        {profile.impactStats.projectsCompleted.toLocaleString()}
                      </p>
                    </div>
                    <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <Target className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* People Impacted */}
              <Card className="border-2 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">People Impacted</p>
                      <p className="text-4xl font-bold text-amber-600">
                        {profile.impactStats.peopleImpacted.toLocaleString()}
                      </p>
                    </div>
                    <div className="h-16 w-16 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                      <TrendingUp className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Mission Statement */}
                {profile.bio && (
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-2xl">Mission Statement</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        {profile.bio}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* About / Description */}
                {profile.description && (
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-2xl">About Us</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {profile.description}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Years Active Badge */}
                {yearsActive > 0 && (
                  <Card className="shadow-lg bg-linear-to-br from-primary/5 to-primary/10 border-primary/20">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                          <Award className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                          <p className="text-3xl font-bold">{yearsActive} Years</p>
                          <p className="text-muted-foreground">Making a Difference</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Contact Information */}
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {user.email && (
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Mail className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground">Email</p>
                          <a href={`mailto:${user.email}`} className="text-sm font-medium hover:text-primary break-all">
                            {user.email}
                          </a>
                        </div>
                      </div>
                    )}

                    {profile.phone && (
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                          <Phone className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground">Phone</p>
                          <a href={`tel:${profile.phone}`} className="text-sm font-medium hover:text-primary">
                            {profile.phone}
                          </a>
                        </div>
                      </div>
                    )}

                    {profile.website && (
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                          <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground">Website</p>
                          <a 
                            href={profile.website} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-sm font-medium hover:text-primary flex items-center gap-1 break-all"
                          >
                            {profile.website.replace(/^https?:\/\//, '')}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    )}

                    {profile.address && (
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center shrink-0">
                          <MapPin className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground">Address</p>
                          <p className="text-sm font-medium">{profile.address}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Social Media */}
                {(profile.socialLinks.linkedin || profile.socialLinks.twitter || 
                  profile.socialLinks.facebook || profile.socialLinks.instagram) && (
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle>Connect With Us</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {profile.socialLinks.linkedin && (
                        <Button variant="outline" className="w-full justify-start" asChild>
                          <Link href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                            <Linkedin className="h-4 w-4 mr-2 text-blue-600" />
                            LinkedIn
                          </Link>
                        </Button>
                      )}
                      {profile.socialLinks.twitter && (
                        <Button variant="outline" className="w-full justify-start" asChild>
                          <Link href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                            <Twitter className="h-4 w-4 mr-2 text-blue-400" />
                            Twitter
                          </Link>
                        </Button>
                      )}
                      {profile.socialLinks.facebook && (
                        <Button variant="outline" className="w-full justify-start" asChild>
                          <Link href={profile.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                            <Facebook className="h-4 w-4 mr-2 text-blue-600" />
                            Facebook
                          </Link>
                        </Button>
                      )}
                      {profile.socialLinks.instagram && (
                        <Button variant="outline" className="w-full justify-start" asChild>
                          <Link href={profile.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                            <Instagram className="h-4 w-4 mr-2 text-pink-600" />
                            Instagram
                          </Link>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Registration Info */}
                {profile.registrationNumber && (
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle>Organization Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Registration Number</p>
                        <p className="text-sm font-medium font-mono">{profile.registrationNumber}</p>
                      </div>
                      {profile.verified && (
                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm font-medium">Verified Organization</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // EDIT MODE - Form View
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Edit Organization Profile</h1>
          <p className="text-muted-foreground">Update your NGO profile information</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsEditMode(false)}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          {profile.verified && (
            <Badge variant="default" className="flex items-center gap-1 py-2 px-3">
              <CheckCircle className="h-3 w-3" />
              Verified Organization
            </Badge>
          )}
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Logo & Cover Upload */}
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Organization Logo</h2>
            <ImageUploader
              currentImage={(session.user as any).avatarUrl}
              onUpload={(file) => handleImageUpload(file, "logo")}
              onRemove={() => handleImageRemove("logo")}
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Cover Photo</h2>
            <ImageUploader
              currentImage={(session.user as any).coverPhotoUrl}
              onUpload={(file) => handleImageUpload(file, "cover")}
              onRemove={() => handleImageRemove("cover")}
              aspectRatio="video"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Recommended: 1200x400px banner image
            </p>
          </div>
        </div>

        {/* Organization Information */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Organization Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="orgName">Organization Name</Label>
                <Input
                  id="orgName"
                  value={profile.orgName}
                  onChange={(e) => setProfile(prev => ({ ...prev, orgName: e.target.value }))}
                  placeholder="Your organization name"
                />
              </div>
              
              <div>
                <Label htmlFor="bio">Mission Statement</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Describe your organization's mission and impact"
                  rows={4}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {profile.bio.length}/500 characters
                </p>
              </div>

              <div>
                <Label htmlFor="description">About / Detailed Description</Label>
                <Textarea
                  id="description"
                  value={profile.description}
                  onChange={(e) => setProfile(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Provide a detailed description of your organization, its history, and goals"
                  rows={6}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {profile.description.length}/2000 characters
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="orgType">Organization Type</Label>
                  <Select value={profile.orgType} onValueChange={(value) => setProfile(prev => ({ ...prev, orgType: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="non-profit">Non-Profit</SelectItem>
                      <SelectItem value="charity">Charity</SelectItem>
                      <SelectItem value="foundation">Foundation</SelectItem>
                      <SelectItem value="ngo">NGO</SelectItem>
                      <SelectItem value="social-enterprise">Social Enterprise</SelectItem>
                      <SelectItem value="community-group">Community Group</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="yearEstablished">Year Established</Label>
                  <Input
                    id="yearEstablished"
                    type="number"
                    min="1800"
                    max={currentYear}
                    value={profile.yearEstablished}
                    onChange={(e) => setProfile(prev => ({ ...prev, yearEstablished: e.target.value }))}
                    placeholder={`e.g., ${currentYear - 10}`}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="registrationNumber">Registration Number</Label>
                  <Input
                    id="registrationNumber"
                    value={profile.registrationNumber}
                    onChange={(e) => setProfile(prev => ({ ...prev, registrationNumber: e.target.value }))}
                    placeholder="Official registration number"
                  />
                </div>
                <div>
                  <Label htmlFor="teamSize">Team Size</Label>
                  <Select value={profile.teamSize} onValueChange={(value) => setProfile(prev => ({ ...prev, teamSize: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select team size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-5">1-5 people</SelectItem>
                      <SelectItem value="6-20">6-20 people</SelectItem>
                      <SelectItem value="21-50">21-50 people</SelectItem>
                      <SelectItem value="51-100">51-100 people</SelectItem>
                      <SelectItem value="100+">100+ people</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Impact Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Impact Statistics
              </CardTitle>
              <CardDescription>
                Share your organization's achievements and impact
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="volunteersHelped">Volunteers Helped</Label>
                  <Input
                    id="volunteersHelped"
                    type="number"
                    min="0"
                    value={profile.impactStats.volunteersHelped}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      impactStats: { ...prev.impactStats, volunteersHelped: parseInt(e.target.value) || 0 }
                    }))}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="projectsCompleted">Projects Completed</Label>
                  <Input
                    id="projectsCompleted"
                    type="number"
                    min="0"
                    value={profile.impactStats.projectsCompleted}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      impactStats: { ...prev.impactStats, projectsCompleted: parseInt(e.target.value) || 0 }
                    }))}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="peopleImpacted">People Impacted</Label>
                  <Input
                    id="peopleImpacted"
                    type="number"
                    min="0"
                    value={profile.impactStats.peopleImpacted}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      impactStats: { ...prev.impactStats, peopleImpacted: parseInt(e.target.value) || 0 }
                    }))}
                    placeholder="0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="website" className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Website
                  </Label>
                  <Input
                    id="website"
                    value={profile.website}
                    onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="https://yourorganization.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Address
                </Label>
                <Textarea
                  id="address"
                  value={profile.address}
                  onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Street address, city, state, country"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Focus Areas */}
          <Card>
            <CardHeader>
              <CardTitle>Focus Areas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newFocusArea}
                  onChange={(e) => setNewFocusArea(e.target.value)}
                  placeholder="Add a focus area (e.g., Education, Healthcare, Environment)"
                  onKeyPress={(e) => e.key === "Enter" && addFocusArea()}
                />
                <Button onClick={addFocusArea} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {profile.focusAreas.map((area, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {area}
                    <button onClick={() => removeFocusArea(area)} className="hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Social Media */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Social Media
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={profile.socialLinks.linkedin}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      socialLinks: { ...prev.socialLinks, linkedin: e.target.value }
                    }))}
                    placeholder="https://linkedin.com/company/organization"
                  />
                </div>
                <div>
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    value={profile.socialLinks.twitter}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      socialLinks: { ...prev.socialLinks, twitter: e.target.value }
                    }))}
                    placeholder="https://twitter.com/organization"
                  />
                </div>
                <div>
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    value={profile.socialLinks.facebook}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      socialLinks: { ...prev.socialLinks, facebook: e.target.value }
                    }))}
                    placeholder="https://facebook.com/organization"
                  />
                </div>
                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={profile.socialLinks.instagram}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      socialLinks: { ...prev.socialLinks, instagram: e.target.value }
                    }))}
                    placeholder="https://instagram.com/organization"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button onClick={saveProfile} disabled={saving} size="lg">
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  )
}