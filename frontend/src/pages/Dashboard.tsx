import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSazonUser } from '../context/UserContext'
import SazonBottomNavbar from '../components/BottomNavbar'

import { 
  Plus, 
  Calendar, 
  TrendingUp, 
  Clock, 
  Users, 
  ChefHat,
  ArrowRight,
  Sparkles
} from 'lucide-react'
import { SazonMealPlanResponse } from '../lib/api'

const SazonDashboardPage: React.FC = () => {
  const { profile } = useSazonUser()
  const [recentMealPlans, setRecentMealPlans] = useState<SazonMealPlanResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Mock data for demonstration
  useEffect(() => {
    const mockMealPlans: SazonMealPlanResponse[] = [
      {
        meals: [
          {
            id: '1',
            name: 'Grilled Chicken Salad',
            description: 'Fresh mixed greens with grilled chicken breast, cherry tomatoes, and balsamic vinaigrette',
            ingredients: [
              { name: 'Chicken breast', amount: 2, unit: 'pieces' },
              { name: 'Mixed greens', amount: 4, unit: 'cups' },
              { name: 'Cherry tomatoes', amount: 1, unit: 'cup' }
            ],
            instructions: [
              'Season chicken with salt and pepper',
              'Grill chicken for 6-8 minutes per side',
              'Toss greens with tomatoes and dressing'
            ],
            prep_time: 10,
            cook_time: 15,
            servings: 2,
            nutrition_info: {
              calories: 350,
              protein: 35,
              carbs: 8,
              fat: 12,
              fiber: 4
            },
            tags: ['healthy', 'quick', 'low-carb'],
            image_url: undefined
          },
          {
            id: '2',
            name: 'Quinoa Buddha Bowl',
            description: 'Nutritious bowl with quinoa, roasted vegetables, and tahini dressing',
            ingredients: [
              { name: 'Quinoa', amount: 1, unit: 'cup' },
              { name: 'Sweet potato', amount: 1, unit: 'medium' },
              { name: 'Chickpeas', amount: 1, unit: 'can' }
            ],
            instructions: [
              'Cook quinoa according to package directions',
              'Roast sweet potato and chickpeas',
              'Assemble bowl with vegetables and dressing'
            ],
            prep_time: 15,
            cook_time: 25,
            servings: 2,
            nutrition_info: {
              calories: 420,
              protein: 15,
              carbs: 65,
              fat: 8,
              fiber: 12
            },
            tags: ['vegetarian', 'healthy', 'meal-prep'],
            image_url: undefined
          }
        ],
        grocery_list: [
          { name: 'Chicken breast', amount: 2, unit: 'pieces', category: 'Meat & Seafood', estimated_cost: 8.99 },
          { name: 'Mixed greens', amount: 1, unit: 'bag', category: 'Produce', estimated_cost: 3.99 },
          { name: 'Cherry tomatoes', amount: 1, unit: 'pint', category: 'Produce', estimated_cost: 2.99 }
        ],
        total_estimated_cost: 15.97,
        preparation_time: '25 minutes',
        difficulty_level: 'Easy'
      }
    ]

    setTimeout(() => {
      setRecentMealPlans(mockMealPlans)
      setIsLoading(false)
    }, 1000)
  }, [])

  const stats = [
    {
      icon: <Calendar className="w-5 h-5" />,
      label: 'Meal Plans Created',
      value: '12',
      change: '+3 this month'
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: 'Money Saved',
      value: '$127',
      change: '+$23 this week'
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: 'Time Saved',
      value: '8.5 hrs',
      change: '+2 hrs this week'
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: 'Household Size',
      value: profile?.household_size?.toString() || '1',
      change: 'people'
    }
  ]

  const quickActions = [
    {
      title: 'Generate New Meal Plan',
      description: 'Create a personalized meal plan based on your preferences',
      icon: <Sparkles className="w-6 h-6" />,
      link: '/plan',
      color: 'bg-primary-500 hover:bg-primary-600'
    },
    {
      title: 'View Saved Plans',
      description: 'Browse your previously created meal plans',
      icon: <ChefHat className="w-6 h-6" />,
      link: '/saved-plans',
      color: 'bg-secondary-500 hover:bg-secondary-600'
    },
    {
      title: 'Update Preferences',
      description: 'Modify your dietary preferences and settings',
      icon: <Users className="w-6 h-6" />,
      link: '/settings',
      color: 'bg-gray-500 hover:bg-gray-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <SazonBottomNavbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {profile?.full_name || 'Chef'}! 👋
          </h1>
          <p className="text-gray-600">
            Ready to create some delicious meals? Let's get cooking!
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
                  {stat.icon}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-green-600 mt-1">{stat.change}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center text-white`}>
                    {action.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{action.description}</p>
                    <div className="flex items-center text-primary-600 text-sm font-medium">
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Meal Plans */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Meal Plans</h2>
            <Link
              to="/plan"
              className="btn-primary flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Plan
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : recentMealPlans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentMealPlans.map((mealPlan, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">Meal Plan #{index + 1}</h3>
                      <span className="text-sm text-gray-500">{mealPlan.preparation_time}</span>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      {mealPlan.meals.slice(0, 2).map((meal) => (
                        <div key={meal.id} className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                          <span className="text-sm text-gray-700">{meal.name}</span>
                        </div>
                      ))}
                      {mealPlan.meals.length > 2 && (
                        <div className="text-sm text-gray-500">
                          +{mealPlan.meals.length - 2} more meals
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        ${mealPlan.total_estimated_cost.toFixed(2)} total
                      </span>
                      <span className="text-gray-500">
                        {mealPlan.difficulty_level}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <ChefHat className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No meal plans yet</h3>
              <p className="text-gray-500 mb-6">Create your first meal plan to get started!</p>
              <Link to="/plan" className="btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Plan
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SazonDashboardPage 