import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from '@supabase/supabase-js'
import { supabaseClient } from '../lib/supabaseClient'
import { signInWithMagicLink, signUpWithMagicLink, requestPasswordReset, updateUserPassword } from '../lib/auth'
import { SazonUserProfile } from '../lib/onboardingUtils'
import { isDevModeEnabled, getDevUser, getDevProfile } from '../lib/devAuth'

interface SazonUserContextType {
  user: User | null
  profile: SazonUserProfile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, firstName: string) => Promise<{ error: any }>
  signInWithMagicLink: (email: string) => Promise<{ error: any }>
  signUpWithMagicLink: (email: string, firstName: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<SazonUserProfile>) => Promise<{ error: any }>
  requestPasswordReset: (email: string) => Promise<{ error: any }>
  updatePassword: (password: string) => Promise<{ error: any }>
}

const SazonUserContext = createContext<SazonUserContextType | undefined>(undefined)

export const useSazonUser = () => {
  const context = useContext(SazonUserContext)
  if (context === undefined) {
    throw new Error('useSazonUser must be used within a UserContextProvider')
  }
  return context
}

interface SazonUserContextProviderProps {
  children: ReactNode
}

export const UserContextProvider: React.FC<SazonUserContextProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<SazonUserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for dev mode first
    if (isDevModeEnabled()) {
      const devUser = getDevUser()
      const devProfile = getDevProfile()
      
      setUser(devUser)
      setProfile(devProfile)
      setLoading(false)
      return
    }

    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabaseClient.auth.getSession()
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await fetchSazonUserProfile(session.user.id)
      }
      
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await fetchSazonUserProfile(session.user.id)
        } else {
          setProfile(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchSazonUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabaseClient
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        return
      }

      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const signIn = async (email: string, password: string) => {
    // In dev mode, always succeed
    if (isDevModeEnabled()) {
      const devUser = getDevUser()
      const devProfile = getDevProfile()
      
      setUser(devUser)
      setProfile(devProfile)
      return { error: null }
    }

    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signUp = async (email: string, password: string, firstName: string) => {
    // In dev mode, always succeed
    if (isDevModeEnabled()) {
      const devUser = getDevUser()
      const devProfile = getDevProfile()
      
      setUser(devUser)
      setProfile(devProfile)
      return { error: null }
    }

    const { error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: firstName,
        },
      },
    })
    return { error }
  }

  const signOut = async () => {
    // In dev mode, just clear the state
    if (isDevModeEnabled()) {
      setUser(null)
      setProfile(null)
      return
    }

    await supabaseClient.auth.signOut()
  }

  const updateProfile = async (updates: Partial<SazonUserProfile>) => {
    if (!user) return { error: new Error('No user logged in') }

    // In dev mode, just update local state
    if (isDevModeEnabled()) {
      const currentProfile = getDevProfile()
      const updatedProfile = { ...currentProfile, ...updates, updated_at: new Date().toISOString() }
      setProfile(updatedProfile)
      return { error: null }
    }

    const { data, error } = await supabaseClient
      .from('user_profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()

    if (!error && data) {
      setProfile(data)
    }

    return { error }
  }

  const signInWithMagicLinkHandler = async (email: string) => {
    return await signInWithMagicLink(email)
  }

  const signUpWithMagicLinkHandler = async (email: string, firstName: string) => {
    return await signUpWithMagicLink(email, firstName)
  }

  const requestPasswordResetHandler = async (email: string) => {
    return await requestPasswordReset(email)
  }

  const updatePasswordHandler = async (password: string) => {
    return await updateUserPassword(password)
  }

  const value: SazonUserContextType = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signInWithMagicLink: signInWithMagicLinkHandler,
    signUpWithMagicLink: signUpWithMagicLinkHandler,
    signOut,
    updateProfile,
    requestPasswordReset: requestPasswordResetHandler,
    updatePassword: updatePasswordHandler,
  }

  return (
    <SazonUserContext.Provider value={value}>
      {children}
    </SazonUserContext.Provider>
  )
} 