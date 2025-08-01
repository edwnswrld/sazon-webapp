import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Calendar, ShoppingCart, User } from 'lucide-react'

const SazonBottomNavbar: React.FC = () => {
  const location = useLocation()

  const isActiveRoute = (path: string) => {
    return location.pathname === path || location.pathname === `/app${path}`
  }

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <nav className="bg-white shadow-lg rounded-full px-6 py-3 border border-gray-200">
        <div className="flex items-center space-x-8">
          {/* Plan Button */}
          <Link
            to="/app/plan"
            className={`flex flex-col items-center justify-center transition-all duration-200 ${
              isActiveRoute('/plan')
                ? 'text-primary-600'
                : 'text-gray-500 hover:text-primary-600'
            }`}
          >
            <Calendar className={`w-6 h-6 ${isActiveRoute('/plan') ? 'text-primary-600' : 'text-gray-500'}`} />
            <span className="text-xs mt-1 font-medium">Plan</span>
          </Link>

          {/* Grocery Button */}
          <Link
            to="/app/grocery"
            className={`flex flex-col items-center justify-center transition-all duration-200 ${
              isActiveRoute('/grocery')
                ? 'text-primary-600'
                : 'text-gray-500 hover:text-primary-600'
            }`}
          >
            <ShoppingCart className={`w-6 h-6 ${isActiveRoute('/grocery') ? 'text-primary-600' : 'text-gray-500'}`} />
            <span className="text-xs mt-1 font-medium">Grocery</span>
          </Link>

          {/* Account Settings Button */}
          <Link
            to="/app/settings"
            className={`flex flex-col items-center justify-center transition-all duration-200 ${
              isActiveRoute('/settings')
                ? 'text-primary-600'
                : 'text-gray-500 hover:text-primary-600'
            }`}
          >
            <User className={`w-6 h-6 ${isActiveRoute('/settings') ? 'text-primary-600' : 'text-gray-500'}`} />
            <span className="text-xs mt-1 font-medium">Account</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}

export default SazonBottomNavbar 