import { NextResponse } from "next/server"
import { checkDatabaseHealth } from "@/lib/db"

export async function GET() {
  const database = await checkDatabaseHealth()

  const healthy = database

  return NextResponse.json(
    {
      status: healthy ? "healthy" : "degraded",
      checks: {
        database,
      },
      timestamp: new Date().toISOString(),
    },
    { status: healthy ? 200 : 503 }
  )
}

