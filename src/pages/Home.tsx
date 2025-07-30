import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSazonUser } from '../context/UserContext'
import { validateEmail, validatePassword } from '../lib/auth'
import { ChefHat, Sparkles, Clock, Users, Mail, Lock, User, LogIn } from 'lucide-react'

const SazonHomePage: React.FC = () => {
  const { signIn, signUp, signInWithMagicLink, signUpWithMagicLink } = useSazonUser()
  const navigate = useNavigate()
  const [isSignUp, setIsSignUp] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: ''
  })

  const [validationErrors, setValidationErrors] = useState({
    email: '',
    password: '',
    firstName: ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setValidationErrors(prev => ({ ...prev, [field]: '' }))
    setError('')
    setSuccessMessage('')
  }

  const handleSignInSignUpToggle = (isSignUpMode: boolean) => {
    setIsSignUp(isSignUpMode)
    setError('')
    setSuccessMessage('')
    setValidationErrors({ email: '', password: '', firstName: '' })
  }

  const validateForm = () => {
    const errors = { email: '', password: '', firstName: '' }
    let isValid = true

    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required'
      isValid = false
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address'
      isValid = false
    }

    // Password validation (only for password-based auth)
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

    // First name validation (only for sign up)
    if (isSignUp && !formData.firstName.trim()) {
      errors.firstName = 'First name is required'
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
    setSuccessMessage('')

    try {
      let result
      
      if (isSignUp) {
        result = await signUp(formData.email, formData.password, formData.firstName)
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

  const handleMagicLinkSignIn = async () => {
    if (!formData.email) {
      setError('Email is required for magic link sign in')
      return
    }

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address')
      return
    }

    setIsLoading(true)
    setError('')
    setSuccessMessage('')

    try {
      const result = await signInWithMagicLink(formData.email)
      
      if (result.error) {
        setError(result.error.message || 'An error occurred')
      } else {
        setSuccessMessage('Check your email for a magic link to sign in!')
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
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 above-fold">
      {/* Header */}
      <div className="container mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center">
              <ChefHat className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Welcome to <span className="text-primary-600">Sazon AI</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your personal AI chef that creates delicious, personalized meal plans just for you
          </p>
        </div>

        <div className="max-w-md mx-auto auth-form-container">
          {/* Auth Form */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            {/* Sign In/Sign Up Toggle */}
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gray-100 rounded-lg p-1 flex">
                <button
                  type="button"
                  onClick={() => handleSignInSignUpToggle(false)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
                    !isSignUp
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => handleSignInSignUpToggle(true)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
                    isSignUp
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <User className="mr-2 h-4 w-4" />
                  Sign Up
                </button>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              {isSignUp ? 'Create Account' : 'Sign In'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={`input-field ${validationErrors.firstName ? 'border-red-500' : ''}`}
                    placeholder="Enter your first name"
                  />
                  {validationErrors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.firstName}</p>
                  )}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
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
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
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
                <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {successMessage && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                  <p className="text-sm text-green-600">{successMessage}</p>
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

              {/* Magic Link button - only show for Sign In */}
              {!isSignUp && (
                <button
                  type="button"
                  onClick={handleMagicLinkSignIn}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Magic Link
                </button>
              )}

              {/* Forgot Password link - only show for Sign In */}
              {!isSignUp && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => navigate('/reset-password')}
                    className="text-sm text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    Forgot your password?
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Features - moved below with proper spacing */}
        <div className="max-w-4xl mx-auto mt-16">
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