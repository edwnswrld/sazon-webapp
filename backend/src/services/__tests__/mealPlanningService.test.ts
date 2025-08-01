import { describe, it, expect, beforeEach, vi } from '@jest/globals'
import { sazonMealPlanningService } from '../mealPlanningService.js'

// Mock Supabase client
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(),
          order: vi.fn(() => ({
            limit: vi.fn(),
          })),
        })),
        insert: vi.fn(() => ({
          select: vi.fn(),
        })),
        update: vi.fn(() => ({
          eq: vi.fn(() => ({
            select: vi.fn(),
          })),
        })),
        delete: vi.fn(() => ({
          eq: vi.fn(),
        })),
      })),
    })),
  })),
}))

// Mock logger
vi.mock('../../utils/logger.js', () => ({
  SazonLogger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}))

describe('Sazon Meal Planning Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('sazonGetMealPlan', () => {
    it('should return meal plan for valid user ID', async () => {
      const mockMealPlan = {
        id: '1',
        userId: 'user123',
        weekStart: '2024-01-01',
        meals: [
          {
            day: 'monday',
            mealType: 'dinner',
            recipeId: 'recipe1',
            recipeName: 'Test Recipe',
          },
        ],
      }

      // Mock the Supabase response
      const mockSupabase = {
        from: vi.fn(() => ({
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              single: vi.fn().mockResolvedValue({ data: mockMealPlan, error: null }),
            })),
          })),
        })),
      }

      vi.mocked(require('@supabase/supabase-js').createClient).mockReturnValue(mockSupabase)

      const result = await sazonMealPlanningService.sazonGetMealPlan('user123', '2024-01-01')

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockMealPlan)
    })

    it('should handle database errors gracefully', async () => {
      const mockError = new Error('Database connection failed')

      const mockSupabase = {
        from: vi.fn(() => ({
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              single: vi.fn().mockResolvedValue({ data: null, error: mockError }),
            })),
          })),
        })),
      }

      vi.mocked(require('@supabase/supabase-js').createClient).mockReturnValue(mockSupabase)

      const result = await sazonMealPlanningService.sazonGetMealPlan('user123', '2024-01-01')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Failed to fetch meal plan')
    })

    it('should validate input parameters', async () => {
      const result = await sazonMealPlanningService.sazonGetMealPlan('', '2024-01-01')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Invalid user ID or week start date')
    })
  })

  describe('sazonCreateMealPlan', () => {
    it('should create meal plan successfully', async () => {
      const mockMealPlanData = {
        userId: 'user123',
        weekStart: '2024-01-01',
        meals: [
          {
            day: 'monday',
            mealType: 'dinner',
            recipeId: 'recipe1',
            recipeName: 'Test Recipe',
          },
        ],
      }

      const mockCreatedMealPlan = {
        id: '1',
        ...mockMealPlanData,
        createdAt: '2024-01-01T00:00:00Z',
      }

      const mockSupabase = {
        from: vi.fn(() => ({
          select: vi.fn(() => ({
            insert: vi.fn(() => ({
              select: vi.fn().mockResolvedValue({ data: [mockCreatedMealPlan], error: null }),
            })),
          })),
        })),
      }

      vi.mocked(require('@supabase/supabase-js').createClient).mockReturnValue(mockSupabase)

      const result = await sazonMealPlanningService.sazonCreateMealPlan(mockMealPlanData)

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockCreatedMealPlan)
    })

    it('should handle creation errors', async () => {
      const mockMealPlanData = {
        userId: 'user123',
        weekStart: '2024-01-01',
        meals: [],
      }

      const mockError = new Error('Insert failed')

      const mockSupabase = {
        from: vi.fn(() => ({
          select: vi.fn(() => ({
            insert: vi.fn(() => ({
              select: vi.fn().mockResolvedValue({ data: null, error: mockError }),
            })),
          })),
        })),
      }

      vi.mocked(require('@supabase/supabase-js').createClient).mockReturnValue(mockSupabase)

      const result = await sazonMealPlanningService.sazonCreateMealPlan(mockMealPlanData)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Failed to create meal plan')
    })
  })

  describe('sazonUpdateMealPlan', () => {
    it('should update meal plan successfully', async () => {
      const mockUpdateData = {
        meals: [
          {
            day: 'monday',
            mealType: 'dinner',
            recipeId: 'recipe2',
            recipeName: 'Updated Recipe',
          },
        ],
      }

      const mockUpdatedMealPlan = {
        id: '1',
        userId: 'user123',
        weekStart: '2024-01-01',
        ...mockUpdateData,
        updatedAt: '2024-01-01T00:00:00Z',
      }

      const mockSupabase = {
        from: vi.fn(() => ({
          select: vi.fn(() => ({
            update: vi.fn(() => ({
              eq: vi.fn(() => ({
                select: vi.fn().mockResolvedValue({ data: [mockUpdatedMealPlan], error: null }),
              })),
            })),
          })),
        })),
      }

      vi.mocked(require('@supabase/supabase-js').createClient).mockReturnValue(mockSupabase)

      const result = await sazonMealPlanningService.sazonUpdateMealPlan('1', mockUpdateData)

      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockUpdatedMealPlan)
    })
  })

  describe('sazonDeleteMealPlan', () => {
    it('should delete meal plan successfully', async () => {
      const mockSupabase = {
        from: vi.fn(() => ({
          select: vi.fn(() => ({
            delete: vi.fn(() => ({
              eq: vi.fn().mockResolvedValue({ data: null, error: null }),
            })),
          })),
        })),
      }

      vi.mocked(require('@supabase/supabase-js').createClient).mockReturnValue(mockSupabase)

      const result = await sazonMealPlanningService.sazonDeleteMealPlan('1')

      expect(result.success).toBe(true)
      expect(result.message).toBe('Meal plan deleted successfully')
    })
  })
}) 