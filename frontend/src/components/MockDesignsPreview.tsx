import React, { useState } from 'react';
import { OnboardingMock } from './mock-designs/OnboardingMock';
import { GroceryListMock } from './mock-designs/GroceryListMock';
import { MealPlanMock } from './mock-designs/MealPlanMock';

export const MockDesignsPreview: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'onboarding' | 'grocery' | 'mealplan'>('onboarding');

  const tabs = [
    { id: 'onboarding', name: 'Onboarding', icon: '🚀' },
    { id: 'grocery', name: 'Grocery List', icon: '🛒' },
    { id: 'mealplan', name: 'Meal Plan', icon: '🌶️' }
  ] as const;

  const renderMockComponent = () => {
    switch (activeTab) {
      case 'onboarding':
        return <OnboardingMock />;
      case 'grocery':
        return <GroceryListMock />;
      case 'mealplan':
        return <MealPlanMock />;
      default:
        return <OnboardingMock />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Mock Designs Preview</h1>
          <p className="text-gray-600">Preview the UI components for Sazón</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <span>{tab.icon}</span>
                  <span>{tab.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Mock Component Display */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {renderMockComponent()}
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>These are mock designs showing the UI components for the Sazón app.</p>
          <p className="mt-1">Each tab shows a different feature's interface.</p>
        </div>
      </div>
    </div>
  );
}; 