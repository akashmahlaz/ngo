# System Design & Flow Improvements

## Executive Summary

This document outlines comprehensive improvements for the Volunteer-NGO Job Platform's system design, architecture, and user flows. The recommendations focus on scalability, maintainability, performance, security, and user experience.

---

## 1. Architecture & Infrastructure Improvements

### 1.1 Database Connection Management

**Current Issues:**
- Single MongoDB client instance shared globally
- No connection pooling configuration
- No retry logic for connection failures
- Potential connection leaks in error scenarios

**Recommendations:**

```typescript
// lib/db.ts improvements
import { MongoClient, ServerApiVersion, MongoClientOptions } from "mongodb"

const options: MongoClientOptions = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  maxPoolSize: 10, // Limit connection pool
  minPoolSize: 2,  // Maintain minimum connections
  maxIdleTimeMS: 30000, // Close idle connections after 30s
  serverSelectionTimeoutMS: 5000, // Timeout after 5s
  socketTimeoutMS: 45000, // Socket timeout
  connectTimeoutMS: 10000, // Connection timeout
  retryWrites: true,
  retryReads: true,
}

// Add connection health check
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    await client.connect()
    await client.db().admin().ping()
    return true
  } catch {
    return false
  }
}

// Add graceful shutdown
export async function closeDatabaseConnection(): Promise<void> {
  try {
    await client.close()
  } catch (error) {
    console.error("Error closing database connection:", error)
  }
}
```

**Benefits:**
- Better resource management
- Improved reliability
- Connection pooling optimization
- Health monitoring capability

---

### 1.2 Caching Strategy

**Current Issues:**
- Minimal caching implementation
- Platform settings cached in memory only
- No cache invalidation strategy
- No Redis/external cache for distributed systems

**Recommendations:**

```typescript
// lib/cache.ts - New file
import { Redis } from '@upstash/redis' // or similar

const redis = process.env.REDIS_URL ? new Redis({ url: process.env.REDIS_URL }) : null

export class CacheManager {
  private static memoryCache = new Map<string, { data: any; expiry: number }>()
  
  static async get<T>(key: string): Promise<T | null> {
    // Try Redis first
    if (redis) {
      try {
        const data = await redis.get<T>(key)
        if (data) return data
      } catch (error) {
        console.error("Redis get error:", error)
      }
    }
    
    // Fallback to memory cache
    const cached = this.memoryCache.get(key)
    if (cached && cached.expiry > Date.now()) {
      return cached.data as T
    }
    
    if (cached) {
      this.memoryCache.delete(key) // Clean expired
    }
    
    return null
  }
  
  static async set(key: string, data: any, ttlSeconds: number = 300): Promise<void> {
    // Set in Redis
    if (redis) {
      try {
        await redis.setex(key, ttlSeconds, JSON.stringify(data))
      } catch (error) {
        console.error("Redis set error:", error)
      }
    }
    
    // Also set in memory cache
    this.memoryCache.set(key, {
      data,
      expiry: Date.now() + ttlSeconds * 1000
    })
  }
  
  static async invalidate(pattern: string): Promise<void> {
    if (redis) {
      try {
        const keys = await redis.keys(pattern)
        if (keys.length > 0) {
          await redis.del(...keys)
        }
      } catch (error) {
        console.error("Redis invalidate error:", error)
      }
    }
    
    // Invalidate memory cache
    for (const key of this.memoryCache.keys()) {
      if (key.includes(pattern)) {
        this.memoryCache.delete(key)
      }
    }
  }
}

// Usage in platform-settings.ts
export async function getPlatformSettings(): Promise<PlatformSettings> {
  const cacheKey = "platform:settings"
  const cached = await CacheManager.get<PlatformSettings>(cacheKey)
  if (cached) return cached
  
  // ... existing logic ...
  
  const settings = /* fetch from DB */
  await CacheManager.set(cacheKey, settings, 60) // Cache for 1 minute
  return settings
}
```

**Cache Keys Strategy:**
- `platform:settings` - Platform settings (60s TTL)
- `user:{userId}` - User data (300s TTL)
- `job:{jobId}` - Job details (600s TTL)
- `jobs:list:{page}:{limit}` - Job listings (300s TTL)
- `applications:{userId}` - User applications (180s TTL)

