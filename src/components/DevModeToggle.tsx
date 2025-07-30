import React, { useState, useEffect } from 'react'
import { isDevModeEnabled, toggleDevMode } from '../lib/devAuth'

interface SazonDevModeToggleProps {
  className?: string
}

export const SazonDevModeToggle: React.FC<SazonDevModeToggleProps> = ({ className = '' }) => {
  const [isEnabled, setIsEnabled] = useState(false)

  useEffect(() => {
    setIsEnabled(isDevModeEnabled())
  }, [])

  const handleToggle = () => {
    const newState = toggleDevMode()
    setIsEnabled(newState)
    
    // Force page reload to apply dev mode changes
    if (newState) {
      window.location.reload()
    }
  }

  // Only show in development
  if (import.meta.env.PROD) {
    return null
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <button
        onClick={handleToggle}
        className={`
          px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
          ${isEnabled 
            ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg' 
            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }
        `}
        title={isEnabled ? 'Disable Dev Mode' : 'Enable Dev Mode'}
      >
        {isEnabled ? '🟢 Dev Mode ON' : '⚪ Dev Mode OFF'}
      </button>
    </div>
  )
} 