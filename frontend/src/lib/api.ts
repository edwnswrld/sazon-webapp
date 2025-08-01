import { supabaseClient } from './supabaseClient'

// Helper function to get the current session token
const getAuthToken = async (): Promise<string | null> => {
  try {
    const { data: { session } } = await supabaseClient.auth.getSession()
    return session?.access_token || null
  } catch (error) {
    console.error('Error getting auth token:', error)
    return null
  }
}

export interface SazonMealPlanRequest {
  dietary_preferences: string[]
  allergies: string[]
  household_size: number
  cooking_skill_level: 'beginner' | 'intermediate' | 'advanced'
  cuisine_preferences?: string[]
  meal_count?: number
}

export interface SazonMealPlanResponse {
  meals: SazonMeal[]
  grocery_list: SazonGroceryItem[]
  total_estimated_cost: number
  preparation_time: string
  difficulty_level: string
}

export interface SazonMeal {
  id: string
  name: string
  description: string
  ingredients: SazonIngredient[]
  instructions: string[]
  prep_time: number
  cook_time: number
  servings: number
  nutrition_info: {
    calories: number
    protein: number
    carbs: number
    fat: number
    fiber: number
  }
  tags: string[]
  image_url?: string
}

export interface SazonIngredient {
  name: string
  amount: number
  unit: string
  notes?: string
}

export interface SazonGroceryItem {
  name: string
  amount: number
  unit: string
  category: string
  estimated_cost: number
  notes?: string
}

export interface SazonApiError {
  message: string
  code: string
  details?: any
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

export const generateMealPlan = async (
  request: SazonMealPlanRequest
): Promise<{ data: SazonMealPlanResponse | null; error: SazonApiError | null }> => {
  try {
    const authToken = await getAuthToken()
    
    if (!authToken) {
      return {
        data: null,
        error: {
          message: 'Authentication required',
          code: 'AUTH_REQUIRED',
          details: 'No valid authentication token found'
        }
      }
    }

    const response = await fetch(`${API_BASE_URL}/meal-plan/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return {
        data: null,
        error: {
          message: errorData.message || 'Failed to generate meal plan',
          code: errorData.code || 'GENERATION_FAILED',
          details: errorData.details,
        },
      }
    }

    const data = await response.json()
    return { data, error: null }
  } catch (error) {
    return {
      data: null,
      error: {
        message: 'Network error occurred while generating meal plan',
        code: 'NETWORK_ERROR',
        details: error,
      },
    }
  }
}

export const saveMealPlan = async (
  mealPlan: SazonMealPlanResponse,
  userId: string
): Promise<{ data: any | null; error: SazonApiError | null }> => {
  try {
    const authToken = await getAuthToken()
    
    if (!authToken) {
      return {
        data: null,
        error: {
          message: 'Authentication required',
          code: 'AUTH_REQUIRED',
          details: 'No valid authentication token found'
        }
      }
    }

    const response = await fetch(`${API_BASE_URL}/meal-plan/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        meal_plan: mealPlan,
        user_id: userId,
        created_at: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return {
        data: null,
        error: {
          message: errorData.message || 'Failed to save meal plan',
          code: errorData.code || 'SAVE_FAILED',
          details: errorData.details,
        },
      }
    }

    const data = await response.json()
    return { data, error: null }
  } catch (error) {
    return {
      data: null,
      error: {
        message: 'Network error occurred while saving meal plan',
        code: 'NETWORK_ERROR',
        details: error,
      },
    }
  }
}

export const getSavedMealPlans = async (
  userId: string
): Promise<{ data: SazonMealPlanResponse[] | null; error: SazonApiError | null }> => {
  try {
    const authToken = await getAuthToken()
    
    if (!authToken) {
      return {
        data: null,
        error: {
          message: 'Authentication required',
          code: 'AUTH_REQUIRED',
          details: 'No valid authentication token found'
        }
      }
    }

    const response = await fetch(`${API_BASE_URL}/meal-plan/saved?user_id=${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return {
        data: null,
        error: {
          message: errorData.message || 'Failed to fetch saved meal plans',
          code: errorData.code || 'FETCH_FAILED',
          details: errorData.details,
        },
      }
    }

    const data = await response.json()
    return { data, error: null }
  } catch (error) {
    return {
      data: null,
      error: {
        message: 'Network error occurred while fetching saved meal plans',
        code: 'NETWORK_ERROR',
        details: error,
      },
    }
  }
}

export const updateMealPlanPreferences = async (
  userId: string,
  preferences: Partial<SazonMealPlanRequest>
): Promise<{ data: any | null; error: SazonApiError | null }> => {
  try {
    const authToken = await getAuthToken()
    
    if (!authToken) {
      return {
        data: null,
        error: {
          message: 'Authentication required',
          code: 'AUTH_REQUIRED',
          details: 'No valid authentication token found'
        }
      }
    }

    const response = await fetch(`${API_BASE_URL}/meal-plan/preferences`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        user_id: userId,
        preferences,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return {
        data: null,
        error: {
          message: errorData.message || 'Failed to update preferences',
          code: errorData.code || 'UPDATE_FAILED',
          details: errorData.details,
        },
      }
    }

    const data = await response.json()
    return { data, error: null }
  } catch (error) {
    return {
      data: null,
      error: {
        message: 'Network error occurred while updating preferences',
        code: 'NETWORK_ERROR',
        details: error,
      },
    }
  }
} 

/**
 * Generates a mock meal plan for development and testing purposes
 * This endpoint uses optional authentication (works with or without auth token)
 */
export const generateMockMealPlan = async (
  request: SazonMealPlanRequest
): Promise<{ data: SazonMealPlanResponse | null; error: SazonApiError | null }> => {
  try {
    const authToken = await getAuthToken()
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    
    // Add auth token if available (optional for mock endpoint)
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`
    }

    const response = await fetch(`${API_BASE_URL}/meal-plan/mock`, {
      method: 'POST',
      headers,
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return {
        data: null,
        error: {
          message: errorData.message || 'Failed to generate mock meal plan',
          code: errorData.code || 'MOCK_GENERATION_FAILED',
          details: errorData.details,
        },
      }
    }

    const data = await response.json()
    return { data, error: null }
  } catch (error) {
    return {
      data: null,
      error: {
        message: 'Network error occurred while generating mock meal plan',
        code: 'NETWORK_ERROR',
        details: error,
      },
    }
  }
} 