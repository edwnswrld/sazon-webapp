import { Request, Response, NextFunction } from 'express'
import { createClient } from '@supabase/supabase-js'
import { sazonBackendConfig } from '../config/index'
import { SazonLogger } from '../utils/logger'

// Create Supabase client with service role key for backend operations
const supabaseAdminClient = createClient(
  sazonBackendConfig.supabaseUrl,
  sazonBackendConfig.supabaseServiceKey
)

// Extend Express Request interface to include user information
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        email: string
        role?: string
        metadata?: any
      }
    }
  }
}

/**
 * Authentication middleware for validating Supabase JWT tokens
 * This middleware extracts the JWT token from the Authorization header
 * and validates it against Supabase to ensure the request is from an authenticated user
 */
export const sazonAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization
    
    if (!authHeader) {
      SazonLogger.warn('Authentication failed: No authorization header provided', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path
      })
      
      res.status(401).json({
        success: false,
        error: 'Authentication required',
        message: 'No authorization token provided'
      })
      return
    }

    // Check if the header starts with 'Bearer '
    if (!authHeader.startsWith('Bearer ')) {
      SazonLogger.warn('Authentication failed: Invalid authorization header format', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path
      })
      
      res.status(401).json({
        success: false,
        error: 'Invalid authorization format',
        message: 'Authorization header must start with "Bearer "'
      })
      return
    }

    // Extract the token (remove 'Bearer ' prefix)
    const token = authHeader.substring(7)

    if (!token) {
      SazonLogger.warn('Authentication failed: Empty token provided', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path
      })
      
      res.status(401).json({
        success: false,
        error: 'Invalid token',
        message: 'No token provided after Bearer'
      })
      return
    }

    // Verify the JWT token with Supabase
    const { data: { user }, error } = await supabaseAdminClient.auth.getUser(token)

    if (error || !user) {
      SazonLogger.warn('Authentication failed: Invalid or expired token', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
        error: error?.message
      })
      
      res.status(401).json({
        success: false,
        error: 'Authentication failed',
        message: error?.message || 'Invalid or expired token'
      })
      return
    }

    // Check if user email is confirmed (if email confirmation is required)
    if (!user.email_confirmed_at) {
      SazonLogger.warn('Authentication failed: Email not confirmed', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
        userId: user.id
      })
      
      res.status(403).json({
        success: false,
        error: 'Email not confirmed',
        message: 'Please confirm your email address before accessing this resource'
      })
      return
    }

    // Attach user information to the request object
    req.user = {
      id: user.id,
      email: user.email!,
      ...(typeof user.role === 'string' ? { role: user.role } : {}),
      metadata: user.user_metadata
    }

    // Log successful authentication
    SazonLogger.info('Authentication successful', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      path: req.path,
      userId: user.id,
      userEmail: user.email
    })

    // Continue to the next middleware or route handler
    next()
  } catch (error) {
    SazonLogger.error('Authentication middleware error', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      path: req.path,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'An error occurred during authentication'
    })
  }
}

/**
 * Optional authentication middleware that doesn't block requests
 * but still attaches user information if a valid token is provided
 */
export const sazonOptionalAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No token provided, continue without authentication
      next()
      return
    }

    const token = authHeader.substring(7)

    if (!token) {
      // Empty token, continue without authentication
      next()
      return
    }

    // Try to verify the token, but don't fail if it's invalid
    const { data: { user }, error } = await supabaseAdminClient.auth.getUser(token)

    if (!error && user && user.email_confirmed_at) {
      // Valid token, attach user information
      req.user = {
        id: user.id,
        email: user.email!,
        ...(typeof user.role === 'string' ? { role: user.role } : {}),
        metadata: user.user_metadata
      }
      
      SazonLogger.info('Optional authentication successful', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
        userId: user.id,
        userEmail: user.email
      })
    }

    // Always continue, regardless of authentication status
    next()
  } catch (error) {
    SazonLogger.error('Optional authentication middleware error', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      path: req.path,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    
    // Continue even if there's an error
    next()
  }
}

/**
 * Role-based authorization middleware
 * Checks if the authenticated user has the required role
 */
export const sazonRequireRole = (requiredRole: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
        message: 'User must be authenticated to access this resource'
      })
      return
    }

    if (req.user.role !== requiredRole) {
      SazonLogger.warn('Authorization failed: Insufficient role', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
        userId: req.user.id,
        userRole: req.user.role,
        requiredRole
      })
      
      res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
        message: `Role '${requiredRole}' is required to access this resource`
      })
      return
    }

    next()
  }
}

/**
 * Admin-only authorization middleware
 * Checks if the authenticated user has admin role
 */
export const sazonRequireAdmin = sazonRequireRole('admin')

/**
 * Rate limiting helper for authentication attempts
 * This can be used to prevent brute force attacks
 */
export const sazonAuthRateLimit = {
  attempts: new Map<string, { count: number; resetTime: number }>(),
  
  checkLimit: (identifier: string, maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000): boolean => {
    const now = Date.now()
    const record = sazonAuthRateLimit.attempts.get(identifier)
    
    if (!record || now > record.resetTime) {
      // First attempt or window expired
      sazonAuthRateLimit.attempts.set(identifier, {
        count: 1,
        resetTime: now + windowMs
      })
      return true
    }
    
    if (record.count >= maxAttempts) {
      return false // Rate limit exceeded
    }
    
    // Increment attempt count
    record.count++
    return true
  },
  
  clearLimit: (identifier: string): void => {
    sazonAuthRateLimit.attempts.delete(identifier)
  }
} 