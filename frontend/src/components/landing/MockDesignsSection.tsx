import React, { useState } from 'react';
import { MealPlanMock } from '../mock-designs/MealPlanMock';
import { GroceryListMock } from '../mock-designs/GroceryListMock';
import { OnboardingMock } from '../mock-designs/OnboardingMock';

export const MockDesignsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('meal-plan');

  const tabs = [
    { id: 'meal-plan', label: 'Meal Planning', icon: '🍽️' },
    { id: 'grocery-list', label: 'Grocery Lists', icon: '🛒' },
    { id: 'onboarding', label: 'Getting Started', icon: '🚀' }
  ];

  const renderMockContent = () => {
    switch (activeTab) {
      case 'meal-plan':
        return <MealPlanMock />;
      case 'grocery-list':
        return <GroceryListMock />;
      case 'onboarding':
        return <OnboardingMock />;
      default:
        return <MealPlanMock />;
    }
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            See Sazón in Action
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our mock designs to see how Sazón will transform your meal planning experience. 
            These are previews of what we're building.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-xl p-2 shadow-lg">
            <div className="flex space-x-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-orange-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mock Content */}
        <div className="flex justify-center">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-md w-full">
            {/* Phone Frame */}
            <div className="relative">
              {/* Status Bar */}
              <div className="bg-gray-900 text-white px-4 py-2 flex justify-between items-center text-sm">
                <span>9:41</span>
                <div className="flex items-center space-x-1">
                  <div className="w-4 h-2 bg-white rounded-sm"></div>
                  <div className="w-1 h-2 bg-white rounded-sm"></div>
                </div>
              </div>

              {/* App Content */}
              <div className="p-4">
                {renderMockContent()}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Description */}
        <div className="text-center mt-12">
          <div className="bg-white rounded-xl p-6 max-w-2xl mx-auto shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {activeTab === 'meal-plan' && 'Smart Meal Planning'}
              {activeTab === 'grocery-list' && 'Organized Grocery Lists'}
              {activeTab === 'onboarding' && 'Simple Setup Process'}
            </h3>
            <p className="text-gray-600">
              {activeTab === 'meal-plan' && 
                'Get personalized 3-day meal plans that respect your dietary restrictions and cultural preferences. Each meal comes with detailed instructions and cooking times.'
              }
              {activeTab === 'grocery-list' && 
                'Automatically generated grocery lists organized by store sections. Quantities are calculated perfectly to avoid waste and save money.'
              }
              {activeTab === 'onboarding' && 
                'Tell us about your dietary restrictions, cuisine preferences, and cooking style. We\'ll personalize your experience from day one.'
              }
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <button className="bg-orange-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-700 transition-colors shadow-lg">
            Join the Waitlist for Early Access
          </button>
        </div>
      </div>
    </section>
  );
}; 