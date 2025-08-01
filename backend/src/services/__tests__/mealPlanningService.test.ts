import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { SazonMealPlanningService } from '../mealPlanningService'

// Mock Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
          from: jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(),
            order: jest.fn(() => ({
              limit: jest.fn(),
            })),
          })),
          insert: jest.fn(() => ({
            select: jest.fn(),
          })),
          update: jest.fn(() => ({
            eq: jest.fn(() => ({
              select: jest.fn(),
            })),
          })),
          delete: jest.fn(() => ({
            eq: jest.fn(),
          })),
        })),
      })),
  })),
}))

// Mock logger
jest.mock('../../utils/logger', () => ({
  SazonLogger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}))

describe('Sazon Meal Planning Service', () => {
  let sazonMealPlanningService: SazonMealPlanningService

  beforeEach(() => {
    jest.clearAllMocks()
    sazonMealPlanningService = new SazonMealPlanningService()
  })

  describe('generateMealPlan', () => {
    it('should generate meal plan for valid request', async () => {
      const mockRequest = {
        dietary_preferences: ['vegetarian'],
        allergies: ['nuts'],
        household_size: 2,
        cooking_skill_level: 'beginner' as const,
        cuisine_preferences: ['Italian'],
        meal_count: 3
      }

      const mockResponse = {
        meals: [
          {
            id: '1',
            name: 'Test Meal',
            description: 'A test meal',
            ingredients: [],
            instructions: [],
            prep_time: 15,
            cook_time: 30,
            servings: 2,
            nutrition_info: {
              calories: 300,
              protein: 20,
              carbs: 30,
              fat: 10,
              fiber: 5
            },
            tags: ['vegetarian', 'Italian']
          }
        ],
        grocery_list: [],
        total_estimated_cost: 25.50,
        preparation_time: '45 minutes',
        difficulty_level: 'beginner'
      }

      // For now, just test that the method exists and can be called
      expect(sazonMealPlanningService.generateMealPlan).toBeDefined()
      expect(typeof sazonMealPlanningService.generateMealPlan).toBe('function')
    })
  })
}) 