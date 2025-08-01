import { Request, Response } from 'express'
import { SazonMealPlanningService } from '../services/mealPlanningService.js'
import { SazonMealPlanRequest, ApiResponse, SazonMealPlanResponse } from '../types/index.js'
import { isDevelopment } from '../config/index.js'
import { SazonLogger } from '../utils/logger.js'

/**
 * Controller for handling meal planning API endpoints
 * Provides RESTful API endpoints for meal planning operations
 */
export class SazonMealPlanningController {
  private readonly mealPlanningService: SazonMealPlanningService

  constructor() {
    this.mealPlanningService = new SazonMealPlanningService()
  }

  /**
   * Generates a meal plan based on user preferences
   * POST /api/meal-plan/generate
   */
  public async generateMealPlan(req: Request, res: Response): Promise<void> {
    try {
      const mealPlanRequest: SazonMealPlanRequest = req.body
      const userId = req.user?.id
      const userEmail = req.user?.email

      // Log the meal plan generation request with user context
      SazonLogger.info('Meal plan generation requested', {
        userId,
        userEmail,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        mealCount: mealPlanRequest.meal_count,
        householdSize: mealPlanRequest.household_size,
        cookingSkillLevel: mealPlanRequest.cooking_skill_level
      })

      // Validate required fields
      if (!this.validateMealPlanRequest(mealPlanRequest)) {
        SazonLogger.warn('Meal plan request validation failed', {
          userId,
          userEmail,
          ip: req.ip,
          requestBody: mealPlanRequest
        })
        
        const errorResponse: ApiResponse<null> = {
          success: false,
          error: 'Invalid request data. Please provide all required fields.',
          message: 'Validation failed'
        }
        res.status(400).json(errorResponse)
        return
      }

      // Generate meal plan
      let mealPlanResponse: SazonMealPlanResponse
      
      if (isDevelopment() && req.query['mock'] === 'true') {
        // Use mock data in development mode when requested
        SazonLogger.info('Using mock meal plan generation (development mode)', {
          userId,
          userEmail
        })
        mealPlanResponse = this.mealPlanningService.generateMockMealPlan(mealPlanRequest)
      } else {
        // Use real GPT API
        SazonLogger.info('Generating meal plan with GPT API', {
          userId,
          userEmail
        })
        mealPlanResponse = await this.mealPlanningService.generateMealPlan(mealPlanRequest)
      }

      // Log successful meal plan generation
      SazonLogger.info('Meal plan generated successfully', {
        userId,
        userEmail,
        mealCount: mealPlanResponse.meals.length,
        totalCost: mealPlanResponse.total_estimated_cost,
        preparationTime: mealPlanResponse.preparation_time
      })

      const successResponse: ApiResponse<SazonMealPlanResponse> = {
        success: true,
        data: mealPlanResponse,
        message: 'Meal plan generated successfully'
      }

      res.status(200).json(successResponse)
    } catch (error) {
      SazonLogger.error('Error in generateMealPlan controller', {
        userId: req.user?.id,
        userEmail: req.user?.email,
        ip: req.ip,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      })
      
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        message: 'Failed to generate meal plan'
      }

      res.status(500).json(errorResponse)
    }
  }

  /**
   * Generates a mock meal plan for testing purposes
   * POST /api/meal-plan/mock
   */
  public async generateMockMealPlan(req: Request, res: Response): Promise<void> {
    try {
      const mealPlanRequest: SazonMealPlanRequest = req.body
      const userId = req.user?.id
      const userEmail = req.user?.email

      // Log the mock meal plan generation request
      SazonLogger.info('Mock meal plan generation requested', {
        userId,
        userEmail,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        mealCount: mealPlanRequest.meal_count,
        householdSize: mealPlanRequest.household_size,
        cookingSkillLevel: mealPlanRequest.cooking_skill_level
      })

      // Validate required fields
      if (!this.validateMealPlanRequest(mealPlanRequest)) {
        SazonLogger.warn('Mock meal plan request validation failed', {
          userId,
          userEmail,
          ip: req.ip,
          requestBody: mealPlanRequest
        })
        
        const errorResponse: ApiResponse<null> = {
          success: false,
          error: 'Invalid request data. Please provide all required fields.',
          message: 'Validation failed'
        }
        res.status(400).json(errorResponse)
        return
      }

      // Generate mock meal plan
      const mealPlanResponse = this.mealPlanningService.generateMockMealPlan(mealPlanRequest)

      // Log successful mock meal plan generation
      SazonLogger.info('Mock meal plan generated successfully', {
        userId,
        userEmail,
        mealCount: mealPlanResponse.meals.length,
        totalCost: mealPlanResponse.total_estimated_cost,
        preparationTime: mealPlanResponse.preparation_time
      })

      const successResponse: ApiResponse<SazonMealPlanResponse> = {
        success: true,
        data: mealPlanResponse,
        message: 'Mock meal plan generated successfully'
      }

      res.status(200).json(successResponse)
    } catch (error) {
      SazonLogger.error('Error in generateMockMealPlan controller', {
        userId: req.user?.id,
        userEmail: req.user?.email,
        ip: req.ip,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      })
      
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        message: 'Failed to generate mock meal plan'
      }

      res.status(500).json(errorResponse)
    }
  }

  /**
   * Health check endpoint
   * GET /api/meal-plan/health
   */
  public async healthCheck(req: Request, res: Response): Promise<void> {
    const healthResponse: ApiResponse<{ status: string; timestamp: string }> = {
      success: true,
      data: {
        status: 'healthy',
        timestamp: new Date().toISOString()
      },
      message: 'Meal planning service is running'
    }

    res.status(200).json(healthResponse)
  }

  /**
   * Validates the meal plan request data
   * @param request - The meal plan request to validate
   * @returns boolean - True if valid, false otherwise
   */
  private validateMealPlanRequest(request: any): request is SazonMealPlanRequest {
    // Check if all required fields are present
    const requiredFields = [
      'dietary_preferences',
      'allergies', 
      'household_size',
      'cooking_skill_level',
      'cuisine_preferences',
      'meal_count'
    ]

    for (const field of requiredFields) {
      if (!(field in request)) {
        console.error(`Missing required field: ${field}`)
        return false
      }
    }

    // Validate field types and values
    if (!Array.isArray(request.dietary_preferences)) {
      console.error('dietary_preferences must be an array')
      return false
    }

    if (!Array.isArray(request.allergies)) {
      console.error('allergies must be an array')
      return false
    }

    if (typeof request.household_size !== 'number' || request.household_size < 1) {
      console.error('household_size must be a positive number')
      return false
    }

    const validCookingLevels = ['beginner', 'intermediate', 'advanced']
    if (!validCookingLevels.includes(request.cooking_skill_level)) {
      console.error('cooking_skill_level must be one of: beginner, intermediate, advanced')
      return false
    }

    if (!Array.isArray(request.cuisine_preferences)) {
      console.error('cuisine_preferences must be an array')
      return false
    }

    if (typeof request.meal_count !== 'number' || request.meal_count < 1) {
      console.error('meal_count must be a positive number')
      return false
    }

    return true
  }
} 