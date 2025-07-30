import { supabaseClient } from './supabaseClient'

export interface SazonAuthError {
  message: string
  code?: string
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) {
      return { error: { message: error.message, code: error.name } }
    }
    
    return { data, error: null }
  } catch (error) {
    return { 
      error: { 
        message: 'An unexpected error occurred during sign in',
        code: 'UNKNOWN_ERROR'
      }
    }
  }
}

export const signUpWithEmail = async (email: string, password: string, fullName: string) => {
  try {
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })
    
    if (error) {
      return { error: { message: error.message, code: error.name } }
    }
    
    return { data, error: null }
  } catch (error) {
    return { 
      error: { 
        message: 'An unexpected error occurred during sign up',
        code: 'UNKNOWN_ERROR'
      }
    }
  }
}

export const signOut = async () => {
  try {
    const { error } = await supabaseClient.auth.signOut()
    
    if (error) {
      return { error: { message: error.message, code: error.name } }
    }
    
    return { error: null }
  } catch (error) {
    return { 
      error: { 
        message: 'An unexpected error occurred during sign out',
        code: 'UNKNOWN_ERROR'
      }
    }
  }
}

export const resetPassword = async (email: string) => {
  try {
    const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    
    if (error) {
      return { error: { message: error.message, code: error.name } }
    }
    
    return { error: null }
  } catch (error) {
    return { 
      error: { 
        message: 'An unexpected error occurred while resetting password',
        code: 'UNKNOWN_ERROR'
      }
    }
  }
}

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabaseClient.auth.getUser()
    
    if (error) {
      return { error: { message: error.message, code: error.name } }
    }
    
    return { user, error: null }
  } catch (error) {
    return { 
      error: { 
        message: 'An unexpected error occurred while getting user',
        code: 'UNKNOWN_ERROR'
      }
    }
  }
} 