import { z } from "zod"

const envSchema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    MONGODB_URI: z.string().url(),
    AUTH_SECRET: z.string().min(1, "AUTH_SECRET is required"),
    REDIS_URL: z.string().url().optional(),
    RAZORPAY_KEY_SECRET: z.string().min(1).optional(),
  })
  .passthrough()

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error("❌ Invalid environment variables:", parsed.error.flatten().fieldErrors)
  throw new Error("Environment validation failed. Please check your .env configuration.")
}

export const env = parsed.data

export type AppEnv = typeof env