**Benefits:**
- Reduced database load
- Faster response times
- Better scalability
- Cost reduction

---

### 1.3 Search Functionality Enhancement

**Current Issues:**
- Basic string matching only
- No full-text search
- No relevance scoring
- Inefficient for large datasets
- No search analytics

**Recommendations:**

**Option A: MongoDB Atlas Search (Recommended)**
```typescript
// lib/search-enhanced.ts
export async function searchJobsEnhanced(query: string, filters?: SearchFilters) {
  const { jobs } = await getCollections()
  
  // Use MongoDB Atlas Search for full-text search
  const pipeline = [
    {
      $search: {
        index: "jobs_search_index",
        text: {
          query: query,
          path: ["title", "description", "skills", "category"],
          fuzzy: { maxEdits: 2 }
        }
      }
    },
    {
      $addFields: {
        score: { $meta: "searchScore" }
      }
    },
    // Apply filters
    ...(filters?.location ? [{ $match: { location: filters.location } }] : []),
    ...(filters?.category ? [{ $match: { category: filters.category } }] : []),
    // Sort by relevance
    { $sort: { score: -1, createdAt: -1 } },
    { $limit: 50 }
  ]
  
  return await jobs.aggregate(pipeline).toArray()
}
```

**Option B: Algolia/Meilisearch Integration**
```typescript
// For better search UX with typo tolerance, faceted search, etc.
import algoliasearch from 'algoliasearch'

const searchClient = algoliasearch(
  process.env.ALGOLIA_APP_ID!,
  process.env.ALGOLIA_SEARCH_KEY!
)

const jobsIndex = searchClient.initIndex('jobs')

export async function syncJobToSearch(job: JobDoc) {
  await jobsIndex.saveObject({
    objectID: job._id.toString(),
    title: job.title,
    description: job.description,
    category: job.category,
    location: job.location,
    skills: job.skills,
    ngoId: job.ngoId.toString(),
    createdAt: job.createdAt.getTime(),
  })
}
```

**Benefits:**
- Better search accuracy
- Typo tolerance
- Relevance ranking
- Faceted search capabilities
- Search analytics

---

## 2. API Design Improvements

### 2.1 Standardized API Response Format

**Current Issues:**
- Inconsistent response structures
- Mixed error formats
- No pagination metadata
- No rate limiting headers

**Recommendations:**

```typescript
// lib/api-response.ts - New file
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  meta?: {
    pagination?: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
    timestamp: string
    requestId: string
  }
}

export function successResponse<T>(
  data: T,
  meta?: ApiResponse<T>['meta']
): ApiResponse<T> {
  return {
    success: true,
    data,
    meta: {
      ...meta,
      timestamp: new Date().toISOString(),
      requestId: crypto.randomUUID(),
    }
  }
}

export function errorResponse(
  code: string,
  message: string,
  details?: any,
  status: number = 400
): Response {
  return NextResponse.json(
    {
      success: false,
      error: { code, message, details },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: crypto.randomUUID(),
      }
    },
    { status }
  )
}

// Usage in API routes
export async function GET(req: NextRequest) {
  try {
    const page = parseInt(req.nextUrl.searchParams.get("page") || "1")
    const limit = parseInt(req.nextUrl.searchParams.get("limit") || "20")
    
    const { jobs, total } = await getJobsPaginated(page, limit)
    
    return NextResponse.json(
      successResponse(jobs, {
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      })
    )
  } catch (error) {
    return errorResponse("INTERNAL_ERROR", "Failed to fetch jobs", error, 500)
  }
}
```

---

### 2.2 API Rate Limiting

**Recommendations:**

