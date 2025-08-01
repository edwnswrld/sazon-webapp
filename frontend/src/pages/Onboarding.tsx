import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSazonUser } from '../context/UserContext'
import { ChefHat, ArrowRight, Check, SkipForward } from 'lucide-react'

interface SazonOnboardingPageProps {
  isDevMode?: boolean
  onDevComplete?: (formData: any) => void
}

const SazonOnboardingPage: React.FC<SazonOnboardingPageProps> = ({ 
  isDevMode = false, 
  onDevComplete 
}) => {
  const { updateProfile } = useSazonUser()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    dietary_preferences: [] as string[],
    allergies: [] as string[],
    household_size: 1,
    cooking_skill_level: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    cuisine_preferences: [] as string[]
  })

  // Track which steps have been completed
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())

  // Auto-scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentStep])

  const dietaryOptions = [
    'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Paleo', 'Mediterranean', 'Blood Sugar-Friendly', 'High-Protein'
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

  // Validation functions for each step
  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1: // Dietary preferences - can be skipped
        return true
      case 2: // Allergies - can be skipped
        return true
      case 3: // Household size - required
        return formData.household_size >= 1
      case 4: // Cooking skill - required
        return !!formData.cooking_skill_level
      case 5: // Cuisine preferences - can be skipped
        return true
      default:
        return false
    }
  }

  const canProceedFromStep = (step: number): boolean => {
    return isStepValid(step)
  }

  const handleToggleArray = (arrayName: 'dietary_preferences' | 'allergies' | 'cuisine_preferences', value: string) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: (prev[arrayName] as string[]).includes(value)
        ? (prev[arrayName] as string[]).filter(item => item !== value)
        : [...(prev[arrayName] as string[]), value]
    }))
    
    // Mark step as completed when user makes a selection
    if (!completedSteps.has(currentStep)) {
      setCompletedSteps(prev => new Set([...prev, currentStep]))
    }
  }

  const handleSingleSelect = (
    fieldName: 'household_size' | 'cooking_skill_level', 
    value: number | 'beginner' | 'intermediate' | 'advanced'
  ) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }))
    
    // Mark step as completed when user makes a selection
    if (!completedSteps.has(currentStep)) {
      setCompletedSteps(prev => new Set([...prev, currentStep]))
    }
  }

  const handleSkipStep = () => {
    // Mark current step as completed even if skipped
    setCompletedSteps(prev => new Set([...prev, currentStep]))
    handleNext()
  }

  const handleNext = () => {
    if (currentStep < 5 && canProceedFromStep(currentStep)) {
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
      if (isDevMode && onDevComplete) {
        // In development mode, call the dev callback instead of updating profile
        onDevComplete(formData)
        console.log('Development mode - Onboarding completed with data:', formData)
        // In dev mode, we don't navigate anywhere - let the parent component handle it
        return
      }

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
              <p className="text-sm text-gray-500 mt-1">This helps us suggest recipes that fit your lifestyle</p>
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
            {formData.dietary_preferences.length === 0 && (
              <div className="text-center text-sm text-gray-500">
                No dietary restrictions? That's perfectly fine!
              </div>
            )}
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Food Allergies</h2>
              <p className="text-gray-600">Select any food allergies or intolerances</p>
              <p className="text-sm text-gray-500 mt-1">We'll make sure to avoid these ingredients</p>
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
            {formData.allergies.length === 0 && (
              <div className="text-center text-sm text-gray-500">
                No allergies? Great! You have more recipe options.
              </div>
            )}
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Household Size</h2>
              <p className="text-gray-600">How many people are you cooking for?</p>
              <p className="text-sm text-gray-500 mt-1">This helps us adjust recipe portions</p>
            </div>
            <div className="max-w-xs mx-auto">
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => handleSingleSelect('household_size', Math.max(1, formData.household_size - 1))}
                  className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-xl transition-colors"
                >
                  -
                </button>
                <div className="text-4xl font-bold text-gray-900 min-w-[3rem] text-center">
                  {formData.household_size}
                </div>
                <button
                  onClick={() => handleSingleSelect('household_size', formData.household_size + 1)}
                  className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-xl transition-colors"
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
              <p className="text-sm text-gray-500 mt-1">This helps us suggest recipes at the right difficulty</p>
            </div>
            <div className="space-y-3">
              {skillLevels.map(level => (
                <button
                  key={level.value}
                  onClick={() => handleSingleSelect('cooking_skill_level', level.value as 'beginner' | 'intermediate' | 'advanced')}
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
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Favorite Cuisines</h2>
              <p className="text-gray-600">Select your favorite types of cuisine</p>
              <p className="text-sm text-gray-500 mt-1">This helps us suggest recipes that match your taste preferences</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Cuisine Preferences</h3>
                <p className="text-sm text-gray-500 mb-3">Select your favorite types of cuisine (optional)</p>
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
                {formData.cuisine_preferences.length === 0 && (
                  <div className="text-center text-sm text-gray-500 mt-2">
                    No preference? We'll suggest a variety of cuisines!
                  </div>
                )}
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
            {/* Step indicators */}
            <div className="flex justify-between mt-2">
              {[1, 2, 3, 4, 5].map(step => (
                <div
                  key={step}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    step <= currentStep ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                />
              ))}
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

              <div className="flex items-center space-x-3">
                {/* Skip button for optional steps */}
                {(currentStep === 1 || currentStep === 2 || currentStep === 5) && (
                  <button
                    onClick={handleSkipStep}
                    className="flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <SkipForward className="w-4 h-4 mr-1" />
                    Skip
                  </button>
                )}

                {currentStep < 5 ? (
                  <button
                    onClick={handleNext}
                    disabled={!canProceedFromStep(currentStep)}
                    className="btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                ) : (
                  <button
                    onClick={handleComplete}
                    disabled={isLoading || !canProceedFromStep(currentStep)}
                    className="btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
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
    </div>
  )
}

export default SazonOnboardingPage 