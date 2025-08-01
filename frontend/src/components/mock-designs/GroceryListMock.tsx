import React from 'react';

export const GroceryListMock: React.FC = () => {
  const groceryCategories = [
    {
      category: 'Produce',
      icon: '🥬',
      items: [
        { name: 'Spinach', quantity: '2 bunches', checked: false },
        { name: 'Bell Peppers', quantity: '3 medium', checked: false },
        { name: 'Cherry Tomatoes', quantity: '1 pint', checked: true },
        { name: 'Cucumber', quantity: '1 large', checked: false }
      ]
    },
    {
      category: 'Grains & Legumes',
      icon: '🌾',
      items: [
        { name: 'Quinoa', quantity: '1 cup', checked: false },
        { name: 'Brown Rice', quantity: '2 cups', checked: false },
        { name: 'Chickpeas', quantity: '1 can', checked: true }
      ]
    },
    {
      category: 'Spices & Herbs',
      icon: '🌿',
      items: [
        { name: 'Cumin', quantity: '1 tsp', checked: false },
        { name: 'Fresh Cilantro', quantity: '1 bunch', checked: false },
        { name: 'Ginger', quantity: '1 inch', checked: true }
      ]
    },
    {
      category: 'Dairy & Alternatives',
      icon: '🥛',
      items: [
        { name: 'Almond Milk', quantity: '1 carton', checked: false },
        { name: 'Greek Yogurt', quantity: '1 cup', checked: false }
      ]
    }
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Grocery List</h1>
          <p className="text-sm text-gray-500">12 items • Organized by section</p>
        </div>
        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
          <span className="text-green-600 text-sm">🛒</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-gray-200 rounded-full h-2">
        <div className="bg-green-500 h-2 rounded-full" style={{ width: '25%' }}></div>
      </div>
      <p className="text-xs text-gray-500 text-center">3 of 12 items checked</p>

      {/* Categories */}
      <div className="space-y-4">
        {groceryCategories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="bg-white rounded-lg border border-gray-200">
            {/* Category Header */}
            <div className="flex items-center space-x-3 p-3 border-b border-gray-100">
              <span className="text-lg">{category.icon}</span>
              <h3 className="font-semibold text-gray-900">{category.category}</h3>
              <span className="ml-auto text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {category.items.length} items
              </span>
            </div>

            {/* Items */}
            <div className="p-3 space-y-2">
              {category.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className={`flex items-center justify-between p-2 rounded-lg ${
                    item.checked ? 'bg-green-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                        item.checked
                          ? 'bg-green-500 border-green-500'
                          : 'border-gray-300'
                      }`}
                    >
                      {item.checked && (
                        <span className="text-white text-xs">✓</span>
                      )}
                    </div>
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          item.checked ? 'text-gray-500 line-through' : 'text-gray-900'
                        }`}
                      >
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">{item.quantity}</p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <span className="text-xs">⋮</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2 pt-2">
        <button className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-medium">
          Share List
        </button>
        <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium">
          Export PDF
        </button>
      </div>

      {/* Estimated Total */}
      <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">Estimated Total</p>
            <p className="text-xs text-gray-500">Based on local prices</p>
          </div>
          <span className="text-lg font-bold text-blue-600">$42.50</span>
        </div>
      </div>
    </div>
  );
}; 