import React, { useState } from 'react';
import { sazonWaitlistService } from '../../lib/waitlistService';

interface SazonWaitlistSectionProps {
  onSignup?: (email: string) => void;
}

export const SazonWaitlistSection: React.FC<SazonWaitlistSectionProps> = ({ onSignup }) => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setMessage(null);

    try {
      // Use the new Supabase-based service with automatic UTM tracking
      await sazonWaitlistService.signupWithTracking(email, {
        full_name: fullName || undefined,
        source: 'landing_page',
        preferences: {
          dietaryRestrictions: [],
          cuisinePreferences: [],
          cookingLevel: 'beginner'
        }
      });

      setMessage({ type: 'success', text: 'Successfully joined the waitlist! We\'ll be in touch soon.' });
      setEmail('');
      setFullName('');
      
      // Call the optional callback
      if (onSignup) {
        onSignup(email);
      }
    } catch (error) {
      console.error('Waitlist signup error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('already signed up')) {
          setMessage({ type: 'error', text: 'This email is already on our waitlist!' });
        } else {
          setMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
        }
      } else {
        setMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    'Early access to Sazón when we launch',
    'Exclusive meal planning tips and recipes',
    'Behind-the-scenes development updates',
    'Special founding member discounts',
    'Direct input on feature development'
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-orange-600 to-red-600 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Be First in Line for Sazón
          </h2>
          <p className="text-xl text-orange-100 max-w-2xl mx-auto">
            Join our exclusive waitlist and get early access to the future of cultural, 
            dietary-conscious meal planning.
          </p>
        </div>

        {/* Signup Form */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-12">
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="space-y-4">
              {/* Full Name Field */}
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your name (optional)"
                className="w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
              
              {/* Email Field */}
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
              
              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Joining...' : 'Join Waitlist'}
              </button>
            </div>
          </form>
          
          {/* Message Display */}
          {message && (
            <div className={`mt-4 p-3 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-500/20 text-green-100 border border-green-400/30' 
                : 'bg-red-500/20 text-red-100 border border-red-400/30'
            }`}>
              {message.text}
            </div>
          )}
          
          <p className="text-sm text-orange-100 mt-3">
            No spam, ever. Unsubscribe anytime.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">
                  {['🎯', '📧', '🔧', '💰', '💡'][index]}
                </span>
              </div>
              <p className="text-orange-100">{benefit}</p>
            </div>
          ))}
        </div>

        {/* Social Proof */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <div className="flex items-center justify-center space-x-8 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold">100+</div>
              <div className="text-sm text-orange-100">People Waiting</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">3</div>
              <div className="text-sm text-orange-100">Weeks to Launch</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">50+</div>
              <div className="text-sm text-orange-100">Cuisines Supported</div>
            </div>
          </div>
          <p className="text-sm text-orange-100">
            Join the community of busy professionals who are ready to transform their meal planning experience.
          </p>
        </div>
      </div>
    </section>
  );
};

// Legacy export for backward compatibility
export const WaitlistSection = SazonWaitlistSection; 