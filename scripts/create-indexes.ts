/**
 * Database Indexes Setup Script
 * Run this script to create all necessary indexes for optimal query performance
 * 
 * Usage: npx tsx scripts/create-indexes.ts
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

async function createIndexes() {
  try {
    console.log("Connecting to database...")
    await client.connect()
    const db = client.db()

    console.log("\n📊 Creating indexes...\n")

    // Users collection indexes
    console.log("Creating users collection indexes...")
    const users = db.collection("users")
    
    await users.createIndex({ email: 1 }, { unique: true })
    console.log("✅ Created unique index on users.email")
    
    await users.createIndex({ role: 1 })
    console.log("✅ Created index on users.role")
    
    await users.createIndex({ isAdmin: 1 })
    console.log("✅ Created index on users.isAdmin")
    
    await users.createIndex({ plan: 1, planExpiresAt: 1 })
    console.log("✅ Created compound index on users.plan and users.planExpiresAt")
    
    await users.createIndex({ createdAt: -1 })
    console.log("✅ Created index on users.createdAt")
    
    await users.createIndex({ banned: 1 })
    console.log("✅ Created index on users.banned")
    
    await users.createIndex({ verified: 1 })
    console.log("✅ Created index on users.verified")

    // Jobs collection indexes
    console.log("\nCreating jobs collection indexes...")
    const jobs = db.collection("jobs")
    
    await jobs.createIndex({ ngoId: 1 })
    console.log("✅ Created index on jobs.ngoId")
    
    await jobs.createIndex({ status: 1 })
    console.log("✅ Created index on jobs.status")
    
    await jobs.createIndex({ category: 1 })
    console.log("✅ Created index on jobs.category")
    
    await jobs.createIndex({ createdAt: -1 })
    console.log("✅ Created index on jobs.createdAt")
    
    await jobs.createIndex({ featured: 1, featuredAt: -1 })
    console.log("✅ Created compound index on jobs.featured and jobs.featuredAt")
    
    await jobs.createIndex({ moderationStatus: 1 })
    console.log("✅ Created index on jobs.moderationStatus")
    
    await jobs.createIndex({ location: 1 })
    console.log("✅ Created index on jobs.location")

    // Applications collection indexes
    console.log("\nCreating applications collection indexes...")
    const applications = db.collection("applications")
    
    await applications.createIndex({ jobId: 1 })
    console.log("✅ Created index on applications.jobId")
    
    await applications.createIndex({ volunteerId: 1 })
    console.log("✅ Created index on applications.volunteerId")
    
    await applications.createIndex({ ngoId: 1 })
    console.log("✅ Created index on applications.ngoId")
    
    await applications.createIndex({ status: 1 })
    console.log("✅ Created index on applications.status")
    
    await applications.createIndex({ createdAt: -1 })
    console.log("✅ Created index on applications.createdAt")
    
    await applications.createIndex({ volunteerId: 1, status: 1 })
    console.log("✅ Created compound index on applications.volunteerId and applications.status")
    
    await applications.createIndex({ ngoId: 1, status: 1 })
    console.log("✅ Created compound index on applications.ngoId and applications.status")

    // Orders collection indexes
    console.log("\nCreating orders collection indexes...")
    const orders = db.collection("orders")
    
    await orders.createIndex({ userId: 1 })
    console.log("✅ Created index on orders.userId")
    
    await orders.createIndex({ status: 1 })
    console.log("✅ Created index on orders.status")
    
    await orders.createIndex({ orderId: 1 }, { unique: true })
    console.log("✅ Created unique index on orders.orderId")
    
    await orders.createIndex({ razorpayPaymentId: 1 }, { sparse: true })
    console.log("✅ Created sparse index on orders.razorpayPaymentId")
    
    await orders.createIndex({ createdAt: -1 })
    console.log("✅ Created index on orders.createdAt")

    // Text search indexes for better search functionality
    console.log("\nCreating text search indexes...")
    
    await users.createIndex({ 
      name: "text", 
      email: "text", 
      bio: "text",
      orgName: "text"
    }, { 
      name: "users_text_search",
      weights: {
        name: 10,
        email: 5,
        orgName: 10,
        bio: 1
      }
    })
    console.log("✅ Created text search index on users collection")
    
    await jobs.createIndex({ 
      title: "text", 
      description: "text",
      skills: "text"
    }, { 
      name: "jobs_text_search",
      weights: {
        title: 10,
        description: 5,
        skills: 3
      }
    })
    console.log("✅ Created text search index on jobs collection")

    console.log("\n✨ All indexes created successfully!\n")

    // List all indexes for verification
    console.log("📋 Verifying indexes...\n")
    
    const usersIndexes = await users.indexes()
    console.log("Users indexes:", usersIndexes.length)
    
    const jobsIndexes = await jobs.indexes()
    console.log("Jobs indexes:", jobsIndexes.length)
    
    const applicationsIndexes = await applications.indexes()
    console.log("Applications indexes:", applicationsIndexes.length)
    
    const ordersIndexes = await orders.indexes()
    console.log("Orders indexes:", ordersIndexes.length)

    console.log("\n✅ Database indexes setup completed successfully!")
    
  } catch (error) {
    console.error("\n❌ Error creating indexes:", error)
    throw error
  } finally {
    await client.close()
    console.log("\n🔌 Database connection closed")
  }
}

// Run the script
createIndexes()
  .then(() => {
    console.log("\n🎉 Script completed successfully")
    process.exit(0)
  })
  .catch((error) => {
    console.error("\n💥 Script failed:", error)
    process.exit(1)
  })
