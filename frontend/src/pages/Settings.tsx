import React, { useState } from 'react'

import { useSazonUser } from '../context/UserContext'
import { validatePassword } from '../lib/auth'
import { User, Lock, Eye, EyeOff, CheckCircle, XCircle, ChefHat, Users, Utensils, Globe } from 'lucide-react'
import SazonBottomNavbar from '../components/BottomNavbar'

const SazonSettings: React.FC = () => {
  const { user, profile, updatePassword } = useSazonUser()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [validationErrors, setValidationErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordForm(prev => ({ ...prev, [field]: value }))
    setValidationErrors(prev => ({ ...prev, [field]: '' }))
    setError('')
    setSuccess('')
  }

  const validatePasswordForm = () => {
    const errors = { currentPassword: '', newPassword: '', confirmPassword: '' }
    let isValid = true

    // Current password validation
    if (!passwordForm.currentPassword) {
      errors.currentPassword = 'Current password is required'
      isValid = false
    }

    // New password validation
    const passwordValidation = validatePassword(passwordForm.newPassword)
    if (!passwordValidation.isValid) {
      errors.newPassword = passwordValidation.errors[0]
      isValid = false
    }

    // Confirm password validation
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
      isValid = false
    }

    setValidationErrors(errors)
    return isValid
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validatePasswordForm()) return

    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const result = await updatePassword(passwordForm.newPassword)
      
      if (result.error) {
        setError(result.error.message || 'Failed to update password')
      } else {
        setSuccess('Password updated successfully!')
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }



  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account preferences and security</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                  <User className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                  <p className="text-gray-600">Your basic account details</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="input-field bg-gray-50 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={profile?.full_name || ''}
                    disabled
                    className="input-field bg-gray-50 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Name can be updated during onboarding</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Created
                  </label>
                  <input
                    type="text"
                    value={user?.created_at ? new Date(user.created_at).toLocaleDateString() : ''}
                    disabled
                    className="input-field bg-gray-50 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* User Preferences Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                  <ChefHat className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Your Meal Planning Preferences</h2>
                  <p className="text-gray-600">Preferences you set during onboarding</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Dietary Preferences */}
                <div>
                  <div className="flex items-center mb-3">
                    <Utensils className="w-4 h-4 text-gray-500 mr-2" />
                    <h3 className="text-sm font-medium text-gray-700">Dietary Preferences</h3>
                  </div>
                  {profile?.dietary_preferences && profile.dietary_preferences.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {profile.dietary_preferences.map((preference, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                        >
                          {preference}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No dietary preferences set</p>
                  )}
                </div>

                {/* Allergies */}
                <div>
                  <div className="flex items-center mb-3">
                    <XCircle className="w-4 h-4 text-red-500 mr-2" />
                    <h3 className="text-sm font-medium text-gray-700">Food Allergies</h3>
                  </div>
                  {profile?.allergies && profile.allergies.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {profile.allergies.map((allergy, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                        >
                          {allergy}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No allergies set</p>
                  )}
                </div>

                {/* Household Size */}
                <div>
                  <div className="flex items-center mb-3">
                    <Users className="w-4 h-4 text-gray-500 mr-2" />
                    <h3 className="text-sm font-medium text-gray-700">Household Size</h3>
                  </div>
                  {profile?.household_size ? (
                    <p className="text-sm text-gray-900">
                      Cooking for <span className="font-medium">{profile.household_size}</span> {profile.household_size === 1 ? 'person' : 'people'}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500">Not set</p>
                  )}
                </div>

                {/* Cooking Skill Level */}
                <div>
                  <div className="flex items-center mb-3">
                    <ChefHat className="w-4 h-4 text-gray-500 mr-2" />
                    <h3 className="text-sm font-medium text-gray-700">Cooking Experience</h3>
                  </div>
                  {profile?.cooking_skill_level ? (
                    <div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                        {profile.cooking_skill_level}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {profile.cooking_skill_level === 'beginner' && 'New to cooking, need simple recipes'}
                        {profile.cooking_skill_level === 'intermediate' && 'Some experience, can follow recipes'}
                        {profile.cooking_skill_level === 'advanced' && 'Experienced cook, can improvise'}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Not set</p>
                  )}
                </div>

                {/* Cuisine Preferences */}
                <div className="md:col-span-2">
                  <div className="flex items-center mb-3">
                    <Globe className="w-4 h-4 text-gray-500 mr-2" />
                    <h3 className="text-sm font-medium text-gray-700">Favorite Cuisines</h3>
                  </div>
                  {profile?.cuisine_preferences && profile.cuisine_preferences.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {profile.cuisine_preferences.map((cuisine, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                        >
                          {cuisine}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No cuisine preferences set</p>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  These preferences help us generate personalized meal plans. You can update them by going through onboarding again.
                </p>
              </div>
            </div>
          </div>

          {/* Password Change */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                  <Lock className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
                  <p className="text-gray-600">Update your password</p>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center">
                    <XCircle className="w-5 h-5 text-red-600 mr-2" />
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <p className="text-sm text-green-600">{success}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      id="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                      className={`input-field pr-10 ${validationErrors.currentPassword ? 'border-red-500' : ''}`}
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {validationErrors.currentPassword && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.currentPassword}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      id="newPassword"
                      value={passwordForm.newPassword}
                      onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                      className={`input-field pr-10 ${validationErrors.newPassword ? 'border-red-500' : ''}`}
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {validationErrors.newPassword && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.newPassword}</p>
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
                      value={passwordForm.confirmPassword}
                      onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                      className={`input-field pr-10 ${validationErrors.confirmPassword ? 'border-red-500' : ''}`}
                      placeholder="Confirm new password"
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
            </div>
          </div>
        </div>
      </div>
      <SazonBottomNavbar />
    </div>
  )
}

export default SazonSettings 