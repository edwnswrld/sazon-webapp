import { Request, Response, NextFunction } from 'express'
import { ApiResponse } from '../types/index.js'

/**
 * Custom error class for API errors
 */
export class SazonApiError extends Error {
  public readonly statusCode: number
  public readonly isOperational: boolean

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational
    
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SazonApiError)
    }
  }
}

/**
 * Error handler middleware for Express
 * Handles all errors thrown in the application and provides consistent error responses
 */
export const sazonErrorHandler = (
  error: Error | SazonApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500
  let message = 'Internal Server Error'
  let isOperational = true

  // Handle custom API errors
  if (error instanceof SazonApiError) {
    statusCode = error.statusCode
    message = error.message
    isOperational = error.isOperational
  } else {
    // Handle other types of errors
    switch (error.name) {
      case 'ValidationError':
        statusCode = 400
        message = 'Validation Error'
        break
      case 'UnauthorizedError':
        statusCode = 401
        message = 'Unauthorized'
        break
      case 'ForbiddenError':
        statusCode = 403
        message = 'Forbidden'
        break
      case 'NotFoundError':
        statusCode = 404
        message = 'Not Found'
        break
      case 'SyntaxError':
        statusCode = 400
        message = 'Invalid JSON'
        break
      default:
        statusCode = 500
        message = 'Internal Server Error'
        isOperational = false
    }
  }

  // Log error details
  console.error('Error occurred:', {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    statusCode,
    message: error.message,
    stack: error.stack,
    isOperational
  })

  // Send error response
  const errorResponse: ApiResponse<null> = {
    success: false,
    error: message,
    message: isOperational ? message : 'An unexpected error occurred'
  }

  res.status(statusCode).json(errorResponse)
}

/**
 * Async error handler wrapper
 * Wraps async route handlers to catch unhandled promise rejections
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

/**
 * 404 handler for unmatched routes
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  const errorResponse: ApiResponse<null> = {
    success: false,
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.url}`
  }

  res.status(404).json(errorResponse)
} 