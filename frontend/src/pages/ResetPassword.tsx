import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabaseClient } from '../lib/supabaseClient'
import { validatePassword } from '../lib/auth'
import { Lock, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react'

const SazonResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })

  const [validationErrors, setValidationErrors] = useState({
    password: '',
    confirmPassword: ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setValidationErrors(prev => ({ ...prev, [field]: '' }))
    setError('')
  }

  const validateForm = () => {
    const errors = { password: '', confirmPassword: '' }
    let isValid = true

    // Password validation
    const passwordValidation = validatePassword(formData.password)
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.errors[0]
      isValid = false
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
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
      const { error } = await supabaseClient.auth.updateUser({
        password: formData.password
      })

      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
        setTimeout(() => navigate('/'), 2000)
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRequestReset = async () => {
    const email = searchParams.get('email')
    if (!email) {
      setError('Email parameter is missing')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
        setTimeout(() => navigate('/'), 3000)
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  // Check if this is a password reset request (no session) or password update (has session)
  const isPasswordUpdate = searchParams.get('access_token') || searchParams.get('type') === 'recovery'

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {isPasswordUpdate ? 'Password Updated!' : 'Reset Email Sent!'}
            </h2>
            <p className="text-gray-600 mb-4">
              {isPasswordUpdate 
                ? 'Your password has been successfully updated. You will be redirected to the home page.'
                : 'Check your email for a password reset link.'
              }
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 text-primary-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {isPasswordUpdate ? 'Update Password' : 'Reset Password'}
            </h1>
            <p className="text-gray-600">
              {isPasswordUpdate 
                ? 'Enter your new password below'
                : 'Enter your email to receive a password reset link'
              }
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <div className="flex items-center">
                <XCircle className="w-5 h-5 text-red-600 mr-2" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}

          {isPasswordUpdate ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`input-field pr-10 ${validationErrors.password ? 'border-red-500' : ''}`}
                    placeholder="Enter your new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={`input-field pr-10 ${validationErrors.confirmPassword ? 'border-red-500' : ''}`}
                    placeholder="Confirm your new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {validationErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.confirmPassword}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full"
              >
                {isLoading ? 'Updating Password...' : 'Update Password'}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                We'll send you an email with a link to reset your password.
              </p>
              <button
                onClick={handleRequestReset}
                disabled={isLoading}
                className="btn-primary w-full"
              >
                {isLoading ? 'Sending Reset Email...' : 'Send Reset Email'}
              </button>
            </div>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-sm text-primary-600 hover:text-primary-700 transition-colors"
            >
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SazonResetPassword 