import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabaseClient } from '../lib/supabaseClient'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { hasCompletedOnboarding } from '../lib/onboardingUtils'

const SazonAuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the access token and refresh token from URL params
        const accessToken = searchParams.get('access_token')
        const refreshToken = searchParams.get('refresh_token')
        const error = searchParams.get('error')
        const errorDescription = searchParams.get('error_description')

        if (error) {
          setStatus('error')
          setMessage(errorDescription || 'Authentication failed')
          setTimeout(() => navigate('/'), 3000)
          return
        }

        if (accessToken && refreshToken) {
          // Set the session manually
          const { data, error: sessionError } = await supabaseClient.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })

          if (sessionError) {
            setStatus('error')
            setMessage('Failed to establish session')
            setTimeout(() => navigate('/'), 3000)
            return
          }

          if (data.session) {
            // Check if user has completed onboarding by fetching their profile
            try {
              const { data: profileData, error: profileError } = await supabaseClient
                .from('user_profiles')
                .select('*')
                .eq('id', data.session.user.id)
                .single()

              if (profileError) {
                console.error('Error fetching profile:', profileError)
                // If we can't fetch profile, redirect to onboarding as fallback
                setStatus('success')
                setMessage('Successfully signed in!')
                setTimeout(() => navigate('/onboarding'), 1500)
                return
              }

              // Check if user has completed onboarding
              const needsOnboarding = !hasCompletedOnboarding(profileData)
              
              setStatus('success')
              setMessage('Successfully signed in!')
              
              // Redirect based on onboarding status
              const redirectPath = needsOnboarding ? '/onboarding' : '/dashboard'
              setTimeout(() => navigate(redirectPath), 1500)
              return
            } catch (error) {
              console.error('Error checking onboarding status:', error)
              // Fallback to onboarding if there's an error
              setStatus('success')
              setMessage('Successfully signed in!')
              setTimeout(() => navigate('/onboarding'), 1500)
              return
            }
          }
        }

        // If no tokens found, try to get session from URL
        const { data, error: urlError } = await supabaseClient.auth.getSession()
        
        if (urlError) {
          setStatus('error')
          setMessage('Failed to authenticate')
          setTimeout(() => navigate('/'), 3000)
          return
        }

        if (data.session) {
          // Check if user has completed onboarding by fetching their profile
          try {
            const { data: profileData, error: profileError } = await supabaseClient
              .from('user_profiles')
              .select('*')
              .eq('id', data.session.user.id)
              .single()

            if (profileError) {
              console.error('Error fetching profile:', profileError)
              // If we can't fetch profile, redirect to onboarding as fallback
              setStatus('success')
              setMessage('Successfully signed in!')
              setTimeout(() => navigate('/onboarding'), 1500)
              return
            }

            // Check if user has completed onboarding
            const needsOnboarding = !hasCompletedOnboarding(profileData)
            
            setStatus('success')
            setMessage('Successfully signed in!')
            
            // Redirect based on onboarding status
            const redirectPath = needsOnboarding ? '/onboarding' : '/dashboard'
            setTimeout(() => navigate(redirectPath), 1500)
          } catch (error) {
            console.error('Error checking onboarding status:', error)
            // Fallback to onboarding if there's an error
            setStatus('success')
            setMessage('Successfully signed in!')
            setTimeout(() => navigate('/onboarding'), 1500)
          }
        } else {
          setStatus('error')
          setMessage('No valid session found')
          setTimeout(() => navigate('/'), 3000)
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        setStatus('error')
        setMessage('An unexpected error occurred')
        setTimeout(() => navigate('/'), 3000)
      }
    }

    handleAuthCallback()
  }, [searchParams, navigate])

  const getStatusContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Signing you in...</h2>
            <p className="text-gray-600">Please wait while we complete your authentication</p>
          </div>
        )
      case 'success':
        return (
          <div className="text-center">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome to Sazon AI!</h2>
            <p className="text-gray-600">{message}</p>
          </div>
        )
      case 'error':
        return (
          <div className="text-center">
            <XCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Failed</h2>
            <p className="text-gray-600">{message}</p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Return to Home
            </button>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {getStatusContent()}
        </div>
      </div>
    </div>
  )
}

export default SazonAuthCallback 