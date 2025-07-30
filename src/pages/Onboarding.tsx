import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSazonUser } from '../context/UserContext'
import { ChefHat, ArrowRight, Check } from 'lucide-react'

const SazonOnboardingPage: React.FC = () => {
  const { profile, updateProfile } = useSazonUser()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    dietary_preferences: [] as string[],
    allergies: [] as string[],
    household_size: 1,
    cooking_skill_level: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    budget_preference: 'moderate' as 'budget' | 'moderate' | 'premium',
    cuisine_preferences: [] as string[]
  })

  const dietaryOptions = [
    'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Paleo', 'Mediterranean', 'Low-Carb', 'High-Protein'
  ]

  const allergyOptions = [
    'Peanuts', 'Tree Nuts', 'Milk', 'Eggs', 'Soy', 'Fish', 'Shellfish', 'Wheat', 'Sesame'
  ]

  const cuisineOptions = [
    'Italian', 'Mexican', 'Asian', 'Mediterranean', 'American', 'Indian', 'French', 'Thai', 'Japanese', 'Greek'
  ]

  const skillLevels = [
    { value: 'beginner', label: 'Beginner', description: 'New to cooking, need simple recipes' },
    { value: 'intermediate', label: 'Intermediate', description: 'Some experience, can follow recipes' },
    { value: 'advanced', label: 'Advanced', description: 'Experienced cook, can improvise' }
  ]

  const budgetOptions = [
    { value: 'budget', label: 'Budget-Friendly', description: 'Cost-conscious meals' },
    { value: 'moderate', label: 'Moderate', description: 'Balanced cost and quality' },
    { value: 'premium', label: 'Premium', description: 'High-quality ingredients' }
  ]

  const handleToggleArray = (arrayName: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].includes(value)
        ? (prev[arrayName] as string[]).filter(item => item !== value)
        : [...(prev[arrayName] as string[]), value]
    }))
  }

  const handleSingleSelect = (fieldName: keyof typeof formData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }))
  }

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = async () => {
    setIsLoading(true)
    setError('')

    try {
      const result = await updateProfile(formData)
      if (result.error) {
        setError(result.error.message || 'Failed to save preferences')
      } else {
        navigate('/dashboard')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Dietary Preferences</h2>
              <p className="text-gray-600">Select any dietary restrictions or preferences you follow</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {dietaryOptions.map(option => (
                <button
                  key={option}
                  onClick={() => handleToggleArray('dietary_preferences', option)}
                  className={`p-4 rounded-lg border-2 text-left transition-colors duration-200 ${
                    formData.dietary_preferences.includes(option)
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option}</span>
                    {formData.dietary_preferences.includes(option) && (
                      <Check className="w-5 h-5 text-primary-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Food Allergies</h2>
              <p className="text-gray-600">Select any food allergies or intolerances</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {allergyOptions.map(option => (
                <button
                  key={option}
                  onClick={() => handleToggleArray('allergies', option)}
                  className={`p-4 rounded-lg border-2 text-left transition-colors duration-200 ${
                    formData.allergies.includes(option)
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option}</span>
                    {formData.allergies.includes(option) && (
                      <Check className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Household Size</h2>
              <p className="text-gray-600">How many people are you cooking for?</p>
            </div>
            <div className="max-w-xs mx-auto">
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => handleSingleSelect('household_size', Math.max(1, formData.household_size - 1))}
                  className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-xl"
                >
                  -
                </button>
                <div className="text-4xl font-bold text-gray-900 min-w-[3rem] text-center">
                  {formData.household_size}
                </div>
                <button
                  onClick={() => handleSingleSelect('household_size', formData.household_size + 1)}
                  className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-xl"
                >
                  +
                </button>
              </div>
              <p className="text-center text-sm text-gray-500 mt-2">
                {formData.household_size === 1 ? 'person' : 'people'}
              </p>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Cooking Experience</h2>
              <p className="text-gray-600">What's your cooking skill level?</p>
            </div>
            <div className="space-y-3">
              {skillLevels.map(level => (
                <button
                  key={level.value}
                  onClick={() => handleSingleSelect('cooking_skill_level', level.value)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-colors duration-200 ${
                    formData.cooking_skill_level === level.value
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{level.label}</div>
                      <div className="text-sm opacity-75">{level.description}</div>
                    </div>
                    {formData.cooking_skill_level === level.value && (
                      <Check className="w-5 h-5 text-primary-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Budget & Cuisine</h2>
              <p className="text-gray-600">Select your budget preference and favorite cuisines</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Budget Preference</h3>
                <div className="space-y-3">
                  {budgetOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => handleSingleSelect('budget_preference', option.value)}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-colors duration-200 ${
                        formData.budget_preference === option.value
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-sm opacity-75">{option.description}</div>
                        </div>
                        {formData.budget_preference === option.value && (
                          <Check className="w-5 h-5 text-primary-600" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Favorite Cuisines</h3>
                <div className="grid grid-cols-2 gap-3">
                  {cuisineOptions.map(option => (
                    <button
                      key={option}
                      onClick={() => handleToggleArray('cuisine_preferences', option)}
                      className={`p-3 rounded-lg border-2 text-center transition-colors duration-200 ${
                        formData.cuisine_preferences.includes(option)
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="font-medium">{option}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Sazon AI!</h1>
            <p className="text-gray-600">Let's personalize your meal planning experience</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Step {currentStep} of 5</span>
              <span className="text-sm text-gray-500">{Math.round((currentStep / 5) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Form Content */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            {renderStep()}

            {error && (
              <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              <button
                onClick={handleBack}
                disabled={currentStep === 1}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Back
              </button>

              {currentStep < 5 ? (
                <button
                  onClick={handleNext}
                  className="btn-primary flex items-center"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <button
                  onClick={handleComplete}
                  disabled={isLoading}
                  className="btn-primary flex items-center"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <>
                      Complete Setup
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SazonOnboardingPage 