import React from 'react'
import { Navigate } from 'react-router-dom'
import SazonOnboardingPage from './Onboarding'

/**
 * Development-only onboarding component that bypasses authentication
 * This component is only available in development mode and allows
 * developers to access onboarding screens without logging in
 */
const SazonDevOnboardingPage: React.FC = () => {
  // Only allow access in development mode
  if (!import.meta.env.DEV) {
    return <Navigate to="/" replace />
  }

  const handleDevComplete = (formData: any) => {
    // In development mode, just log the data and show a success message
    console.log('Development onboarding completed:', formData)
    alert('Development mode: Onboarding completed! Check console for form data.')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Development mode indicator */}
      <div className="bg-yellow-100 border-b border-yellow-200 px-4 py-2">
        <div className="container mx-auto">
          <p className="text-sm text-yellow-800 text-center">
            🚧 Development Mode - Onboarding Preview (No Authentication Required)
          </p>
        </div>
      </div>
      
      {/* Render the actual onboarding component with dev mode props */}
      <SazonOnboardingPage 
        isDevMode={true}
        onDevComplete={handleDevComplete}
      />
    </div>
  )
}

export default SazonDevOnboardingPage 