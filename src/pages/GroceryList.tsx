import React, { useState } from 'react'
import SazonGroceryListSection from '../components/GroceryListSection'
import SazonBottomNavbar from '../components/BottomNavbar'
import { SazonGroceryItem } from '../lib/api'

// Mock data for the grocery list with recipe information
const mockGroceryItems: (SazonGroceryItem & { recipe_name?: string })[] = [
  // Produce
  { name: 'Fresh Spinach', amount: 1, unit: 'bunch', category: 'Produce', estimated_cost: 0, notes: 'Organic preferred', recipe_name: 'Spinach & Berry Salad' },
  { name: 'Bell Peppers', amount: 3, unit: 'medium', category: 'Produce', estimated_cost: 0, notes: 'Red, yellow, green', recipe_name: 'Veggie Fajita Bowl' },
  { name: 'Cherry Tomatoes', amount: 1, unit: 'pint', category: 'Produce', estimated_cost: 0, notes: 'For salads', recipe_name: 'Caprese Pasta' },
  { name: 'Avocados', amount: 2, unit: 'large', category: 'Produce', estimated_cost: 0, notes: 'Ripe but firm', recipe_name: 'Avocado Toast' },
  { name: 'Sweet Onion', amount: 1, unit: 'large', category: 'Produce', estimated_cost: 0, notes: 'Yellow onion', recipe_name: 'Veggie Fajita Bowl' },
  { name: 'Garlic', amount: 1, unit: 'head', category: 'Produce', estimated_cost: 0, notes: 'Fresh garlic', recipe_name: 'Garlic Herb Bread' },
  { name: 'Limes', amount: 4, unit: 'medium', category: 'Produce', estimated_cost: 0, notes: 'For garnish and marinades', recipe_name: 'Lime Cilantro Rice' },
  
  // Meat & Seafood
  { name: 'Chicken Breast', amount: 2, unit: 'lbs', category: 'Meat & Seafood', estimated_cost: 0, notes: 'Boneless, skinless', recipe_name: 'Grilled Chicken Salad' },
  { name: 'Salmon Fillets', amount: 1.5, unit: 'lbs', category: 'Meat & Seafood', estimated_cost: 0, notes: 'Wild-caught preferred', recipe_name: 'Baked Salmon Bowl' },
  { name: 'Ground Turkey', amount: 1, unit: 'lb', category: 'Meat & Seafood', estimated_cost: 0, notes: 'Lean ground turkey', recipe_name: 'Turkey Taco Bowl' },
  
  // Dairy & Eggs
  { name: 'Large Eggs', amount: 12, unit: 'count', category: 'Dairy & Eggs', estimated_cost: 0, notes: 'Free-range eggs', recipe_name: 'Breakfast Scramble' },
  { name: 'Greek Yogurt', amount: 1, unit: '32oz container', category: 'Dairy & Eggs', estimated_cost: 0, notes: 'Plain, non-fat', recipe_name: 'Berry Yogurt Parfait' },
  { name: 'Cheddar Cheese', amount: 1, unit: '8oz block', category: 'Dairy & Eggs', estimated_cost: 0, notes: 'Sharp cheddar', recipe_name: 'Cheese Quesadilla' },
  { name: 'Butter', amount: 1, unit: '8oz stick', category: 'Dairy & Eggs', estimated_cost: 0, notes: 'Unsalted butter', recipe_name: 'Garlic Herb Bread' },
  
  // Pantry
  { name: 'Quinoa', amount: 1, unit: '16oz bag', category: 'Pantry', estimated_cost: 0, notes: 'Organic quinoa', recipe_name: 'Quinoa Buddha Bowl' },
  { name: 'Black Beans', amount: 2, unit: '15oz cans', category: 'Pantry', estimated_cost: 0, notes: 'Low sodium', recipe_name: 'Black Bean Chili' },
  { name: 'Olive Oil', amount: 1, unit: '16oz bottle', category: 'Pantry', estimated_cost: 0, notes: 'Extra virgin olive oil', recipe_name: 'Mediterranean Pasta' },
  { name: 'Balsamic Vinegar', amount: 1, unit: '8oz bottle', category: 'Pantry', estimated_cost: 0, notes: 'Aged balsamic', recipe_name: 'Caprese Pasta' },
  { name: 'Honey', amount: 1, unit: '12oz jar', category: 'Pantry', estimated_cost: 0, notes: 'Raw honey', recipe_name: 'Honey Glazed Carrots' },
  { name: 'Chili Powder', amount: 1, unit: '2oz container', category: 'Pantry', estimated_cost: 0, notes: 'For seasoning', recipe_name: 'Black Bean Chili' },
  { name: 'Cumin', amount: 1, unit: '2oz container', category: 'Pantry', estimated_cost: 0, notes: 'Ground cumin', recipe_name: 'Mexican Rice Bowl' },
  
  // Frozen
  { name: 'Mixed Berries', amount: 1, unit: '16oz bag', category: 'Frozen', estimated_cost: 0, notes: 'Strawberries, blueberries, raspberries', recipe_name: 'Berry Smoothie Bowl' },
  { name: 'Frozen Peas', amount: 1, unit: '16oz bag', category: 'Frozen', estimated_cost: 0, notes: 'Sweet peas', recipe_name: 'Pea & Mint Risotto' },
  
  // Beverages
  { name: 'Almond Milk', amount: 1, unit: '64oz carton', category: 'Beverages', estimated_cost: 0, notes: 'Unsweetened almond milk', recipe_name: 'Berry Smoothie Bowl' },
  { name: 'Green Tea', amount: 1, unit: '20-count box', category: 'Beverages', estimated_cost: 0, notes: 'Organic green tea bags', recipe_name: 'Green Tea Latte' },
  
  // Bakery
  { name: 'Whole Grain Bread', amount: 1, unit: 'loaf', category: 'Bakery', estimated_cost: 0, notes: 'Multigrain bread', recipe_name: 'Avocado Toast' },
  { name: 'Tortillas', amount: 1, unit: '10-count pack', category: 'Bakery', estimated_cost: 0, notes: 'Whole wheat tortillas', recipe_name: 'Turkey Taco Bowl' },
  
  // Snacks
  { name: 'Mixed Nuts', amount: 1, unit: '16oz container', category: 'Snacks', estimated_cost: 0, notes: 'Unsalted mixed nuts', recipe_name: 'Trail Mix Snack' },
  { name: 'Dark Chocolate', amount: 1, unit: '3oz bar', category: 'Snacks', estimated_cost: 0, notes: '70% dark chocolate', recipe_name: 'Chocolate Bark Treat' }
]

