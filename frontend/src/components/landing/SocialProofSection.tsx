import React from 'react';

export const SocialProofSection: React.FC = () => {
  const testimonials = [
    {
      quote: "Finally, a meal planning app that understands my cultural background and dietary needs!",
      author: "Sarah M.",
      role: "Marketing Manager",
      avatar: "👩‍💼"
    },
    {
      quote: "The 3-day plans are perfect - fresh ingredients and no waste. Exactly what I needed.",
      author: "Alex K.",
      role: "Software Engineer",
      avatar: "👨‍💻"
    },
    {
      quote: "As someone with multiple dietary restrictions, this is a game-changer for me.",
      author: "Maria L.",
      role: "Healthcare Professional",
      avatar: "👩‍⚕️"
    }
  ];

  const stats = [
    { number: "500+", label: "People on Waitlist" },
    { number: "50+", label: "Cuisines Supported" },
    { number: "15+", label: "Dietary Restrictions" },
    { number: "3", label: "Days Fresh Plans" }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Loved by Busy Professionals
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See what people are saying about Sazón and join the growing community 
            of professionals who are transforming their meal planning experience.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-orange-600 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-100"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-xl">
                  {testimonial.avatar}
                </div>
                <div className="flex-1">
                  <p className="text-gray-700 mb-4 italic">
                    "{testimonial.quote}"
                  </p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.author}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Community Section */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Join Our Growing Community
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Connect with other busy professionals who are passionate about healthy, 
              culturally-rich meal planning. Share tips, recipes, and experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 text-xl">📱</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Mobile App</h4>
              <p className="text-sm text-gray-600">
                Get your meal plans and grocery lists on the go
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-xl">💬</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Community</h4>
              <p className="text-sm text-gray-600">
                Share recipes and tips with fellow food lovers
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 text-xl">🎯</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Personalized</h4>
              <p className="text-sm text-gray-600">
                AI-powered recommendations just for you
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Transform Your Meal Planning?
            </h3>
            <p className="text-gray-600 mb-6">
              Join hundreds of professionals who are already waiting to experience 
              the future of cultural, dietary-conscious meal planning.
            </p>
            <button className="bg-orange-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-700 transition-colors shadow-lg">
              Join the Waitlist Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}; 