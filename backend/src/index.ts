import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { sazonBackendConfig, isDevelopment } from './config/index.js'
import { SazonMealPlanningController } from './controllers/mealPlanningController.js'
import { sazonErrorHandler, notFoundHandler, asyncHandler } from './middleware/errorHandler.js'
import { sazonAuthMiddleware, sazonOptionalAuthMiddleware } from './middleware/auth.js'
import { SazonLogger } from './utils/logger.js'

/**
 * Main Express application for Sazon AI backend
 * Sets up middleware, routes, and error handling
 */
class SazonBackendApp {
  private app: express.Application
  private readonly port: number

  constructor() {
    this.app = express()
    this.port = sazonBackendConfig.port
    this.setupMiddleware()
    this.setupRoutes()
    this.setupErrorHandling()
  }

  /**
   * Sets up middleware for the Express application
   */
  private setupMiddleware(): void {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
    }))

    // CORS configuration
    this.app.use(cors({
      origin: sazonBackendConfig.corsOrigin,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }))

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }))
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }))

    // Request logging middleware
    this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
      const start = Date.now()
      res.on('finish', () => {
        const duration = Date.now() - start
        SazonLogger.request(req.method, req.url, res.statusCode, duration)
      })
      next()
    })
  }

  /**
   * Sets up API routes for the application
   */
  private setupRoutes(): void {
    const mealPlanningController = new SazonMealPlanningController()

    // Health check endpoint (public)
    this.app.get('/api/health', asyncHandler(mealPlanningController.healthCheck.bind(mealPlanningController)))

    // Protected meal planning routes (require authentication)
    this.app.post('/api/meal-plan/generate', 
      sazonAuthMiddleware, 
      asyncHandler(mealPlanningController.generateMealPlan.bind(mealPlanningController))
    )
    
    // Mock endpoint (optional authentication for development)
    this.app.post('/api/meal-plan/mock', 
      sazonOptionalAuthMiddleware, 
      asyncHandler(mealPlanningController.generateMockMealPlan.bind(mealPlanningController))
    )

    // Root endpoint (public)
    this.app.get('/', (req: express.Request, res: express.Response) => {
      res.json({
        message: 'Sazon AI Backend API',
        version: '1.0.0',
        environment: sazonBackendConfig.nodeEnv,
        timestamp: new Date().toISOString()
      })
    })
  }

  /**
   * Sets up error handling middleware
   */
  private setupErrorHandling(): void {
    // 404 handler for unmatched routes
    this.app.use(notFoundHandler)

    // Global error handler
    this.app.use(sazonErrorHandler)
  }

  /**
   * Starts the Express server
   */
  public start(): void {
    this.app.listen(this.port, () => {
      SazonLogger.info(`🚀 Sazon AI Backend server is running on port ${this.port}`)
      SazonLogger.info(`📊 Environment: ${sazonBackendConfig.nodeEnv}`)
      SazonLogger.info(`🔗 CORS Origin: ${sazonBackendConfig.corsOrigin}`)
      SazonLogger.info(`⏰ Started at: ${new Date().toISOString()}`)
      
      if (isDevelopment()) {
        SazonLogger.info(`🔧 Development mode enabled`)
        SazonLogger.info(`🎭 Mock endpoint available at: POST /api/meal-plan/mock`)
      }
    })
  }

  /**
   * Gracefully shuts down the server
   */
  public shutdown(): void {
    SazonLogger.info('\n🛑 Shutting down Sazon AI Backend server...')
    process.exit(0)
  }
}

// Create and start the application
const sazonBackendApp = new SazonBackendApp()

// Handle graceful shutdown
process.on('SIGTERM', () => {
  SazonLogger.info('SIGTERM received, shutting down gracefully')
  sazonBackendApp.shutdown()
})

process.on('SIGINT', () => {
  SazonLogger.info('SIGINT received, shutting down gracefully')
  sazonBackendApp.shutdown()
})

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  SazonLogger.error('Uncaught Exception:', error)
  process.exit(1)
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  SazonLogger.error('Unhandled Rejection', {
    promise: promise.toString(),
    reason: reason instanceof Error ? reason.message : String(reason)
  })
  process.exit(1)
})

// Start the server
sazonBackendApp.start() 