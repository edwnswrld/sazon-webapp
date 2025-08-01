import React from 'react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: '🌶️',
      title: 'Cultural Cuisine Focus',
      description: 'Explore authentic recipes from around the world, tailored to your taste preferences and cultural background.',
      color: 'orange'
    },
    {
      icon: '🥗',
      title: 'Dietary Restriction Respect',
      description: 'Strict adherence to your dietary needs - vegetarian, gluten-free, dairy-free, and more - without compromising flavor.',
      color: 'green'
    },
    {
      icon: '📅',
      title: '3-Day Fresh Plans',
      description: 'Perfect balance of planning and freshness. Get 3 days of meals that ensure your groceries stay fresh and delicious.',
      color: 'blue'
    },
    {
      icon: '🛒',
      title: 'Smart Grocery Lists',
      description: 'Automatically generated, categorized grocery lists that save you time and reduce food waste.',
      color: 'purple'
    },
    {
      icon: '⚡',
      title: 'Quick & Easy',
      description: 'Generate your complete meal plan and grocery list in under 2 minutes. No more decision fatigue.',
      color: 'red'
    },
    {
      icon: '🎯',
      title: 'Personalized for You',
      description: 'AI-powered recommendations that learn your preferences and suggest meals you\'ll actually want to cook.',
      color: 'indigo'
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      orange: 'bg-orange-100 text-orange-600 border-orange-200',
      green: 'bg-green-100 text-green-600 border-green-200',
      blue: 'bg-blue-100 text-blue-600 border-blue-200',
      purple: 'bg-purple-100 text-purple-600 border-purple-200',
      red: 'bg-red-100 text-red-600 border-red-200',
      indigo: 'bg-indigo-100 text-indigo-600 border-indigo-200'
    };
    return colorMap[color] || colorMap.orange;
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Why Sazón is Different
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We understand that meal planning isn't just about food - it's about culture, 
            health, and making your life easier. Here's how we're changing the game.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-xl p-6 border border-gray-100 hover:border-orange-200 hover:shadow-lg transition-all duration-300"
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-lg border ${getColorClasses(feature.color)} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Transform Your Meal Planning?
            </h3>
            <p className="text-gray-600 mb-6">
              Join hundreds of busy professionals who are already waiting to experience 
              the future of cultural, dietary-conscious meal planning.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors">
                Join the Waitlist
              </button>
              <button className="border-2 border-orange-600 text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors">
                See Mock Designs
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 