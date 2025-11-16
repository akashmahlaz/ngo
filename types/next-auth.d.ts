import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    userId: string
    role: "volunteer" | "ngo" | "admin" | null
    isAdmin: boolean
    adminLevel?: "super" | "moderator" | "support" | null
    plan: "volunteer_free" | "volunteer_plus" | "ngo_base" | "ngo_plus" | null
    planExpiresAt: string | null
    onboardingStep?: "role" | "profile" | "plan" | "completed"
    profileComplete: boolean
    user: {
      id?: string
      name: string | null
      email: string | null
      image: string | null
      avatarUrl?: string | null
      coverPhotoUrl?: string | null
    }
  }

  interface User {
    _id: string
    id: string
    name?: string | null
    email?: string | null
    role?: "volunteer" | "ngo" | "admin" | null
    plan?: "volunteer_free" | "volunteer_plus" | "ngo_base" | "ngo_plus" | null
    planExpiresAt?: string | null  // Changed from Date to string
    onboardingStep?: "role" | "profile" | "plan" | "completed" | null
    isAdmin?: boolean
    adminLevel?: "super" | "moderator" | "support" | null
    avatarUrl?: string
    coverPhotoUrl?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string
    role: "volunteer" | "ngo" | "admin" | null
    plan: "volunteer_free" | "volunteer_plus" | "ngo_base" | "ngo_plus" | null
    planExpiresAt?: string
    onboardingStep: "role" | "profile" | "plan" | "completed" | null
    profileComplete: boolean
    isAdmin: boolean
    adminLevel?: "super" | "moderator" | "support" | null
    avatarUrl?: string
    coverPhotoUrl?: string
    emailVerified?: string | null
  }
}