```typescript
// lib/rate-limit.ts - New file
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const redis = new Redis({ url: process.env.REDIS_URL! })

export const rateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "10 s"), // 10 requests per 10 seconds
  analytics: true,
})

export async function checkRateLimit(identifier: string) {
  const { success, limit, remaining, reset } = await rateLimiter.limit(identifier)
  
  return {
    allowed: success,
    limit,
    remaining,
    reset,
  }
}

// Middleware usage
export async function rateLimitMiddleware(req: NextRequest) {
  const ip = req.ip || req.headers.get("x-forwarded-for") || "unknown"
  const result = await checkRateLimit(`api:${ip}`)
  
  if (!result.allowed) {
    return errorResponse(
      "RATE_LIMIT_EXCEEDED",
      "Too many requests. Please try again later.",
      { reset: result.reset },
      429
    )
  }
  
  return null // Continue
}
```

---

### 2.3 Request Validation Middleware

**Recommendations:**

```typescript
// lib/validation-middleware.ts
import { z } from "zod"

export function validateRequest<T extends z.ZodTypeAny>(
  schema: T,
  handler: (data: z.infer<T>, req: NextRequest) => Promise<Response>
) {
  return async (req: NextRequest) => {
    try {
      const body = await req.json().catch(() => ({}))
      const parsed = schema.safeParse(body)
      
      if (!parsed.success) {
        return errorResponse(
          "VALIDATION_ERROR",
          "Invalid request data",
          parsed.error.errors,
          400
        )
      }
      
      return handler(parsed.data, req)
    } catch (error) {
      return errorResponse("PARSE_ERROR", "Failed to parse request", error, 400)
    }
  }
}

// Usage
export const POST = validateRequest(
  createJobSchema,
  async (data, req) => {
    // Handler logic with validated data
  }
)
```

---

## 3. Error Handling & Logging

### 3.1 Centralized Error Handling

**Current Issues:**
- Inconsistent error handling
- Console.error for logging
- No error tracking service
- No error categorization

**Recommendations:**

```typescript
// lib/error-handler.ts - New file
export enum ErrorCode {
  // Authentication
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  SESSION_EXPIRED = "SESSION_EXPIRED",
  
  // Validation
  VALIDATION_ERROR = "VALIDATION_ERROR",
  INVALID_INPUT = "INVALID_INPUT",
  
  // Resources
  NOT_FOUND = "NOT_FOUND",
  ALREADY_EXISTS = "ALREADY_EXISTS",
  
  // Business Logic
  QUOTA_EXCEEDED = "QUOTA_EXCEEDED",
  PLAN_EXPIRED = "PLAN_EXPIRED",
  INVALID_PLAN = "INVALID_PLAN",
  
  // System
  DATABASE_ERROR = "DATABASE_ERROR",
  EXTERNAL_SERVICE_ERROR = "EXTERNAL_SERVICE_ERROR",
  INTERNAL_ERROR = "INTERNAL_ERROR",
}

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public statusCode: number = 400,
    public details?: any
  ) {
    super(message)
    this.name = "AppError"
  }
}

// Logger with structured logging
import pino from 'pino'

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV === 'development' ? {
    target: 'pino-pretty',
    options: { colorize: true }
  } : undefined,
})

// Error tracking (Sentry integration)
import * as Sentry from "@sentry/nextjs"

export function logError(error: Error | AppError, context?: Record<string, any>) {
  logger.error({
    err: error,
    ...context,
  })
  
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureException(error, {
      extra: context,
    })
  }
}

// Global error handler wrapper
export function withErrorHandling(
  handler: (req: NextRequest) => Promise<Response>
) {
  return async (req: NextRequest) => {
    try {
      return await handler(req)
    } catch (error) {
      if (error instanceof AppError) {
        logError(error, { path: req.nextUrl.pathname })
        return errorResponse(
          error.code,
          error.message,
          error.details,
          error.statusCode
        )
      }
      
      logError(error as Error, { path: req.nextUrl.pathname })
      return errorResponse(
        ErrorCode.INTERNAL_ERROR,
        "An unexpected error occurred",
        process.env.NODE_ENV === 'development' ? error : undefined,
        500
      )
    }
  }
}
```

---

### 3.2 Database Transaction Support

**Recommendations:**

