import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from '@supabase/supabase-js'
import { supabaseClient } from '../lib/supabaseClient'

interface SazonUserProfile {
  id: string
  email: string
  full_name?: string
  dietary_preferences?: string[]
  allergies?: string[]
  household_size?: number
  cooking_skill_level?: 'beginner' | 'intermediate' | 'advanced'
  created_at: string
  updated_at: string
}

interface SazonUserContextType {
  user: User | null
  profile: SazonUserProfile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<SazonUserProfile>) => Promise<{ error: any }>
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
    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })
    return { error }
  }

  const signOut = async () => {
    await supabaseClient.auth.signOut()
  }

  const updateProfile = async (updates: Partial<SazonUserProfile>) => {
    if (!user) return { error: new Error('No user logged in') }

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

  const value: SazonUserContextType = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  }

  return (
    <SazonUserContext.Provider value={value}>
      {children}
    </SazonUserContext.Provider>
  )
} 