import { Request, Response, NextFunction } from 'express'
import { sazonAuthMiddleware, sazonOptionalAuthMiddleware } from '../auth'

// Mock Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    auth: {
      getUser: jest.fn()
    }
  }))
}))

// Mock logger
jest.mock('../../utils/logger', () => ({
  SazonLogger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  }
}))

describe('Sazon Authentication Middleware', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let mockNext: NextFunction

  beforeEach(() => {
    mockRequest = {
      headers: {},
      ip: '127.0.0.1',
      get: jest.fn().mockReturnValue('test-user-agent'),
      path: '/api/test'
    }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    mockNext = jest.fn()
  })

  describe('sazonAuthMiddleware', () => {
    it('should return 401 when no authorization header is provided', async () => {
      await sazonAuthMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      )

      expect(mockResponse.status).toHaveBeenCalledWith(401)
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Authentication required',
        message: 'No authorization token provided'
      })
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('should return 401 when authorization header format is invalid', async () => {
      mockRequest.headers = { authorization: 'InvalidFormat token123' }

      await sazonAuthMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      )

      expect(mockResponse.status).toHaveBeenCalledWith(401)
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid authorization format',
        message: 'Authorization header must start with "Bearer "'
      })
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('should return 401 when token is empty', async () => {
      mockRequest.headers = { authorization: 'Bearer ' }

      await sazonAuthMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      )

      expect(mockResponse.status).toHaveBeenCalledWith(401)
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid token',
        message: 'No token provided after Bearer'
      })
      expect(mockNext).not.toHaveBeenCalled()
    })
  })

  describe('sazonOptionalAuthMiddleware', () => {
    it('should continue without authentication when no token is provided', async () => {
      await sazonOptionalAuthMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      )

      expect(mockNext).toHaveBeenCalled()
      expect(mockResponse.status).not.toHaveBeenCalled()
      expect(mockResponse.json).not.toHaveBeenCalled()
    })

    it('should continue without authentication when token format is invalid', async () => {
      mockRequest.headers = { authorization: 'InvalidFormat token123' }

      await sazonOptionalAuthMiddleware(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      )

      expect(mockNext).toHaveBeenCalled()
      expect(mockResponse.status).not.toHaveBeenCalled()
      expect(mockResponse.json).not.toHaveBeenCalled()
    })
  })
}) 