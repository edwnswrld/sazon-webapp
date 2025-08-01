import React, { useState } from 'react';
import { HeroSection } from '../../components/landing/HeroSection';
import { FeaturesSection } from '../../components/landing/FeaturesSection';
import { MockDesignsSection } from '../../components/landing/MockDesignsSection';
import { WaitlistSection } from '../../components/landing/WaitlistSection';
import { SocialProofSection } from '../../components/landing/SocialProofSection';
import { Footer } from '../../components/landing/Footer';
import { waitlistService } from '../../lib/waitlistService';

export const LandingPage: React.FC = () => {
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);

  const handleWaitlistSignup = async (email: string) => {
    try {
      await waitlistService.signup(email);
      alert('Thanks for joining the waitlist! We\'ll keep you updated on our progress.');
    } catch (error) {
      console.error('Waitlist signup error:', error);
      if (error instanceof Error && error.message === 'Email already signed up') {
        alert('You\'re already on our waitlist! We\'ll keep you updated.');
      } else {
        alert('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-orange-600">Sazón</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsWaitlistModalOpen(true)}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Join Waitlist
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <HeroSection onJoinWaitlist={() => setIsWaitlistModalOpen(true)} />
        <FeaturesSection />
        <MockDesignsSection />
        <SocialProofSection />
        <WaitlistSection onSignup={handleWaitlistSignup} />
      </main>

      <Footer />

      {/* Waitlist Modal */}
      {isWaitlistModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Join the Sazón Waitlist</h3>
            <p className="text-gray-600 mb-4">
              Be the first to know when we launch! Get early access and exclusive updates.
            </p>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const email = formData.get('email') as string;
              handleWaitlistSignup(email);
              setIsWaitlistModalOpen(false);
            }}>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Join Waitlist
                </button>
                <button
                  type="button"
                  onClick={() => setIsWaitlistModalOpen(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}; 