```typescript
// lib/transactions.ts - New file
export async function withTransaction<T>(
  operation: (session: ClientSession) => Promise<T>
): Promise<T> {
  const session = client.startSession()
  
  try {
    session.startTransaction()
    const result = await operation(session)
    await session.commitTransaction()
    return result
  } catch (error) {
    await session.abortTransaction()
    throw error
  } finally {
    await session.endSession()
  }
}

// Usage - Atomic operations
export async function createApplicationWithChecks(data: ApplicationData) {
  return withTransaction(async (session) => {
    // Check quota
    const canApply = await checkApplicationQuota(data.volunteerId, { session })
    if (!canApply.ok) {
      throw new AppError(ErrorCode.QUOTA_EXCEEDED, canApply.reason, 402)
    }
    
    // Create application
    const application = await applications.insertOne(
      { ...data, createdAt: new Date() },
      { session }
    )
    
    // Update quota
    await recordApplication(data.volunteerId, { session })
    
    return application
  })
}
```

---

## 4. Security Improvements

### 4.1 Input Sanitization

**Recommendations:**

```typescript
// lib/sanitize.ts - New file
import DOMPurify from 'isomorphic-dompurify'
import { z } from 'zod'

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'a'],
    ALLOWED_ATTR: ['href'],
  })
}

export function sanitizeString(input: string): string {
  return input.trim().replace(/[<>]/g, '')
}

// Zod schema with sanitization
export const sanitizedString = z.string().transform(sanitizeString)
export const sanitizedHtml = z.string().transform(sanitizeHtml)
```

---

### 4.2 CSRF Protection

**Recommendations:**

```typescript
// lib/csrf.ts - New file
import { randomBytes } from 'crypto'

export function generateCSRFToken(): string {
  return randomBytes(32).toString('hex')
}

export function validateCSRFToken(token: string, sessionToken: string): boolean {
  return token === sessionToken && token.length === 64
}

// Add to API routes
export async function POST(req: NextRequest) {
  const csrfToken = req.headers.get('X-CSRF-Token')
  const session = await auth()
  
  if (!validateCSRFToken(csrfToken || '', session?.csrfToken || '')) {
    return errorResponse("CSRF_ERROR", "Invalid CSRF token", {}, 403)
  }
  
  // ... rest of handler
}
```

---

### 4.3 SQL Injection Prevention (MongoDB Injection)

**Current Issues:**
- Direct string interpolation in queries (if any)
- No parameterized queries validation

**Recommendations:**

```typescript
// Always use ObjectId for IDs
import { ObjectId } from 'mongodb'

// ❌ BAD
const user = await users.findOne({ _id: userId })

// ✅ GOOD
const user = await users.findOne({ _id: new ObjectId(userId) })

// Sanitize search queries
export function sanitizeSearchQuery(query: string): string {
  // Remove MongoDB operators
  return query.replace(/[$]/g, '').trim()
}
```

---

## 5. Performance Optimizations

### 5.1 Database Indexing Strategy

**Recommendations:**

```typescript
// scripts/create-indexes.ts - New file
export async function createIndexes() {
  const { users, jobs, applications } = await getCollections()
  
  // Users indexes
  await users.createIndex({ email: 1 }, { unique: true })
  await users.createIndex({ role: 1, plan: 1 })
  await users.createIndex({ createdAt: -1 })
  await users.createIndex({ "emailVerificationToken": 1 }, { sparse: true })
  
  // Jobs indexes
  await jobs.createIndex({ ngoId: 1, status: 1 })
  await jobs.createIndex({ status: 1, createdAt: -1 })
  await jobs.createIndex({ category: 1, locationType: 1 })
  await jobs.createIndex({ "moderationStatus": 1, createdAt: -1 })
  await jobs.createIndex({ featured: 1, featuredAt: -1 })
  
  // Applications indexes
  await applications.createIndex({ jobId: 1, volunteerId: 1 }, { unique: true })
  await applications.createIndex({ volunteerId: 1, status: 1 })
  await applications.createIndex({ ngoId: 1, status: 1 })
  await applications.createIndex({ createdAt: -1 })
  
  // Text search index (if using MongoDB text search)
  await jobs.createIndex({
    title: "text",
    description: "text",
    skills: "text",
    category: "text"
  })
}
```

---

### 5.2 Query Optimization

**Recommendations:**

