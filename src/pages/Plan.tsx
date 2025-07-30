import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSazonUser } from '../context/UserContext'
import SazonNavbar from '../components/Navbar'
import SazonMealCard from '../components/MealCard'
import SazonGroceryListSection from '../components/GroceryListSection'
import { generateMealPlan, saveMealPlan, SazonMealPlanResponse } from '../lib/api'
import { 
  Sparkles, 
  Clock, 
  Users, 
  DollarSign, 
  ChefHat,
  ArrowLeft,
  Save,
  RefreshCw,
  CheckCircle
} from 'lucide-react'

const SazonPlanPage: React.FC = () => {
  const { profile, user } = useSazonUser()
  const navigate = useNavigate()
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [mealPlan, setMealPlan] = useState<SazonMealPlanResponse | null>(null)
  const [showResults, setShowResults] = useState(false)

  const [formData, setFormData] = useState({
    meal_count: 3,
    cuisine_preferences: profile?.cuisine_preferences || [],
    additional_notes: ''
  })

  const handleGeneratePlan = async () => {
    if (!profile) {
      setError('Please complete your profile first')
      return
    }

    setIsGenerating(true)
    setError('')

    try {
      const request = {
        dietary_preferences: profile.dietary_preferences || [],
        allergies: profile.allergies || [],
        household_size: profile.household_size || 1,
        cooking_skill_level: profile.cooking_skill_level || 'beginner',
        cuisine_preferences: formData.cuisine_preferences,
        meal_count: formData.meal_count,
        additional_notes: formData.additional_notes
      }

      const result = await generateMealPlan(request)

      if (result.error) {
        setError(result.error.message || 'Failed to generate meal plan')
      } else if (result.data) {
        setMealPlan(result.data)
        setShowResults(true)
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSavePlan = async () => {
    if (!mealPlan || !user) return

    setIsSaving(true)
    setError('')

    try {
      const result = await saveMealPlan(mealPlan, user.id)
      if (result.error) {
        setError(result.error.message || 'Failed to save meal plan')
      } else {
        // Show success message or redirect
        navigate('/dashboard')
      }
    } catch (err) {
      setError('An unexpected error occurred while saving')
    } finally {
      setIsSaving(false)
    }
  }

  const handleRegenerate = () => {
    setMealPlan(null)
    setShowResults(false)
    setError('')
  }

  const mealCountOptions = [1, 2, 3, 4, 5, 6, 7]



  const cuisineOptions = [
    'Italian', 'Mexican', 'Asian', 'Mediterranean', 'American', 'Indian', 'French', 'Thai', 'Japanese', 'Greek'
  ]

  if (showResults && mealPlan) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SazonNavbar />
        
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowResults(false)}
                className="btn-secondary flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Form
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Your Meal Plan</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRegenerate}
                className="btn-secondary flex items-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate
              </button>
              <button
                onClick={handleSavePlan}
                disabled={isSaving}
                className="btn-primary flex items-center"
              >
                {isSaving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Plan
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Plan Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <ChefHat className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Meals</p>
                  <p className="text-lg font-semibold text-gray-900">{mealPlan.meals.length}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Prep Time</p>
                  <p className="text-lg font-semibold text-gray-900">{mealPlan.preparation_time}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Difficulty</p>
                  <p className="text-lg font-semibold text-gray-900">{mealPlan.difficulty_level}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Cost</p>
                  <p className="text-lg font-semibold text-gray-900">${mealPlan.total_estimated_cost.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Meals */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Meals</h2>
              <div className="space-y-6">
                {mealPlan.meals.map((meal, index) => (
                  <SazonMealCard
                    key={meal.id}
                    meal={meal}
                    showNutrition={true}
                    onClick={() => {
                      // Could open meal detail modal
                      console.log('View meal details:', meal.name)
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Grocery List */}
            <div>
              <SazonGroceryListSection
                groceryItems={mealPlan.grocery_list}
                showCosts={true}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SazonNavbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Generate Your Meal Plan</h1>
            <p className="text-xl text-gray-600">
              Let AI create a personalized meal plan just for you
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="space-y-8">
              {/* Number of Meals */}
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-4">
                  How many meals would you like?
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-7 gap-3">
                  {mealCountOptions.map(count => (
                    <button
                      key={count}
                      onClick={() => setFormData(prev => ({ ...prev, meal_count: count }))}
                      className={`p-4 rounded-lg border-2 text-center transition-colors duration-200 ${
                        formData.meal_count === count
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-lg font-semibold">{count}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cuisine Preferences */}
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-4">
                  Cuisine Preferences (Optional)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {cuisineOptions.map(cuisine => (
                    <button
                      key={cuisine}
                      onClick={() => {
                        const current = formData.cuisine_preferences
                        const updated = current.includes(cuisine)
                          ? current.filter(c => c !== cuisine)
                          : [...current, cuisine]
                        setFormData(prev => ({ ...prev, cuisine_preferences: updated }))
                      }}
                      className={`p-3 rounded-lg border-2 text-center transition-colors duration-200 ${
                        formData.cuisine_preferences.includes(cuisine)
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="font-medium">{cuisine}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <label htmlFor="notes" className="block text-lg font-semibold text-gray-900 mb-4">
                  Additional Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  value={formData.additional_notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, additional_notes: e.target.value }))}
                  placeholder="Any specific requests or preferences..."
                  className="input-field h-32 resize-none"
                />
              </div>

              {/* Generate Button */}
              <div className="pt-6">
                <button
                  onClick={handleGeneratePlan}
                  disabled={isGenerating}
                  className="btn-primary w-full flex items-center justify-center py-4 text-lg"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                      Generating Your Meal Plan...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-6 h-6 mr-3" />
                      Generate Meal Plan
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SazonPlanPage 