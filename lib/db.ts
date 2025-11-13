// This approach is adapted from https://github.com/vercel/next.js/tree/canary/examples/with-mongodb
import { env } from "@/lib/env"
import { MongoClient, MongoClientOptions, ServerApiVersion } from "mongodb"

const uri = env.MONGODB_URI

const options: MongoClientOptions = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  maxPoolSize: 10,
  minPoolSize: 2,
  maxIdleTimeMS: 30_000,
  serverSelectionTimeoutMS: 5_000,
  socketTimeoutMS: 45_000,
  connectTimeoutMS: 10_000,
  retryWrites: true,
  retryReads: true,
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoClient: MongoClient | undefined
}

let client: MongoClient

if (env.NODE_ENV !== "production") {
  if (!global._mongoClient) {
    global._mongoClient = new MongoClient(uri, options)
  }
  client = global._mongoClient
} else {
  client = new MongoClient(uri, options)
}

export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    const connection = await client.connect()
    await connection.db().admin().ping()
    return true
  } catch (error) {
    console.error("Database health check failed:", error)
    return false
  }
}

export async function closeDatabaseConnection(): Promise<void> {
  try {
    await client.close()
  } catch (error) {
    console.error("Error closing database connection:", error)
  }
}

export default client