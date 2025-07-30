import React, { useState } from 'react'
import { CheckCircle, Circle, ShoppingCart, Package } from 'lucide-react'
import { SazonGroceryItem } from '../lib/api'

interface SazonGroceryListSectionProps {
  groceryItems: (SazonGroceryItem & { recipe_name?: string })[]
  onItemToggle?: (itemName: string, checked: boolean) => void
  className?: string
}

interface SazonGroceryItemWithStatus extends SazonGroceryItem {
  checked?: boolean
  recipe_name?: string
}

const SazonGroceryListSection: React.FC<SazonGroceryListSectionProps> = ({
  groceryItems,
  onItemToggle,
  className = ''
}) => {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())

  // Generate consistent colors for recipe names
  const getRecipeColor = (recipeName: string) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-purple-100 text-purple-800',
      'bg-orange-100 text-orange-800',
      'bg-pink-100 text-pink-800',
      'bg-indigo-100 text-indigo-800',
      'bg-teal-100 text-teal-800',
      'bg-red-100 text-red-800',
      'bg-yellow-100 text-yellow-800',
      'bg-cyan-100 text-cyan-800'
    ]
    
    // Simple hash function to get consistent color for same recipe name
    let hash = 0
    for (let i = 0; i < recipeName.length; i++) {
      const char = recipeName.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    
    return colors[Math.abs(hash) % colors.length]
  }

  // Group items by category
  const groupedItems = groceryItems.reduce((acc, item) => {
    const category = item.category || 'Other'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push({
      ...item,
      checked: checkedItems.has(item.name)
    })
    return acc
  }, {} as Record<string, SazonGroceryItemWithStatus[]>)

  const handleItemToggle = (itemName: string, checked: boolean) => {
    const newCheckedItems = new Set(checkedItems)
    if (checked) {
      newCheckedItems.add(itemName)
    } else {
      newCheckedItems.delete(itemName)
    }
    setCheckedItems(newCheckedItems)
    onItemToggle?.(itemName, checked)
  }

  const checkedCount = checkedItems.size
  const totalCount = groceryItems.length

  const categoryIcons: Record<string, React.ReactNode> = {
    'Produce': '🥬',
    'Meat & Seafood': '🥩',
    'Dairy & Eggs': '🥛',
    'Pantry': '🥫',
    'Frozen': '🧊',
    'Beverages': '🥤',
    'Bakery': '🥖',
    'Snacks': '🍿',
    'Other': '📦'
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ShoppingCart className="w-5 h-5 text-primary-600" />
          <h2 className="text-xl font-semibold text-gray-900">Grocery List</h2>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
            <span>{checkedCount}/{totalCount} items</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${totalCount > 0 ? (checkedCount / totalCount) * 100 : 0}%` }}
        ></div>
      </div>

      {/* Grocery Items by Category */}
      <div className="space-y-6">
        {Object.entries(groupedItems).map(([category, items]) => (
          <div key={category} className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-lg">{categoryIcons[category] || '📦'}</span>
              <h3 className="font-medium text-gray-900">{category}</h3>
              <span className="text-sm text-gray-500">({items.length} items)</span>
            </div>
            
            <div className="space-y-2">
              {items.map((item, index) => (
                <div 
                  key={`${item.name}-${index}`}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-primary-300 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <button
                      onClick={() => handleItemToggle(item.name, !item.checked)}
                      className="flex-shrink-0"
                    >
                      {item.checked ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400 hover:text-primary-600" />
                      )}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium ${item.checked ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {item.name}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-gray-500">
                          {item.amount} {item.unit}
                        </span>
                        {item.recipe_name && (
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRecipeColor(item.recipe_name)}`}>
                            {item.recipe_name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {groceryItems.length === 0 && (
        <div className="text-center py-8">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No grocery items yet</h3>
          <p className="text-gray-500">Your grocery list will appear here once you generate a meal plan.</p>
        </div>
      )}
    </div>
  )
}

export default SazonGroceryListSection 