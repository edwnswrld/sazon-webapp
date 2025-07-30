import React, { useState } from 'react'
import { CheckCircle, Circle, ShoppingCart, DollarSign, Package } from 'lucide-react'
import { SazonGroceryItem } from '../lib/api'

interface SazonGroceryListSectionProps {
  groceryItems: SazonGroceryItem[]
  onItemToggle?: (itemName: string, checked: boolean) => void
  showCosts?: boolean
  className?: string
}

interface SazonGroceryItemWithStatus extends SazonGroceryItem {
  checked?: boolean
}

const SazonGroceryListSection: React.FC<SazonGroceryListSectionProps> = ({
  groceryItems,
  onItemToggle,
  showCosts = true,
  className = ''
}) => {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())

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

  const totalCost = groceryItems.reduce((sum, item) => sum + item.estimated_cost, 0)
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
          {showCosts && (
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 mr-1" />
              <span>${totalCost.toFixed(2)}</span>
            </div>
          )}
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
                      <div className="text-sm text-gray-500">
                        {item.amount} {item.unit}
                        {item.notes && ` • ${item.notes}`}
                      </div>
                    </div>
                  </div>
                  
                  {showCosts && (
                    <div className="flex items-center space-x-2 text-sm">
                      <span className={`font-medium ${item.checked ? 'text-gray-500' : 'text-gray-900'}`}>
                        ${item.estimated_cost.toFixed(2)}
                      </span>
                    </div>
                  )}
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

      {/* Summary */}
      {groceryItems.length > 0 && (
        <div className="bg-primary-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-primary-800">
              <span className="font-medium">Total estimated cost:</span>
            </div>
            <div className="text-lg font-semibold text-primary-900">
              ${totalCost.toFixed(2)}
            </div>
          </div>
          <div className="mt-2 text-xs text-primary-700">
            Prices are estimates and may vary by location and store
          </div>
        </div>
      )}
    </div>
  )
}

export default SazonGroceryListSection 