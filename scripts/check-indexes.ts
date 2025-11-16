/**
 * Check Existing Database Indexes
 * Run this script to see what indexes currently exist in your database
 * 
 * Usage: npx tsx scripts/check-indexes.ts
 */

// Load environment variables first
import { config } from "dotenv"
import { resolve } from "path"
config({ path: resolve(process.cwd(), ".env.local") })

import { MongoClient } from "mongodb"

// Get MongoDB URI from environment
const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not found in environment variables")
  console.error("Make sure .env.local exists with MONGODB_URI")
  process.exit(1)
}

const client = new MongoClient(MONGODB_URI)

async function checkIndexes() {
  try {
    console.log("Connecting to database...")
    await client.connect()
    const db = client.db()

    console.log("\n📊 Checking existing indexes...\n")

    // Check Users collection
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    console.log("USERS COLLECTION")
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    const users = db.collection("users")
    const usersIndexes = await users.indexes()
    console.log(`Total indexes: ${usersIndexes.length}\n`)
    usersIndexes.forEach((index, i) => {
      console.log(`${i + 1}. ${index.name}`)
      console.log(`   Keys: ${JSON.stringify(index.key)}`)
      if (index.unique) console.log(`   ✓ Unique`)
      if (index.sparse) console.log(`   ✓ Sparse`)
      if (index.weights) console.log(`   Weights: ${JSON.stringify(index.weights)}`)
      console.log()
    })

    // Check Jobs collection
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    console.log("JOBS COLLECTION")
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    const jobs = db.collection("jobs")
    const jobsIndexes = await jobs.indexes()
    console.log(`Total indexes: ${jobsIndexes.length}\n`)
    jobsIndexes.forEach((index, i) => {
      console.log(`${i + 1}. ${index.name}`)
      console.log(`   Keys: ${JSON.stringify(index.key)}`)
      if (index.unique) console.log(`   ✓ Unique`)
      if (index.sparse) console.log(`   ✓ Sparse`)
      if (index.weights) console.log(`   Weights: ${JSON.stringify(index.weights)}`)
      console.log()
    })

    // Check Applications collection
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    console.log("APPLICATIONS COLLECTION")
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    const applications = db.collection("applications")
    const applicationsIndexes = await applications.indexes()
    console.log(`Total indexes: ${applicationsIndexes.length}\n`)
    applicationsIndexes.forEach((index, i) => {
      console.log(`${i + 1}. ${index.name}`)
      console.log(`   Keys: ${JSON.stringify(index.key)}`)
      if (index.unique) console.log(`   ✓ Unique`)
      if (index.sparse) console.log(`   ✓ Sparse`)
      if (index.weights) console.log(`   Weights: ${JSON.stringify(index.weights)}`)
      console.log()
    })

    // Check Orders collection
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    console.log("ORDERS COLLECTION")
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    const orders = db.collection("orders")
    const ordersIndexes = await orders.indexes()
    console.log(`Total indexes: ${ordersIndexes.length}\n`)
    ordersIndexes.forEach((index, i) => {
      console.log(`${i + 1}. ${index.name}`)
      console.log(`   Keys: ${JSON.stringify(index.key)}`)
      if (index.unique) console.log(`   ✓ Unique`)
      if (index.sparse) console.log(`   ✓ Sparse`)
      if (index.weights) console.log(`   Weights: ${JSON.stringify(index.weights)}`)
      console.log()
    })

    // Summary
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    console.log("SUMMARY")
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    console.log(`Users:        ${usersIndexes.length} indexes`)
    console.log(`Jobs:         ${jobsIndexes.length} indexes`)
    console.log(`Applications: ${applicationsIndexes.length} indexes`)
    console.log(`Orders:       ${ordersIndexes.length} indexes`)
    console.log(`Total:        ${usersIndexes.length + jobsIndexes.length + applicationsIndexes.length + ordersIndexes.length} indexes`)
    console.log()

  } catch (error) {
    console.error("\n❌ Error checking indexes:", error)
    throw error
  } finally {
    await client.close()
    console.log("🔌 Database connection closed")
  }
}

// Run the script
checkIndexes()
  .then(() => {
    console.log("\n✅ Check completed successfully")
    process.exit(0)
  })
  .catch((error) => {
    console.error("\n💥 Check failed:", error)
    process.exit(1)
  })
