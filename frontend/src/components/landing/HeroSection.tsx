import React from 'react';

interface HeroSectionProps {
  onJoinWaitlist: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onJoinWaitlist }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Meal Planning with{' '}
                <span className="text-orange-600">Cultural Flavor</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Stop stressing about what to cook. Get personalized 3-day meal plans 
                that respect your dietary restrictions and celebrate your cultural preferences.
              </p>
            </div>

            {/* Key Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-semibold">✓</span>
                </div>
                <span className="text-gray-700">Dietary restrictions respected</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-semibold">✓</span>
                </div>
                <span className="text-gray-700">Fresh 3-day meal plans</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-semibold">✓</span>
                </div>
                <span className="text-gray-700">Cultural cuisine focus</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-semibold">✓</span>
                </div>
                <span className="text-gray-700">Smart grocery lists</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onJoinWaitlist}
                className="bg-orange-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-700 transition-colors shadow-lg hover:shadow-xl"
              >
                Join the Waitlist
              </button>
              <button className="border-2 border-orange-600 text-orange-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-50 transition-colors">
                See How It Works
              </button>
            </div>

            {/* Social Proof */}
            <div className="pt-4">
              <p className="text-sm text-gray-500 mb-2">Trusted by busy professionals who love good food</p>
              <div className="flex items-center space-x-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full border-2 border-white"
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">100+ people already waiting</span>
              </div>
            </div>
          </div>

          {/* Right Column - Mock App Preview */}
          <div className="relative">
            <div className="relative z-10">
              {/* Main App Mock */}
              <div className="bg-white rounded-2xl shadow-2xl p-6 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Your 3-Day Plan</h3>
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-600 text-sm">🌶️</span>
                    </div>
                  </div>

                  {/* Meal Cards */}
                  <div className="space-y-3">
                    {[
                      { day: 'Monday', meal: 'Mexican Quinoa Bowl', time: '25 min' },
                      { day: 'Tuesday', meal: 'Thai Green Curry', time: '30 min' },
                      { day: 'Wednesday', meal: 'Mediterranean Salad', time: '15 min' }
                    ].map((item, index) => (
                      <div key={index} className="bg-orange-50 rounded-lg p-3 border border-orange-100">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{item.day}</p>
                            <p className="text-sm text-gray-600">{item.meal}</p>
                          </div>
                          <span className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded">
                            {item.time}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Grocery List Preview */}
                  <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">Grocery List Ready</span>
                      <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">
                        12 items
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-yellow-100 rounded-lg p-3 shadow-lg">
                <div className="text-center">
                  <div className="text-2xl mb-1">🥑</div>
                  <p className="text-xs text-gray-600">Fresh</p>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-blue-100 rounded-lg p-3 shadow-lg">
                <div className="text-center">
                  <div className="text-2xl mb-1">🌍</div>
                  <p className="text-xs text-gray-600">Cultural</p>
                </div>
              </div>
            </div>

            {/* Background Decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-200/20 to-red-200/20 rounded-full blur-3xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}; 