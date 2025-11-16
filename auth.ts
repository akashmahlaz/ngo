import NextAuth from "next-auth"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import client from "@/lib/db"
import Google from "next-auth/providers/google"
import Facebook from "next-auth/providers/facebook"
import Apple from "next-auth/providers/apple"
import Twitter from "next-auth/providers/twitter"
import GitHub from "next-auth/providers/github"
import LinkedIn from "next-auth/providers/linkedin"
import Instagram from "next-auth/providers/instagram"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"
import { compare } from "bcryptjs"
import type { Adapter } from "next-auth/adapters"

type AppUser = {
  _id: string
  name?: string | null
  email?: string | null
  passwordHash?: string | null
  role?: "volunteer" | "ngo" | "admin"
  isAdmin?: boolean
  adminLevel?: "super" | "moderator" | "support" | null
  plan?: "volunteer_free" | "volunteer_plus" | "ngo_base" | "ngo_plus" | null
  planExpiresAt?: Date | null
  onboardingStep?: "role" | "profile" | "plan" | "completed" | null
  emailVerified?: Date | null
  image?: string | null
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(client) as Adapter,
  session: { 
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/signin",
    error: "/signin",
    verifyRequest: "/signin",
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
    Facebook({
      clientId: process.env.AUTH_FACEBOOK_ID!,
      clientSecret: process.env.AUTH_FACEBOOK_SECRET!,
    }),
    LinkedIn({
      clientId: process.env.AUTH_LINKEDIN_ID!,
      clientSecret: process.env.AUTH_LINKEDIN_SECRET!,
    }),
    Instagram({
      clientId: process.env.AUTH_INSTAGRAM_ID!,
      clientSecret: process.env.AUTH_INSTAGRAM_SECRET!,
    }),
    Twitter({
      clientId: process.env.AUTH_TWITTER_ID!,
      clientSecret: process.env.AUTH_TWITTER_SECRET!,
    }),
    Apple({
      clientId: process.env.AUTH_APPLE_ID!,
      clientSecret: process.env.AUTH_APPLE_SECRET!,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (raw) => {
        try {
          const schema = z.object({ 
            email: z.string().email(), 
            password: z.string().min(12, "Password must be at least 12 characters")
          })
          const parsed = schema.safeParse(raw)
          if (!parsed.success) return null

          await client.connect()
          const db = client.db()
          const users = db.collection<AppUser>("users")
          const user = await users.findOne({ email: parsed.data.email })
          if (!user || !user.passwordHash) return null
          
          const ok = await compare(parsed.data.password, user.passwordHash)
          if (!ok) return null

          return {
            _id: user._id.toString(),
            id: user._id.toString(),
            name: user.name ?? null,
            email: user.email ?? null,
            role: user.role ?? null,
            plan: user.plan ?? null,
            planExpiresAt: user.planExpiresAt?.toISOString() ?? null,
            onboardingStep: user.onboardingStep ?? null,
            isAdmin: user.isAdmin ?? false,
            adminLevel: user.adminLevel ?? null,
          }
        } catch (error) {
          console.error("Credentials auth error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Handle OAuth providers (Google, GitHub, Facebook, LinkedIn, Twitter, Apple)
      if (account?.provider !== "credentials" && user.email) {
        try {
          await client.connect()
          const db = client.db()
          const users = db.collection("users")
          
          // Check if user exists
          const existingUser = await users.findOne({ email: user.email })
          
          if (existingUser) {
            // Update existing user with latest OAuth info
            const updates: Record<string, unknown> = {
              name: user.name || existingUser.name,
              image: user.image || existingUser.image,
              emailVerified: existingUser.emailVerified || new Date(),
              updatedAt: new Date()
            }
            
            // Mark old users without onboardingStep as completed (backward compatibility)
            if (!existingUser.onboardingStep && existingUser.role) {
              updates.onboardingStep = "completed"
            }
            
            await users.updateOne(
              { email: user.email },
              { $set: updates }
            )
          }
          // If user doesn't exist, MongoDB adapter will create them automatically
          // We'll set role/plan later in /auth-callback after user chooses role
          
          return true
        } catch (error) {
          console.error(`Error handling ${account?.provider || 'OAuth'} sign in:`, error)
          return false
        }
      }
      return true
    },
    async jwt({ token, user }) {
      // On sign in, merge user data
      if (user) {
        const u = user as AppUser
        token.userId = u._id
        token.role = u.role ?? null
        token.plan = u.plan ?? null
        if (u.planExpiresAt) token.planExpiresAt = u.planExpiresAt.toISOString()
        token.onboardingStep = u.onboardingStep ?? null
        token.isAdmin = u.isAdmin ?? false
        token.adminLevel = u.adminLevel ?? null
      }

      // Refresh token data from DB to ensure consistency
      if (!token.email) return token
      
      try {
        await client.connect()
        const db = client.db()
        const users = db.collection<AppUser>("users")
        const dbUser = await users.findOne({ email: token.email as string })
        
        // If user no longer exists, invalidate session
        if (!dbUser) {
          console.log("User not found in database, invalidating session:", token.email)
          return {} as typeof token
        }
        
        // Update token with latest DB values
    token.userId = dbUser._id.toString()
    token.role = dbUser.role ?? null
    token.isAdmin = !!dbUser.isAdmin
    token.adminLevel = dbUser.adminLevel ?? token.adminLevel ?? null
    token.onboardingStep = dbUser.onboardingStep ?? token.onboardingStep ?? null
        
        const extendedUser = dbUser as AppUser & { avatarUrl?: string; coverPhotoUrl?: string }
        token.avatarUrl = extendedUser.avatarUrl ?? token.avatarUrl
        token.coverPhotoUrl = extendedUser.coverPhotoUrl ?? token.coverPhotoUrl
        token.emailVerified = dbUser.emailVerified ? dbUser.emailVerified.toISOString() : null
        
        // Handle plan expiration
        let currentPlan = dbUser.plan ?? (token.plan as typeof token.plan | null) ?? null
        if (dbUser.planExpiresAt && new Date() > new Date(dbUser.planExpiresAt)) {
          // Plan expired - downgrade to free tier
          const freePlan = dbUser.role === "volunteer" ? "volunteer_free" : "ngo_base"
          await users.updateOne(
            { _id: dbUser._id },
            { 
              $set: { 
                plan: freePlan,
                planExpiresAt: null,
                updatedAt: new Date()
              } 
            }
          )
          currentPlan = freePlan
        }
        
    token.plan = currentPlan ?? null
        token.planExpiresAt = dbUser.planExpiresAt?.toISOString() ?? token.planExpiresAt
        token.profileComplete = (token.onboardingStep === "completed")
      } catch (error) {
        console.error("Error refreshing token:", error)
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        const extendedSession = session as typeof session & {
          userId: string
          role?: "volunteer" | "ngo" | "admin" | null
          plan?: "volunteer_free" | "volunteer_plus" | "ngo_base" | "ngo_plus" | null
          planExpiresAt?: string | null
          onboardingStep?: "role" | "profile" | "plan" | "completed" | null
          profileComplete: boolean
          isAdmin: boolean
          adminLevel?: "super" | "moderator" | "support" | null
        }
        
        extendedSession.userId = token.userId as string
  extendedSession.role = token.role as "volunteer" | "ngo" | "admin" | null
        extendedSession.isAdmin = Boolean(token.isAdmin)
        extendedSession.adminLevel = (token.adminLevel as "super" | "moderator" | "support" | null) ?? null
        extendedSession.plan = token.plan as "volunteer_free" | "volunteer_plus" | "ngo_base" | "ngo_plus" | null
        extendedSession.planExpiresAt = token.planExpiresAt as string | null
        extendedSession.profileComplete = token.profileComplete as boolean
        if (token.onboardingStep && token.onboardingStep !== null) {
          extendedSession.onboardingStep = token.onboardingStep as
            | "role"
            | "profile"
            | "plan"
            | "completed"
        } else {
          extendedSession.onboardingStep = undefined
        }
        
        // Add avatarUrl and coverPhotoUrl to session
        if (token.avatarUrl) {
          session.user.image = token.avatarUrl as string
          const extendedUser = session.user as typeof session.user & { avatarUrl?: string }
          extendedUser.avatarUrl = token.avatarUrl as string
        }
        if (token.coverPhotoUrl) {
          const extendedUser = session.user as typeof session.user & { coverPhotoUrl?: string }
          extendedUser.coverPhotoUrl = token.coverPhotoUrl as string
        }
      }
      return session
    },
  },
  events: {
    async signIn({ user, account }) {
      console.log(`User signed in: ${user.email} via ${account?.provider}`)
    },
  },
  debug: process.env.NODE_ENV === "development",
})