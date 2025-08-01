// Waitlist service for handling email signups
// This is a simple implementation that can be enhanced with backend integration

export interface WaitlistSignup {
  email: string;
  timestamp: Date;
  source?: string;
  preferences?: {
    dietaryRestrictions?: string[];
    cuisinePreferences?: string[];
    cookingLevel?: string;
  };
}

class WaitlistService {
  private storageKey = 'sazon_waitlist_signups';

  // Store signup in localStorage (temporary solution)
  async signup(email: string, preferences?: WaitlistSignup['preferences']): Promise<void> {
    const signup: WaitlistSignup = {
      email,
      timestamp: new Date(),
      preferences
    };

    // Get existing signups
    const existingSignups = this.getSignups();
    
    // Check if email already exists
    if (existingSignups.some(s => s.email === email)) {
      throw new Error('Email already signed up');
    }

    // Add new signup
    existingSignups.push(signup);
    
    // Store in localStorage
    localStorage.setItem(this.storageKey, JSON.stringify(existingSignups));

    // TODO: Send to backend API when available
    console.log('Waitlist signup:', signup);
  }

  // Get all signups from localStorage
  getSignups(): WaitlistSignup[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading waitlist signups:', error);
      return [];
    }
  }

  // Check if email is already signed up
  isSignedUp(email: string): boolean {
    const signups = this.getSignups();
    return signups.some(s => s.email === email);
  }

  // Get signup count
  getSignupCount(): number {
    return this.getSignups().length;
  }

  // Export signups (for admin purposes)
  exportSignups(): string {
    const signups = this.getSignups();
    return JSON.stringify(signups, null, 2);
  }

  // Clear all signups (for testing)
  clearSignups(): void {
    localStorage.removeItem(this.storageKey);
  }
}

// Create singleton instance
export const waitlistService = new WaitlistService();

// TODO: Backend integration
// When backend is ready, replace localStorage with API calls:
/*
export class WaitlistService {
  private apiUrl = '/api/waitlist';

  async signup(email: string, preferences?: WaitlistSignup['preferences']): Promise<void> {
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        preferences,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to sign up for waitlist');
    }
  }

  async getSignupCount(): Promise<number> {
    const response = await fetch(`${this.apiUrl}/count`);
    if (!response.ok) {
      throw new Error('Failed to get signup count');
    }
    const data = await response.json();
    return data.count;
  }
}
*/ 