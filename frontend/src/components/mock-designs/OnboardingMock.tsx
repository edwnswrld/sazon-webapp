import React from 'react';

export const OnboardingMock: React.FC = () => {
  const dietaryOptions = [
    { name: 'Vegetarian', icon: '🥗', selected: true },
    { name: 'Vegan', icon: '🌱', selected: false },
    { name: 'Gluten-Free', icon: '🌾', selected: true },
    { name: 'Dairy-Free', icon: '🥛', selected: false },
    { name: 'Keto', icon: '🥑', selected: false },
    { name: 'Paleo', icon: '🥩', selected: false }
  ];

  const cuisinePreferences = [
    { name: 'Mexican', icon: '🌶️', selected: true },
    { name: 'Thai', icon: '🍜', selected: true },
    { name: 'Indian', icon: '🍛', selected: false },
    { name: 'Mediterranean', icon: '🫒', selected: true },
    { name: 'Japanese', icon: '🍱', selected: false },
    { name: 'Italian', icon: '🍝', selected: false }
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Welcome to Sazón</h1>
          <p className="text-sm text-gray-500">Let's personalize your experience</p>
        </div>
        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
          <span className="text-orange-600 text-sm">🚀</span>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center space-x-2">
        <div className="flex-1 bg-gray-200 rounded-full h-1">
          <div className="bg-orange-500 h-1 rounded-full" style={{ width: '60%' }}></div>
        </div>
        <span className="text-xs text-gray-500">3/5</span>
      </div>

      {/* Step Title */}
      <div className="text-center">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          Dietary Preferences
        </h2>
        <p className="text-sm text-gray-500">
          Select all that apply to your diet
        </p>
      </div>

      {/* Dietary Options */}
      <div className="grid grid-cols-2 gap-2">
        {dietaryOptions.map((option, index) => (
          <button
            key={index}
            className={`p-3 rounded-lg border-2 text-center transition-all ${
              option.selected
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="text-2xl mb-1">{option.icon}</div>
            <p className="text-xs font-medium text-gray-900">{option.name}</p>
          </button>
        ))}
      </div>

      {/* Cuisine Preferences */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          Cuisine Preferences
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {cuisinePreferences.map((cuisine, index) => (
            <button
              key={index}
              className={`p-2 rounded-lg border-2 text-center transition-all ${
                cuisine.selected
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="text-lg mb-1">{cuisine.icon}</div>
              <p className="text-xs text-gray-900">{cuisine.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Cooking Level */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          Cooking Experience
        </h3>
        <div className="space-y-2">
          {[
            { level: 'Beginner', desc: 'New to cooking', icon: '👶' },
            { level: 'Intermediate', desc: 'Some experience', icon: '👨‍🍳', selected: true },
            { level: 'Advanced', desc: 'Confident cook', icon: '👨‍🍳' }
          ].map((level, index) => (
            <button
              key={index}
              className={`w-full p-3 rounded-lg border-2 flex items-center space-x-3 transition-all ${
                level.selected
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <span className="text-lg">{level.icon}</span>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">{level.level}</p>
                <p className="text-xs text-gray-500">{level.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex space-x-2 pt-4">
        <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium">
          Back
        </button>
        <button className="flex-1 bg-orange-600 text-white py-2 rounded-lg text-sm font-medium">
          Continue
        </button>
      </div>

      {/* Skip Option */}
      <div className="text-center">
        <button className="text-xs text-gray-500 hover:text-gray-700">
          Skip for now
        </button>
      </div>
    </div>
  );
}; 