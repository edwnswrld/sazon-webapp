import React from 'react'
import { Clock, Users, ChefHat, Star } from 'lucide-react'
import { SazonMeal } from '../lib/api'

interface SazonMealCardProps {
  meal: SazonMeal
  onClick?: () => void
  showNutrition?: boolean
  className?: string
}

const SazonMealCard: React.FC<SazonMealCardProps> = ({ 
  meal, 
  onClick, 
  showNutrition = false,
  className = ''
}) => {
  const totalTime = meal.prep_time + meal.cook_time

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'text-green-600 bg-green-100'
      case 'medium':
        return 'text-yellow-600 bg-yellow-100'
      case 'hard':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return '🥄'
      case 'medium':
        return '🍳'
      case 'hard':
        return '👨‍🍳'
      default:
        return '🍽️'
    }
  }

  return (
    <div 
      className={`card hover:shadow-md transition-shadow duration-200 cursor-pointer ${className}`}
      onClick={onClick}
    >
      {/* Meal Image */}
      <div className="relative mb-4">
        {meal.image_url ? (
          <img 
            src={meal.image_url} 
            alt={meal.name}
            className="w-full h-48 object-cover rounded-lg"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
            <ChefHat className="w-12 h-12 text-primary-600" />
          </div>
        )}
        
        {/* Difficulty Badge */}
        <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(meal.tags.includes('easy') ? 'easy' : meal.tags.includes('hard') ? 'hard' : 'medium')}`}>
          <span className="mr-1">{getDifficultyIcon(meal.tags.includes('easy') ? 'easy' : meal.tags.includes('hard') ? 'hard' : 'medium')}</span>
          {meal.tags.includes('easy') ? 'Easy' : meal.tags.includes('hard') ? 'Hard' : 'Medium'}
        </div>
      </div>

      {/* Meal Info */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
          {meal.name}
        </h3>
        
        <p className="text-gray-600 text-sm line-clamp-2">
          {meal.description}
        </p>

        {/* Meal Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{totalTime} min</span>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              <span>{meal.servings} servings</span>
            </div>
          </div>
          
          {/* Rating placeholder */}
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
            <span>4.5</span>
          </div>
        </div>

        {/* Nutrition Info (optional) */}
        {showNutrition && (
          <div className="pt-3 border-t border-gray-100">
            <div className="grid grid-cols-4 gap-2 text-xs">
              <div className="text-center">
                <div className="font-medium text-gray-900">{meal.nutrition_info.calories}</div>
                <div className="text-gray-500">cal</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-gray-900">{meal.nutrition_info.protein}g</div>
                <div className="text-gray-500">protein</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-gray-900">{meal.nutrition_info.carbs}g</div>
                <div className="text-gray-500">carbs</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-gray-900">{meal.nutrition_info.fat}g</div>
                <div className="text-gray-500">fat</div>
              </div>
            </div>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1 pt-2">
          {meal.tags.slice(0, 3).map((tag, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
          {meal.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{meal.tags.length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default SazonMealCard 