```typescript
// Use projections to limit data transfer
export async function getJobsList(limit: number = 20) {
  return await jobs
    .find({ status: "open" })
    .project({
      title: 1,
      category: 1,
      locationType: 1,
      createdAt: 1,
      ngoId: 1,
      // Exclude large fields
      description: 0,
    })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray()
}

// Use aggregation for complex queries
export async function getJobStats(ngoId: string) {
  const stats = await applications.aggregate([
    { $match: { ngoId: new ObjectId(ngoId) } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 }
      }
    }
  ]).toArray()
  
  return stats
}

// Batch operations
export async function enrichJobsWithNGOs(jobs: JobDoc[]) {
  const ngoIds = [...new Set(jobs.map(j => j.ngoId.toString()))]
  const ngos = await users.find({
    _id: { $in: ngoIds.map(id => new ObjectId(id)) }
  }).toArray()
  
  const ngoMap = new Map(ngos.map(n => [n._id.toString(), n]))
  
  return jobs.map(job => ({
    ...job,
    ngo: ngoMap.get(job.ngoId.toString())
  }))
}
```

---

### 5.3 Image Optimization

**Recommendations:**

```typescript
// lib/image-optimization.ts - New file
import sharp from 'sharp'

export async function optimizeImage(
  buffer: Buffer,
  options: {
    width?: number
    height?: number
    quality?: number
    format?: 'webp' | 'jpeg' | 'png'
  } = {}
): Promise<Buffer> {
  const {
    width = 1200,
    height = 1200,
    quality = 80,
    format = 'webp'
  } = options
  
  return sharp(buffer)
    .resize(width, height, {
      fit: 'inside',
      withoutEnlargement: true
    })
    .toFormat(format, { quality })
    .toBuffer()
}

// Generate thumbnails
export async function generateThumbnails(buffer: Buffer) {
  const sizes = [
    { width: 150, height: 150, suffix: 'thumb' },
    { width: 400, height: 400, suffix: 'medium' },
    { width: 1200, height: 1200, suffix: 'large' },
  ]
  
  return Promise.all(
    sizes.map(async ({ width, height, suffix }) => ({
      suffix,
      buffer: await optimizeImage(buffer, { width, height })
    }))
  )
}
```

---

## 6. User Flow Improvements

### 6.1 Onboarding Flow Enhancement

**Current Issues:**
- Basic onboarding steps
- No progress tracking
- No skip options
- Limited guidance

**Recommendations:**

```typescript
// Enhanced onboarding with progress
export type OnboardingStep = 
  | "welcome"
  | "role_selection"
  | "profile_basics"
  | "profile_details"
  | "preferences"
  | "verification"
  | "completed"

export interface OnboardingProgress {
  currentStep: OnboardingStep
  completedSteps: OnboardingStep[]
  skippedSteps: OnboardingStep[]
  progress: number // 0-100
}

// Save progress
export async function updateOnboardingProgress(
  userId: string,
  step: OnboardingStep,
  data: any
) {
  await users.updateOne(
    { _id: new ObjectId(userId) },
    {
      $set: {
        [`onboarding.${step}`]: data,
        [`onboarding.currentStep`]: step,
        [`onboarding.updatedAt`]: new Date(),
      },
      $addToSet: { [`onboarding.completedSteps`]: step }
    }
  )
}
```

---

### 6.2 Application Status Flow

**Recommendations:**

```typescript
// Enhanced application workflow
export type ApplicationStatus = 
  | "draft"
  | "applied"
  | "viewed"
  | "shortlisted"
  | "interview_scheduled"
  | "interview_completed"
  | "accepted"
  | "rejected"
  | "withdrawn"

export interface ApplicationTimeline {
  status: ApplicationStatus
  timestamp: Date
  note?: string
  actor: "volunteer" | "ngo" | "system"
}

// Status transition validation
const validTransitions: Record<ApplicationStatus, ApplicationStatus[]> = {
  draft: ["applied", "withdrawn"],
  applied: ["viewed", "shortlisted", "rejected", "withdrawn"],
  viewed: ["shortlisted", "rejected", "withdrawn"],
  shortlisted: ["interview_scheduled", "rejected", "withdrawn"],
  interview_scheduled: ["interview_completed", "rejected", "withdrawn"],
  interview_completed: ["accepted", "rejected", "withdrawn"],
  accepted: [],
  rejected: [],
  withdrawn: [],
}

export function canTransition(
  from: ApplicationStatus,
  to: ApplicationStatus
): boolean {
  return validTransitions[from]?.includes(to) ?? false
}
```

