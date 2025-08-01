import OpenAI from 'openai'
import { 
  SazonMealPlanRequest, 
  SazonMealPlanResponse, 
  SazonMeal, 
  SazonGroceryItem,
  SazonGptRequest,
  SazonGptResponse
} from '../types/index.js'
import { sazonBackendConfig } from '../config/index.js'

/**
 * Service class for handling meal planning operations
 * This service integrates with OpenAI's GPT API to generate personalized meal plans
 */
export class SazonMealPlanningService {
  private readonly openaiClient: OpenAI
  private readonly gptModel: string

  constructor() {
    this.openaiClient = new OpenAI({
      apiKey: sazonBackendConfig.openaiApiKey
    })
    this.gptModel = sazonBackendConfig.openaiModel
  }

  /**
   * Generates a personalized meal plan based on user preferences
   * @param request - The meal plan request containing user preferences
   * @returns Promise<SazonMealPlanResponse> - The generated meal plan
   */
  public async generateMealPlan(request: SazonMealPlanRequest): Promise<SazonMealPlanResponse> {
    try {
      const prompt = this.generatePrompt(request)
      
      const gptRequest: SazonGptRequest = {
        model: this.gptModel,
        messages: [
          {
            role: 'system',
            content: 'You are Sazon AI, a professional meal planning assistant. Always respond with valid JSON in the exact format requested.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000
      }

      const response = await this.callGptApi(gptRequest)
      const content = response.choices[0]?.message?.content
      
      if (!content) {
        throw new Error('No response content received from GPT API')
      }

      return this.parseGptResponse(content)
    } catch (error) {
      console.error('Error generating meal plan:', error)
      throw new Error(`Failed to generate meal plan: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Generates a mock meal plan for development and testing purposes
   * @param request - The meal plan request containing user preferences
   * @returns SazonMealPlanResponse - A mock meal plan
   */
  public generateMockMealPlan(request: SazonMealPlanRequest): SazonMealPlanResponse {
    const mockMeals: SazonMeal[] = [
      {
        id: 'mock_meal_1',
        name: 'Grilled Chicken with Roasted Vegetables',
        description: 'A healthy and delicious meal featuring tender grilled chicken with colorful roasted vegetables',
        ingredients: [
          { name: 'Chicken breast', amount: 2, unit: 'pieces' },
          { name: 'Broccoli', amount: 2, unit: 'cups' },
          { name: 'Carrots', amount: 4, unit: 'medium' },
          { name: 'Olive oil', amount: 2, unit: 'tbsp' },
          { name: 'Garlic powder', amount: 1, unit: 'tsp' },
          { name: 'Salt and pepper', amount: 1, unit: 'to taste' }
        ],
        instructions: [
          'Preheat oven to 400°F (200°C)',
          'Season chicken breasts with salt, pepper, and garlic powder',
          'Heat a grill pan over medium-high heat and cook chicken for 6-8 minutes per side',
          'Meanwhile, toss vegetables with olive oil, salt, and pepper',
          'Roast vegetables for 20-25 minutes until tender',
          'Serve chicken with roasted vegetables'
        ],
        prep_time: 15,
        cook_time: 25,
        servings: request.household_size,
        nutrition_info: {
          calories: 350,
          protein: 35,
          carbs: 15,
          fat: 12,
          fiber: 6
        },
        tags: ['healthy', 'protein-rich', 'low-carb']
      },
      {
        id: 'mock_meal_2',
        name: 'Quinoa Buddha Bowl',
        description: 'A nutritious vegetarian bowl packed with protein and fiber',
        ingredients: [
          { name: 'Quinoa', amount: 1, unit: 'cup' },
          { name: 'Chickpeas', amount: 1, unit: 'can' },
          { name: 'Sweet potato', amount: 1, unit: 'medium' },
          { name: 'Kale', amount: 2, unit: 'cups' },
          { name: 'Avocado', amount: 1, unit: 'medium' },
          { name: 'Tahini', amount: 2, unit: 'tbsp' }
        ],
        instructions: [
          'Cook quinoa according to package directions',
          'Dice sweet potato and roast at 400°F for 20 minutes',
          'Drain and rinse chickpeas',
          'Massage kale with olive oil and lemon juice',
          'Assemble bowl with quinoa, vegetables, and tahini dressing'
        ],
        prep_time: 20,
        cook_time: 30,
        servings: request.household_size,
        nutrition_info: {
          calories: 420,
          protein: 15,
          carbs: 65,
          fat: 8,
          fiber: 12
        },
        tags: ['vegetarian', 'vegan', 'high-fiber']
      }
    ]

    const mockGroceryList: SazonGroceryItem[] = [
      { name: 'Chicken breast', amount: 2, unit: 'pieces', category: 'Meat & Seafood', estimated_cost: 8.99 },
      { name: 'Broccoli', amount: 1, unit: 'head', category: 'Produce', estimated_cost: 2.99 },
      { name: 'Carrots', amount: 1, unit: 'bag', category: 'Produce', estimated_cost: 1.99 },
      { name: 'Quinoa', amount: 1, unit: 'bag', category: 'Pantry', estimated_cost: 4.99 },
      { name: 'Chickpeas', amount: 1, unit: 'can', category: 'Pantry', estimated_cost: 1.49 },
      { name: 'Sweet potato', amount: 2, unit: 'medium', category: 'Produce', estimated_cost: 2.99 },
      { name: 'Kale', amount: 1, unit: 'bunch', category: 'Produce', estimated_cost: 2.49 },
      { name: 'Avocado', amount: 1, unit: 'medium', category: 'Produce', estimated_cost: 1.99 }
    ]

    return {
      meals: mockMeals.slice(0, request.meal_count),
      grocery_list: mockGroceryList,
      total_estimated_cost: mockGroceryList.reduce((sum, item) => sum + item.estimated_cost, 0),
      preparation_time: '45 minutes',
      difficulty_level: request.cooking_skill_level === 'beginner' ? 'Easy' : 'Intermediate'
    }
  }

  /**
   * Calls the OpenAI GPT API with the provided request
   * @param request - The GPT API request
   * @returns Promise<SazonGptResponse> - The GPT API response
   */
  private async callGptApi(request: SazonGptRequest): Promise<SazonGptResponse> {
    try {
      const completion = await this.openaiClient.chat.completions.create({
        model: request.model,
        messages: request.messages,
        temperature: request.temperature,
        max_tokens: request.max_tokens
      })

      return {
        choices: completion.choices.map((choice: any) => ({
          message: {
            content: choice.message.content || ''
          }
        }))
      }
    } catch (error) {
      console.error('GPT API call failed:', error)
      throw new Error(`GPT API error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Generates a detailed prompt for the GPT API based on user preferences
   * @param request - The meal plan request
   * @returns string - The formatted prompt
   */
  private generatePrompt(request: SazonMealPlanRequest): string {
    const {
      dietary_preferences,
      allergies,
      household_size,
      cooking_skill_level,
      cuisine_preferences,
      meal_count,
      additional_notes
    } = request

    return `You are Sazon AI, a professional meal planning assistant. Create a personalized meal plan based on the following requirements:

User Preferences:
- Dietary preferences: ${dietary_preferences.join(', ') || 'None specified'}
- Food allergies: ${allergies.join(', ') || 'None'}
- Household size: ${household_size} people
- Cooking skill level: ${cooking_skill_level}
- Cuisine preferences: ${cuisine_preferences.join(', ') || 'Any cuisine'}
- Number of meals: ${meal_count}
- Additional notes: ${additional_notes || 'None'}

Requirements:
1. Create ${meal_count} complete meals with detailed recipes
2. Each meal should include:
   - Recipe name and description
   - Complete ingredient list with amounts and units
   - Step-by-step cooking instructions
   - Nutritional information (calories, protein, carbs, fat, fiber)
   - Prep time and cook time
   - Number of servings
   - Relevant tags (e.g., vegetarian, quick, healthy)

3. Generate a comprehensive grocery list that:
   - Groups items by category (Produce, Meat & Seafood, Dairy & Eggs, Pantry, etc.)
   - Includes estimated costs for each item
   - Accounts for household size

4. Provide:
   - Total estimated cost for all ingredients
   - Total preparation time
   - Overall difficulty level

Please respond with a valid JSON object in the following format:
{
  "meals": [
    {
      "id": "unique_id",
      "name": "Recipe Name",
      "description": "Brief description",
      "ingredients": [
        {
          "name": "Ingredient name",
          "amount": 2,
          "unit": "cups",
          "notes": "optional notes"
        }
      ],
      "instructions": [
        "Step 1",
        "Step 2",
        "Step 3"
      ],
      "prep_time": 15,
      "cook_time": 30,
      "servings": 4,
      "nutrition_info": {
        "calories": 350,
        "protein": 25,
        "carbs": 30,
        "fat": 12,
        "fiber": 5
      },
      "tags": ["vegetarian", "quick", "healthy"],
      "image_url": null
    }
  ],
  "grocery_list": [
    {
      "name": "Item name",
      "amount": 2,
      "unit": "pounds",
      "category": "Produce",
      "estimated_cost": 3.99,
      "notes": "optional notes"
    }
  ],
  "total_estimated_cost": 45.67,
  "preparation_time": "2 hours 30 minutes",
  "difficulty_level": "Intermediate"
}

Ensure all recipes are:
- Suitable for the specified cooking skill level
- Free from allergens
- Appropriate for the dietary preferences
- Delicious and practical for home cooking`
  }

  /**
   * Parses the GPT response and validates the structure
   * @param content - The raw content from GPT API
   * @returns SazonMealPlanResponse - The parsed and validated meal plan
   */
  private parseGptResponse(content: string): SazonMealPlanResponse {
    try {
      // Extract JSON from the response (GPT might include markdown formatting)
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/\{[\s\S]*\}/)
      const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : content
      
      const parsed = JSON.parse(jsonString)
      
      // Validate and transform the response
      return {
        meals: parsed.meals.map((meal: any, index: number) => ({
          id: meal.id || `meal_${index + 1}`,
          name: meal.name,
          description: meal.description,
          ingredients: meal.ingredients || [],
          instructions: meal.instructions || [],
          prep_time: meal.prep_time || 0,
          cook_time: meal.cook_time || 0,
          servings: meal.servings || 1,
          nutrition_info: {
            calories: meal.nutrition_info?.calories || 0,
            protein: meal.nutrition_info?.protein || 0,
            carbs: meal.nutrition_info?.carbs || 0,
            fat: meal.nutrition_info?.fat || 0,
            fiber: meal.nutrition_info?.fiber || 0
          },
          tags: meal.tags || [],
          image_url: meal.image_url || undefined
        })),
        grocery_list: parsed.grocery_list.map((item: any, index: number) => ({
          name: item.name,
          amount: item.amount || 1,
          unit: item.unit || 'piece',
          category: item.category || 'Other',
          estimated_cost: item.estimated_cost || 0,
          notes: item.notes || undefined
        })),
        total_estimated_cost: parsed.total_estimated_cost || 0,
        preparation_time: parsed.preparation_time || 'Unknown',
        difficulty_level: parsed.difficulty_level || 'Intermediate'
      }
    } catch (error) {
      console.error('Error parsing GPT response:', error)
      throw new Error('Failed to parse meal plan response from GPT API')
    }
  }
} 