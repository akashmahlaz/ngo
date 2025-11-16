/**
 * Standardized API Error Response Types and Utilities
 * Ensures consistent error handling across all API routes
 */

import { NextResponse } from "next/server"

export type ApiErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "DUPLICATE"
  | "RATE_LIMIT"
  | "SERVER_ERROR"
  | "BAD_REQUEST"
  | "CONFLICT"

export interface ApiError {
  error: string
  code: ApiErrorCode
  details?: unknown
  statusCode: number
}

export interface ApiSuccess<T = unknown> {
  data?: T
  message?: string
  success: true
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError

/**
 * Standard error response codes and messages
 */
export const ERROR_MESSAGES: Record<ApiErrorCode, { status: number; message: string }> = {
  UNAUTHORIZED: { status: 401, message: "Authentication required" },
  FORBIDDEN: { status: 403, message: "Access denied" },
  NOT_FOUND: { status: 404, message: "Resource not found" },
  VALIDATION_ERROR: { status: 400, message: "Invalid input data" },
  DUPLICATE: { status: 409, message: "Resource already exists" },
  RATE_LIMIT: { status: 429, message: "Too many requests" },
  SERVER_ERROR: { status: 500, message: "Internal server error" },
  BAD_REQUEST: { status: 400, message: "Bad request" },
  CONFLICT: { status: 409, message: "Conflict with current state" },
}

/**
 * Create a standardized error response
 */
export function createErrorResponse(
  code: ApiErrorCode,
  customMessage?: string,
  details?: unknown
): NextResponse<ApiError> {
  const errorConfig = ERROR_MESSAGES[code]
  
  return NextResponse.json(
    {
      error: customMessage || errorConfig.message,
      code,
      details,
      statusCode: errorConfig.status,
    },
    { status: errorConfig.status }
  )
}

/**
 * Create a standardized success response
 */
export function createSuccessResponse<T = unknown>(
  data?: T,
  message?: string,
  status = 200
): NextResponse<ApiSuccess<T>> {
  return NextResponse.json(
    {
      success: true,
      ...(data !== undefined && { data }),
      ...(message && { message }),
    },
    { status }
  )
}

/**
 * Handle Zod validation errors
 */
export function handleValidationError(error: unknown): NextResponse<ApiError> {
  if (error && typeof error === "object" && "issues" in error) {
    const issues = (error as { issues: Array<{ message: string; path: string[] }> }).issues
    const firstIssue = issues[0]
    
    return createErrorResponse(
      "VALIDATION_ERROR",
      firstIssue?.message || "Validation failed",
      issues
    )
  }
  
  return createErrorResponse("VALIDATION_ERROR")
}

/**
 * Handle database errors
 */
export function handleDatabaseError(error: unknown): NextResponse<ApiError> {
  console.error("Database error:", error)
  
  // MongoDB duplicate key error
  if (error && typeof error === "object" && "code" in error && error.code === 11000) {
    return createErrorResponse("DUPLICATE", "A record with this information already exists")
  }
  
  return createErrorResponse("SERVER_ERROR", "Database operation failed")
}

/**
 * Generic error handler for try-catch blocks
 */
export function handleApiError(error: unknown): NextResponse<ApiError> {
  console.error("API error:", error)
  
  // Check if it's already a standardized error response
  if (error instanceof NextResponse) {
    return error
  }
  
  // Check for specific error types
  if (error && typeof error === "object") {
    // Zod validation error
    if ("issues" in error) {
      return handleValidationError(error)
    }
    
    // MongoDB error
    if ("code" in error && typeof error.code === "number") {
      return handleDatabaseError(error)
    }
    
    // Error with message
    if ("message" in error && typeof error.message === "string") {
      return createErrorResponse("SERVER_ERROR", error.message)
    }
  }
  
  // Default server error
  return createErrorResponse("SERVER_ERROR")
}

/**
 * Middleware to wrap API routes with standardized error handling
 */
export function withErrorHandling<T = unknown>(
  handler: () => Promise<NextResponse<ApiSuccess<T>>>
): Promise<NextResponse<ApiResponse<T>>> {
  return handler().catch((error) => handleApiError(error))
}

/**
 * Common error responses for reuse
 */
export const commonErrors = {
  unauthorized: () => createErrorResponse("UNAUTHORIZED"),
  forbidden: (message?: string) => createErrorResponse("FORBIDDEN", message),
  notFound: (resource?: string) => 
    createErrorResponse("NOT_FOUND", resource ? `${resource} not found` : undefined),
  validation: (message?: string) => createErrorResponse("VALIDATION_ERROR", message),
  duplicate: (field?: string) => 
    createErrorResponse("DUPLICATE", field ? `${field} already exists` : undefined),
  rateLimit: () => createErrorResponse("RATE_LIMIT"),
  serverError: (message?: string) => createErrorResponse("SERVER_ERROR", message),
  badRequest: (message?: string) => createErrorResponse("BAD_REQUEST", message),
}

/**
 * Common success responses for reuse
 */
export const commonSuccess = {
  ok: (message?: string) => createSuccessResponse(undefined, message || "Success"),
  created: <T>(data: T, message?: string) => createSuccessResponse(data, message || "Created successfully", 201),
  updated: <T>(data: T, message?: string) => createSuccessResponse(data, message || "Updated successfully"),
  deleted: (message?: string) => createSuccessResponse(undefined, message || "Deleted successfully"),
}
