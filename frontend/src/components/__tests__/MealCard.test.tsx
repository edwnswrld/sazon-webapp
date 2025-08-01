import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MealCard } from '../MealCard'

// Mock the meal data
const mockMeal = {
  id: '1',
  name: 'Test Meal',
  description: 'A delicious test meal',
  imageUrl: 'https://example.com/meal.jpg',
  prepTime: 30,
  cookTime: 45,
  servings: 4,
  difficulty: 'medium',
  tags: ['vegetarian', 'healthy'],
  ingredients: [
    { name: 'Ingredient 1', amount: '1 cup' },
    { name: 'Ingredient 2', amount: '2 tbsp' },
  ],
  instructions: [
    'Step 1: Do something',
    'Step 2: Do something else',
  ],
}

describe('MealCard', () => {
  it('renders meal information correctly', () => {
    render(<MealCard meal={mockMeal} />)
    
    expect(screen.getByText('Test Meal')).toBeInTheDocument()
    expect(screen.getByText('A delicious test meal')).toBeInTheDocument()
    expect(screen.getByText('30 min')).toBeInTheDocument()
    expect(screen.getByText('45 min')).toBeInTheDocument()
    expect(screen.getByText('4 servings')).toBeInTheDocument()
  })

  it('displays meal image with proper alt text', () => {
    render(<MealCard meal={mockMeal} />)
    
    const image = screen.getByAltText('Test Meal')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'https://example.com/meal.jpg')
  })

  it('shows difficulty level', () => {
    render(<MealCard meal={mockMeal} />)
    
    expect(screen.getByText('medium')).toBeInTheDocument()
  })

  it('displays meal tags', () => {
    render(<MealCard meal={mockMeal} />)
    
    expect(screen.getByText('vegetarian')).toBeInTheDocument()
    expect(screen.getByText('healthy')).toBeInTheDocument()
  })

  it('handles missing optional fields gracefully', () => {
    const minimalMeal = {
      id: '2',
      name: 'Minimal Meal',
      description: 'A minimal meal',
      imageUrl: 'https://example.com/minimal.jpg',
      prepTime: 15,
      cookTime: 20,
      servings: 2,
      difficulty: 'easy',
      tags: [],
      ingredients: [],
      instructions: [],
    }

    render(<MealCard meal={minimalMeal} />)
    
    expect(screen.getByText('Minimal Meal')).toBeInTheDocument()
    expect(screen.getByText('A minimal meal')).toBeInTheDocument()
    expect(screen.getByText('easy')).toBeInTheDocument()
  })

  it('applies proper accessibility attributes', () => {
    render(<MealCard meal={mockMeal} />)
    
    const card = screen.getByRole('article')
    expect(card).toBeInTheDocument()
    
    const image = screen.getByAltText('Test Meal')
    expect(image).toHaveAttribute('alt', 'Test Meal')
  })
}) 