const SazonGroceryListPage: React.FC = () => {
  const [groceryItems] = useState<(SazonGroceryItem & { recipe_name?: string })[]>(mockGroceryItems)
  const [searchTerm, setSearchTerm] = useState('')

  const handleItemToggle = (itemName: string, checked: boolean) => {
    // In a real app, this would update the backend
    console.log(`Item ${itemName} ${checked ? 'checked' : 'unchecked'}`)
  }

  const filteredItems = groceryItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Grocery List</h1>
              <p className="text-sm text-gray-500">Your shopping list for the week</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Add Section */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search items or categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-sm text-gray-500">Total Items</div>
            <div className="text-2xl font-bold text-gray-900">{groceryItems.length}</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-sm text-gray-500">Categories</div>
            <div className="text-2xl font-bold text-gray-900">
              {new Set(groceryItems.map(item => item.category)).size}
            </div>
          </div>
        </div>

        {/* Grocery List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {searchTerm && (
            <div className="px-6 py-4 border-b border-gray-200">
              <p className="text-sm text-gray-600">
                Showing {filteredItems.length} of {groceryItems.length} items
                {searchTerm && ` for "${searchTerm}"`}
              </p>
            </div>
          )}
          
          <div className="p-6">
            <SazonGroceryListSection
              groceryItems={filteredItems}
              onItemToggle={handleItemToggle}
            />
          </div>
        </div>
      </div>
      <SazonBottomNavbar />
    </div>
  )
}

export default SazonGroceryListPage 