---

### 6.3 Notification System

**Recommendations:**

```typescript
// lib/notifications.ts - New file
export type NotificationType = 
  | "application_received"
  | "application_status_change"
  | "job_match"
  | "message_received"
  | "profile_viewed"
  | "plan_expiring"

export interface Notification {
  _id: ObjectId
  userId: ObjectId
  type: NotificationType
  title: string
  message: string
  link?: string
  read: boolean
  createdAt: Date
}

// Create notification
export async function createNotification(
  userId: string,
  type: NotificationType,
  data: {
    title: string
    message: string
    link?: string
  }
) {
  const { notifications } = await getCollections()
  
  await notifications.insertOne({
    userId: new ObjectId(userId),
    type,
    ...data,
    read: false,
    createdAt: new Date(),
  })
  
  // Send email if enabled
  if (await shouldSendEmail(userId, type)) {
    await sendEmailNotification(userId, type, data)
  }
  
  // Send push notification if enabled
  // await sendPushNotification(userId, data)
}

// Real-time notifications with WebSockets or Server-Sent Events
```

---

## 7. Monitoring & Observability

### 7.1 Application Performance Monitoring

**Recommendations:**

```typescript
// lib/monitoring.ts - New file
export async function trackPerformance(
  operation: string,
  handler: () => Promise<any>
) {
  const start = Date.now()
  
  try {
    const result = await handler()
    const duration = Date.now() - start
    
    logger.info({
      operation,
      duration,
      status: 'success',
    })
    
    // Send to monitoring service (e.g., Datadog, New Relic)
    if (process.env.MONITORING_ENABLED === 'true') {
      // trackMetric(`operation.${operation}.duration`, duration)
      // trackMetric(`operation.${operation}.success`, 1)
    }
    
    return result
  } catch (error) {
    const duration = Date.now() - start
    
    logger.error({
      operation,
      duration,
      status: 'error',
      error,
    })
    
    throw error
  }
}

// Usage
export async function GET(req: NextRequest) {
  return trackPerformance('get_jobs', async () => {
    // Handler logic
  })
}
```

---

### 7.2 Health Check Endpoint

**Recommendations:**

```typescript
// app/api/health/route.ts - New file
export async function GET() {
  const checks = {
    database: await checkDatabaseHealth(),
    cache: await checkCacheHealth(),
    storage: await checkStorageHealth(),
  }
  
  const healthy = Object.values(checks).every(c => c === true)
  
  return NextResponse.json({
    status: healthy ? 'healthy' : 'degraded',
    checks,
    timestamp: new Date().toISOString(),
  }, {
    status: healthy ? 200 : 503
  })
}
```

---

## 8. Code Organization Improvements

### 8.1 Service Layer Pattern

**Recommendations:**

```typescript
// services/job-service.ts - New file
export class JobService {
  async createJob(ngoId: string, data: CreateJobData): Promise<JobDoc> {
    // Business logic here
    // Validation, quota checks, etc.
  }
  
  async getJobById(jobId: string): Promise<JobDoc | null> {
    // Caching, enrichment, etc.
  }
  
  async searchJobs(query: string, filters: SearchFilters): Promise<JobDoc[]> {
    // Search logic
  }
}

// API route becomes thin
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return errorResponse("UNAUTHORIZED", "...", {}, 401)
  
  const data = await req.json()
  const job = await jobService.createJob(session.userId, data)
  
  return successResponse(job)
}
```

---

### 8.2 Repository Pattern

**Recommendations:**

