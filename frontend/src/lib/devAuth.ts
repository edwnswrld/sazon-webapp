import { User } from '@supabase/supabase-js'
import { SazonUserProfile } from './onboardingUtils'

// Dev mode storage key
const DEV_MODE_KEY = 'sazon_dev_mode_enabled'
const DEV_USER_KEY = 'sazon_dev_user'

// Mock user data for development
export const createMockUser = (): User => ({
  id: 'dev-user-id-12345',
  email: 'dev@sazon.ai',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  aud: 'authenticated',
  role: 'authenticated',
  email_confirmed_at: new Date().toISOString(),
  phone: undefined,
  confirmed_at: new Date().toISOString(),
  last_sign_in_at: new Date().toISOString(),
  app_metadata: {
    provider: 'email',
    providers: ['email']
  },
  user_metadata: {
    full_name: 'Dev User'
  },
  identities: [],
  factors: []
})

// Mock profile data for development
export const createMockProfile = (): SazonUserProfile => ({
  id: 'dev-user-id-12345',
  email: 'dev@sazon.ai',
  full_name: 'Dev User',
  dietary_preferences: [],
  allergies: [],
  household_size: 2,
  cooking_skill_level: 'intermediate',
  cuisine_preferences: ['Italian', 'Mexican', 'Asian'],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
})

// Check if dev mode is enabled
export const isDevModeEnabled = (): boolean => {
  if (import.meta.env.PROD) return false
  return localStorage.getItem(DEV_MODE_KEY) === 'true'
}

// Enable dev mode
export const enableDevMode = (): void => {
  if (import.meta.env.PROD) return
  localStorage.setItem(DEV_MODE_KEY, 'true')
  localStorage.setItem(DEV_USER_KEY, JSON.stringify(createMockUser()))
}

// Disable dev mode
export const disableDevMode = (): void => {
  if (import.meta.env.PROD) return
  localStorage.removeItem(DEV_MODE_KEY)
  localStorage.removeItem(DEV_USER_KEY)
}

// Get dev user from storage
export const getDevUser = (): User | null => {
  if (!isDevModeEnabled()) return null
  
  try {
    const storedUser = localStorage.getItem(DEV_USER_KEY)
    return storedUser ? JSON.parse(storedUser) : createMockUser()
  } catch {
    return createMockUser()
  }
}

// Get dev profile
export const getDevProfile = (): SazonUserProfile | null => {
  if (!isDevModeEnabled()) return null
  return createMockProfile()
}

// Toggle dev mode
export const toggleDevMode = (): boolean => {
  if (import.meta.env.PROD) return false
  
  const isEnabled = isDevModeEnabled()
  if (isEnabled) {
    disableDevMode()
    return false
  } else {
    enableDevMode()
    return true
  }
} 