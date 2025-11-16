import { NextRequest, NextResponse } from "next/server"
import client from "@/lib/db"
import { canRegister } from "@/lib/platform-settings"
import { hash } from "bcryptjs"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z
    .string()
    .min(12, "Password must be at least 12 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  role: z.enum(["volunteer", "ngo"]),
  plan: z.enum(["volunteer_free", "volunteer_plus", "ngo_base", "ngo_plus"]).optional(),
})

export async function POST(req: NextRequest) {
  // Check if registration is enabled
  const registrationEnabled = await canRegister()
  if (!registrationEnabled) {
    return NextResponse.json(
      { error: "Registration is currently disabled" },
      { status: 403 }
    )
  }

  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 })
  }

  const { name, email, password, role, plan } = parsed.data

  // CRITICAL FIX: Always set free tier on signup, only upgrade after payment verification
  const freeTierPlan = role === "volunteer" ? "volunteer_free" : "ngo_base"
  
  // Track if user requested a Plus plan so we can redirect to upgrade page
  const requestedPlusPlan = plan && plan.endsWith("plus")

  try {
    await client.connect()
    const db = client.db()
    const users = db.collection("users")

    const existing = await users.findOne({ email })
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 })
    }

    const passwordHash = await hash(password, 10)
    const now = new Date()
    const doc = {
      name,
      email,
      passwordHash,
      role,
      plan: freeTierPlan, // Always free tier - only upgrade after payment
      planExpiresAt: null as Date | null, // set upon payment for plus plans
      onboardingStep: "plan" as "plan",
      monthlyApplicationCount: 0,
      monthlyApplicationResetAt: now,
      createdAt: now,
      updatedAt: now,
    }
    const { insertedId } = await users.insertOne(doc)

    return NextResponse.json({ 
      userId: insertedId.toString(), 
      requiresUpgradePayment: requestedPlusPlan 
    })
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}