```typescript
// repositories/job-repository.ts - New file
export class JobRepository {
  async findById(id: string): Promise<JobDoc | null> {
    const { jobs } = await getCollections()
    return jobs.findOne({ _id: new ObjectId(id) })
  }
  
  async findByNGO(ngoId: string, filters?: JobFilters): Promise<JobDoc[]> {
    // Database queries
  }
  
  async create(data: Omit<JobDoc, '_id'>): Promise<JobDoc> {
    // Insert logic
  }
}

// Service uses repository
export class JobService {
  constructor(private repository: JobRepository) {}
  
  async getJob(id: string): Promise<JobDoc | null> {
    return this.repository.findById(id)
  }
}
```

---

## 9. Testing Infrastructure

### 9.1 Unit Testing Setup

**Recommendations:**

```typescript
// __tests__/services/job-service.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { JobService } from '@/services/job-service'

describe('JobService', () => {
  let service: JobService
  
  beforeEach(() => {
    service = new JobService(mockRepository)
  })
  
  it('should create job with valid data', async () => {
    const job = await service.createJob('ngo-id', validJobData)
    expect(job).toBeDefined()
    expect(job.title).toBe(validJobData.title)
  })
  
  it('should reject job creation when quota exceeded', async () => {
    await expect(
      service.createJob('ngo-id', validJobData)
    ).rejects.toThrow('QUOTA_EXCEEDED')
  })
})
```

---

### 9.2 Integration Testing

**Recommendations:**

```typescript
// __tests__/integration/api/jobs.test.ts
import { testClient } from '@/lib/test-utils'

describe('POST /api/jobs', () => {
  it('should create job for authenticated NGO', async () => {
    const response = await testClient.post('/api/jobs')
      .set('Authorization', `Bearer ${ngoToken}`)
      .send(validJobData)
    
    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
    expect(response.body.data).toHaveProperty('_id')
  })
})
```

---

## 10. Deployment & DevOps

### 10.1 Environment Configuration

**Recommendations:**

```typescript
// lib/env.ts - New file
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  MONGODB_URI: z.string().url(),
  AUTH_SECRET: z.string().min(32),
  REDIS_URL: z.string().url().optional(),
  // ... all env vars
})

export const env = envSchema.parse(process.env)
```

---

### 10.2 CI/CD Pipeline

**Recommendations:**

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run type-check
  
  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run build
  
  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - run: npm run deploy
```

---

## 11. Priority Implementation Roadmap

### Phase 1: Critical (Weeks 1-2)
1. ✅ Database connection pooling
2. ✅ Error handling standardization
3. ✅ API response format consistency
4. ✅ Input sanitization
5. ✅ Basic rate limiting

### Phase 2: High Priority (Weeks 3-4)
1. ✅ Caching implementation
2. ✅ Database indexing
3. ✅ Search enhancement
4. ✅ Transaction support
5. ✅ Health check endpoint

### Phase 3: Medium Priority (Weeks 5-6)
1. ✅ Notification system
2. ✅ Performance monitoring
3. ✅ Service layer refactoring
4. ✅ Image optimization
5. ✅ Enhanced onboarding

### Phase 4: Nice to Have (Weeks 7-8)
1. ✅ Testing infrastructure
2. ✅ CI/CD pipeline
3. ✅ Advanced analytics
4. ✅ WebSocket support
5. ✅ Advanced search features

---

## 12. Metrics & KPIs to Track

1. **Performance Metrics**
   - API response times (p50, p95, p99)
   - Database query times
   - Cache hit rates
   - Page load times

2. **Business Metrics**
   - User signups (daily/weekly)
   - Job postings (daily/weekly)
   - Application conversion rate
   - Plan upgrade rate

3. **Error Metrics**
   - Error rate by endpoint
   - Error rate by type
   - Failed authentication attempts
   - Payment failures

4. **User Engagement**
   - Daily active users
   - Session duration
   - Pages per session
   - Feature adoption rates

---

## Conclusion

These improvements will significantly enhance the platform's:
- **Scalability**: Handle more users and traffic
- **Reliability**: Better error handling and monitoring
- **Performance**: Faster response times and better UX
- **Security**: Enhanced protection against common vulnerabilities
- **Maintainability**: Cleaner code structure and better organization
- **Developer Experience**: Easier to work with and extend

Start with Phase 1 improvements as they provide the most immediate value with minimal risk.

