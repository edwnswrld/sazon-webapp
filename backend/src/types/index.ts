// Shared types for Sazon AI backend services

export interface SazonMealPlanRequest {
  dietary_preferences: string[]
  allergies: string[]
  household_size: number
  cooking_skill_level: 'beginner' | 'intermediate' | 'advanced'
  cuisine_preferences: string[]
  meal_count: number
  additional_notes?: string
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
  nutrition_info: SazonNutritionInfo
  tags: string[]
  image_url?: string
}

export interface SazonIngredient {
  name: string
  amount: number
  unit: string
  notes?: string
}

export interface SazonNutritionInfo {
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
}

export interface SazonGroceryItem {
  name: string
  amount: number
  unit: string
  category: string
  estimated_cost: number
  notes?: string
}

// GPT API types
export interface SazonGptRequest {
  model: string
  messages: Array<{
    role: 'system' | 'user' | 'assistant'
    content: string
  }>
  temperature: number
  max_tokens: number
}

export interface SazonGptResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Environment configuration
export interface SazonBackendConfig {
  port: number
  nodeEnv: string
  openaiApiKey: string
  openaiModel: string
  supabaseUrl: string
  supabaseServiceKey: string
  corsOrigin: string
} 