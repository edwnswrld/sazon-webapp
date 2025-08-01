import React from 'react';

export const MealPlanMock: React.FC = () => {
  const meals = [
    {
      day: 'Monday',
      meals: [
        { type: 'Breakfast', name: 'Mexican Quinoa Bowl', time: '15 min', icon: '🌅' },
        { type: 'Lunch', name: 'Thai Green Curry', time: '25 min', icon: '☀️' },
        { type: 'Dinner', name: 'Mediterranean Salad', time: '20 min', icon: '🌙' }
      ]
    },
    {
      day: 'Tuesday',
      meals: [
        { type: 'Breakfast', name: 'Indian Masala Oats', time: '10 min', icon: '🌅' },
        { type: 'Lunch', name: 'Vietnamese Pho', time: '30 min', icon: '☀️' },
        { type: 'Dinner', name: 'Greek Lemon Chicken', time: '35 min', icon: '🌙' }
      ]
    },
    {
      day: 'Wednesday',
      meals: [
        { type: 'Breakfast', name: 'Turkish Eggs', time: '12 min', icon: '🌅' },
        { type: 'Lunch', name: 'Korean Bibimbap', time: '28 min', icon: '☀️' },
        { type: 'Dinner', name: 'Moroccan Tagine', time: '40 min', icon: '🌙' }
      ]
    }
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Your 3-Day Plan</h1>
          <p className="text-sm text-gray-500">Fresh & Cultural Meals</p>
        </div>
        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
          <span className="text-orange-600 text-sm">🌶️</span>
        </div>
      </div>

      {/* Dietary Tags */}
      <div className="flex flex-wrap gap-2">
        {['Vegetarian', 'Gluten-Free', 'Dairy-Free'].map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Meal Plans */}
      <div className="space-y-4">
        {meals.map((day, dayIndex) => (
          <div key={dayIndex} className="bg-orange-50 rounded-lg p-3">
            <h3 className="font-semibold text-gray-900 mb-3">{day.day}</h3>
            <div className="space-y-2">
              {day.meals.map((meal, mealIndex) => (
                <div
                  key={mealIndex}
                  className="bg-white rounded-lg p-3 border border-orange-100"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{meal.icon}</span>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                          {meal.type}
                        </p>
                        <p className="font-medium text-gray-900 text-sm">
                          {meal.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded">
                        {meal.time}
                      </span>
                      <button className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-orange-600 text-xs">→</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2 pt-2">
        <button className="flex-1 bg-orange-600 text-white py-2 rounded-lg text-sm font-medium">
          Generate Grocery List
        </button>
        <button className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
          <span className="text-gray-600 text-sm">⚙️</span>
        </button>
      </div>
    </div>
  );
}; 