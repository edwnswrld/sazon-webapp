/**
 * Utility functions for handling user onboarding logic
 */

export interface SazonUserProfile {
  id: string
  email: string
  full_name?: string
  dietary_preferences?: string[]
  allergies?: string[]
  household_size?: number
  cooking_skill_level?: 'beginner' | 'intermediate' | 'advanced'
  cuisine_preferences?: string[]
  created_at: string
  updated_at: string
}

/**
 * Checks if a user has completed their onboarding process
 * 
 * A user is considered to have completed onboarding if they have set up
 * at least one of the key preference fields that are collected during onboarding.
 * 
 * @param profile - The user's profile data from the database
 * @returns true if the user has completed onboarding, false otherwise
 */
export const hasCompletedOnboarding = (profile: SazonUserProfile | null): boolean => {
  if (!profile) {
    return false
  }

  // Check if user has set up their dietary preferences and other key onboarding fields
  return !!(
    profile.dietary_preferences && profile.dietary_preferences.length > 0 ||
    profile.allergies && profile.allergies.length > 0 ||
    profile.household_size ||
    profile.cooking_skill_level ||
    profile.cuisine_preferences && profile.cuisine_preferences.length > 0
  )
}

/**
 * Gets the appropriate redirect path for a user based on their onboarding status
 * 
 * @param profile - The user's profile data from the database
 * @returns '/onboarding' if user needs to complete onboarding, '/dashboard' otherwise
 */
export const getRedirectPathForUser = (profile: SazonUserProfile | null): string => {
  return hasCompletedOnboarding(profile) ? '/dashboard' : '/onboarding'
} 