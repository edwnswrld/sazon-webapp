import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSazonUser } from '../context/UserContext'
import { validateEmail, validatePassword } from '../lib/auth'
import { ChefHat, Sparkles, Clock, Users, DollarSign } from 'lucide-react'

const SazonHomePage: React.FC = () => {
  const { signIn, signUp } = useSazonUser()
  const navigate = useNavigate()
  const [isSignUp, setIsSignUp] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  })

  const [validationErrors, setValidationErrors] = useState({
    email: '',
    password: '',
    fullName: ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setValidationErrors(prev => ({ ...prev, [field]: '' }))
    setError('')
  }

  const validateForm = () => {
    const errors = { email: '', password: '', fullName: '' }
    let isValid = true

    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required'
      isValid = false
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address'
      isValid = false
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required'
      isValid = false
    } else {
      const passwordValidation = validatePassword(formData.password)
      if (!passwordValidation.isValid) {
        errors.password = passwordValidation.errors[0]
        isValid = false
      }
    }

    // Full name validation (only for sign up)
    if (isSignUp && !formData.fullName.trim()) {
      errors.fullName = 'Full name is required'
      isValid = false
    }

    setValidationErrors(errors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    setError('')

    try {
      let result
      if (isSignUp) {
        result = await signUp(formData.email, formData.password, formData.fullName)
      } else {
        result = await signIn(formData.email, formData.password)
      }

      if (result.error) {
        setError(result.error.message || 'An error occurred')
      } else {
        // Success - navigation will be handled by the router
        navigate('/onboarding')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const features = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'AI-Powered Meal Planning',
      description: 'Get personalized meal plans based on your preferences and dietary needs'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Quick & Easy Recipes',
      description: 'Simple recipes that fit your schedule and cooking skill level'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Family-Friendly',
      description: 'Meal plans that work for your entire household'
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: 'Budget-Conscious',
      description: 'Cost-effective meal plans that won\'t break the bank'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center">
              <ChefHat className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome to <span className="text-primary-600">Sazon AI</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your personal AI chef that creates delicious, personalized meal plans just for you
          </p>
        </div>

        <div className="max-w-md mx-auto">
          {/* Auth Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              {isSignUp ? 'Create Account' : 'Sign In'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {isSignUp && (
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className={`input-field ${validationErrors.fullName ? 'border-red-500' : ''}`}
                    placeholder="Enter your full name"
                  />
                  {validationErrors.fullName && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.fullName}</p>
                  )}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`input-field ${validationErrors.email ? 'border-red-500' : ''}`}
                  placeholder="Enter your email"
                />
                {validationErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`input-field ${validationErrors.password ? 'border-red-500' : ''}`}
                  placeholder="Enter your password"
                />
                {validationErrors.password && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  isSignUp ? 'Create Account' : 'Sign In'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                {isSignUp ? 'Already have an account? Sign in' : 'Don\'t have an account? Sign up'}
              </button>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Why Choose Sazon AI?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SazonHomePage 