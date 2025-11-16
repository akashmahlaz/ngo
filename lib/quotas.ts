import { getCollections } from "@/lib/models"
import { addDays } from "date-fns"
import { ObjectId } from "mongodb"

/**
 * Check if a volunteer can apply for a job (with atomic operation to prevent race conditions)
 * Free plan: 1 application per month
 * Plus plan: Unlimited applications
 */
export async function canApply(userId: string, isPlus: boolean) {
  if (isPlus) return { ok: true }
  
  const { users } = await getCollections()
  const now = new Date()
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  
  const u = await users.findOne({ _id: new ObjectId(userId) })
  if (!u) return { ok: false, reason: "USER_MISSING" }
  
  // Check if reset is needed (30 days passed)
  if (new Date(u.monthlyApplicationResetAt).getTime() <= monthAgo.getTime()) {
    // Reset counter atomically
    await users.updateOne(
      { _id: u._id },
      { 
        $set: { 
          monthlyApplicationCount: 0, 
          monthlyApplicationResetAt: now 
        } 
      }
    )
    return { ok: true }
  }
  
  // Check if under limit
  if (u.monthlyApplicationCount < 1) {
    return { ok: true }
  }
  
  return { ok: false, reason: "LIMIT_REACHED" }
}

/**
 * Record an application (atomic increment to prevent race conditions)
 * This should be called AFTER successfully creating an application
 */
export async function recordApplication(userId: string) {
  const { users } = await getCollections()
  
  // Atomic increment - prevents race conditions
  const result = await users.findOneAndUpdate(
    { _id: new ObjectId(userId) },
    { $inc: { monthlyApplicationCount: 1 } },
    { returnDocument: 'after' }
  )
  
  if (!result) {
    throw new Error("Failed to record application - user not found")
  }
  
  return result
}

/**
 * Check if an NGO can post a job (with atomic check)
 * Free plan: 3 active jobs
 * Plus plan: Unlimited jobs
 */
export async function canPostJob(userId: string, isPlus: boolean, baseLimit = 3) {
  if (isPlus) return { ok: true }
  
  const { jobs } = await getCollections()
  
  // Count active jobs for this NGO
  const active = await jobs.countDocuments({ 
    ngoId: new ObjectId(userId), 
    status: "open" 
  })
  
  return { 
    ok: active < baseLimit, 
    active, 
    limit: baseLimit,
    remaining: Math.max(0, baseLimit - active)
  }
}

/**
 * No-op function - job posting itself creates the record
 * Kept for API compatibility
 */
export async function recordJobPost() {
  // No-op; posting itself creates the record
}


