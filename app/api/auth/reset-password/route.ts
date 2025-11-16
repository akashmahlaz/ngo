import { NextRequest, NextResponse } from "next/server"
import { getCollections } from "@/lib/models"
import { z } from "zod"
import crypto from "crypto"
import { hash } from "bcryptjs"

const schema = z.object({
  token: z.string().min(1),
  password: z
    .string()
    .min(12, "Password must be at least 12 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null)
    const parsed = schema.safeParse(body)
    
    if (!parsed.success) {
      return NextResponse.json({ 
        error: parsed.error.issues[0]?.message || "Invalid input" 
      }, { status: 400 })
    }

    const { token, password } = parsed.data
    const { users } = await getCollections()
    
    // Hash the provided token to match database
    const resetTokenHash = crypto.createHash("sha256").update(token).digest("hex")
    
    // Find user with valid reset token
    const user = await users.findOne({
      passwordResetToken: resetTokenHash,
      passwordResetExpiry: { $gt: new Date() }, // Token not expired
    })

    if (!user) {
      return NextResponse.json({ 
        error: "Invalid or expired reset token" 
      }, { status: 400 })
    }

    // Hash new password
    const passwordHash = await hash(password, 10)

    // Update user password and clear reset token
    await users.updateOne(
      { _id: user._id },
      {
        $set: {
          passwordHash,
          updatedAt: new Date(),
        },
        $unset: {
          passwordResetToken: "",
          passwordResetExpiry: "",
        },
      }
    )

    return NextResponse.json({
      success: true,
      message: "Password reset successfully. You can now sign in with your new password.",
    })
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
