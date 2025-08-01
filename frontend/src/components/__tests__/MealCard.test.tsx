import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import SazonMealCard from '../MealCard'

// Mock the meal data
const mockMeal = {
  id: '1',
  name: 'Test Meal',
  description: 'A delicious test meal',
  image_url: 'https://example.com/meal.jpg',
  prep_time: 30,
  cook_time: 45,
  servings: 4,
  tags: ['vegetarian', 'healthy', 'medium'],
  ingredients: [
    { name: 'Ingredient 1', amount: 1, unit: 'cup' },
    { name: 'Ingredient 2', amount: 2, unit: 'tbsp' },
  ],
  instructions: [
    'Step 1: Do something',
    'Step 2: Do something else',
  ],
  nutrition_info: {
    calories: 300,
    protein: 20,
    carbs: 30,
    fat: 10,
    fiber: 5
  }
}

describe('MealCard', () => {
  it('renders meal information correctly', () => {
    render(<SazonMealCard meal={mockMeal} />)
    
    expect(screen.getByText('Test Meal')).toBeInTheDocument()
    expect(screen.getByText('A delicious test meal')).toBeInTheDocument()
    expect(screen.getByText('30 min')).toBeInTheDocument()
    expect(screen.getByText('45 min')).toBeInTheDocument()
    expect(screen.getByText('4 servings')).toBeInTheDocument()
  })

  it('displays meal image with proper alt text', () => {
    render(<SazonMealCard meal={mockMeal} />)
    
    const image = screen.getByAltText('Test Meal')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'https://example.com/meal.jpg')
  })

  it('shows difficulty level', () => {
    render(<SazonMealCard meal={mockMeal} />)
    
    expect(screen.getByText('medium')).toBeInTheDocument()
  })

  it('displays meal tags', () => {
    render(<SazonMealCard meal={mockMeal} />)
    
    expect(screen.getByText('vegetarian')).toBeInTheDocument()
    expect(screen.getByText('healthy')).toBeInTheDocument()
  })

  it('handles missing optional fields gracefully', () => {
    const minimalMeal = {
      id: '2',
      name: 'Minimal Meal',
      description: 'A minimal meal',
      image_url: 'https://example.com/minimal.jpg',
      prep_time: 15,
      cook_time: 20,
      servings: 2,
      tags: ['easy'],
      ingredients: [],
      instructions: [],
      nutrition_info: {
        calories: 200,
        protein: 15,
        carbs: 20,
        fat: 8,
        fiber: 3
      }
    }

    render(<SazonMealCard meal={minimalMeal} />)
    
    expect(screen.getByText('Minimal Meal')).toBeInTheDocument()
    expect(screen.getByText('A minimal meal')).toBeInTheDocument()
    expect(screen.getByText('easy')).toBeInTheDocument()
  })

  it('applies proper accessibility attributes', () => {
    render(<SazonMealCard meal={mockMeal} />)
    
    const card = screen.getByRole('article')
    expect(card).toBeInTheDocument()
    
    const image = screen.getByAltText('Test Meal')
    expect(image).toHaveAttribute('alt', 'Test Meal')
  })
}) 