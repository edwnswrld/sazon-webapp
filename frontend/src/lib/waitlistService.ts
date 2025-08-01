import { supabase } from './supabaseClient';

// Waitlist service for handling email signups with Supabase integration

export interface SazonWaitlistSignup {
  id?: string;
  email: string;
  full_name?: string;
  source?: string;
  preferences?: {
    dietaryRestrictions?: string[];
    cuisinePreferences?: string[];
    cookingLevel?: string;
  };
  ip_address?: string;
  user_agent?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SazonWaitlistStats {
  total_signups: number;
  today_signups: number;
  this_week_signups: number;
  this_month_signups: number;
}

class SazonWaitlistService {
  private readonly tableName = 'waitlist_signups';

  /**
   * Sign up a user for the waitlist
   * @param email - User's email address
   * @param options - Optional signup data including name, preferences, and tracking info
   * @returns Promise<void>
   */
  async signup(
    email: string, 
    options?: {
      full_name?: string;
      preferences?: SazonWaitlistSignup['preferences'];
      source?: string;
      utm_source?: string;
      utm_medium?: string;
      utm_campaign?: string;
    }
  ): Promise<void> {
    try {
      // Check if email already exists
      const { data: existingSignup, error: checkError } = await supabase
        .from(this.tableName)
        .select('email')
        .eq('email', email)
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw new Error(`Error checking existing signup: ${checkError.message}`);
      }

      if (existingSignup) {
        throw new Error('Email already signed up for waitlist');
      }

      // Prepare signup data
      const signupData: Partial<SazonWaitlistSignup> = {
        email: email.toLowerCase().trim(),
        full_name: options?.full_name?.trim(),
        source: options?.source || 'landing_page',
        preferences: options?.preferences || {},
        utm_source: options?.utm_source,
        utm_medium: options?.utm_medium,
        utm_campaign: options?.utm_campaign,
        user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
        referrer: typeof window !== 'undefined' ? document.referrer : undefined,
      };

      // Insert new signup
      const { error: insertError } = await supabase
        .from(this.tableName)
        .insert([signupData]);

      if (insertError) {
        throw new Error(`Failed to sign up for waitlist: ${insertError.message}`);
      }

      console.log('Successfully signed up for waitlist:', email);
    } catch (error) {
      console.error('Waitlist signup error:', error);
      throw error;
    }
  }

  /**
   * Check if an email is already signed up
   * @param email - Email to check
   * @returns Promise<boolean>
   */
  async isSignedUp(email: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('email')
        .eq('email', email.toLowerCase().trim())
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking signup status:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Error checking if email is signed up:', error);
      return false;
    }
  }

  /**
   * Get waitlist statistics (requires authentication)
   * @returns Promise<SazonWaitlistStats>
   */
  async getStats(): Promise<SazonWaitlistStats> {
    try {
      const { data, error } = await supabase
        .rpc('get_waitlist_stats');

      if (error) {
        throw new Error(`Failed to get waitlist stats: ${error.message}`);
      }

      return data[0] || {
        total_signups: 0,
        today_signups: 0,
        this_week_signups: 0,
        this_month_signups: 0
      };
    } catch (error) {
      console.error('Error getting waitlist stats:', error);
      throw error;
    }
  }

  /**
   * Get all waitlist signups (requires authentication, for admin purposes)
   * @param limit - Maximum number of records to return
   * @param offset - Number of records to skip
   * @returns Promise<SazonWaitlistSignup[]>
   */
  async getAllSignups(limit: number = 100, offset: number = 0): Promise<SazonWaitlistSignup[]> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        throw new Error(`Failed to get waitlist signups: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error getting all signups:', error);
      throw error;
    }
  }

  /**
   * Get signup count (public method, uses RPC function)
   * @returns Promise<number>
   */
  async getSignupCount(): Promise<number> {
    try {
      const { data, error } = await supabase
        .rpc('get_waitlist_stats');

      if (error) {
        console.error('Error getting signup count:', error);
        return 0;
      }

      return data[0]?.total_signups || 0;
    } catch (error) {
      console.error('Error getting signup count:', error);
      return 0;
    }
  }

  /**
   * Export waitlist data as JSON (requires authentication)
   * @returns Promise<string>
   */
  async exportSignups(): Promise<string> {
    try {
      const signups = await this.getAllSignups(10000); // Get up to 10k records
      return JSON.stringify(signups, null, 2);
    } catch (error) {
      console.error('Error exporting signups:', error);
      throw error;
    }
  }

  /**
   * Delete a signup (requires authentication, for admin purposes)
   * @param email - Email of signup to delete
   * @returns Promise<void>
   */
  async deleteSignup(email: string): Promise<void> {
    try {
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('email', email.toLowerCase().trim());

      if (error) {
        throw new Error(`Failed to delete signup: ${error.message}`);
      }
    } catch (error) {
      console.error('Error deleting signup:', error);
      throw error;
    }
  }

  /**
   * Get UTM parameters from URL
   * @returns Object with UTM parameters
   */
  private getUTMParams(): { utm_source?: string; utm_medium?: string; utm_campaign?: string } {
    if (typeof window === 'undefined') return {};

    const urlParams = new URLSearchParams(window.location.search);
    return {
      utm_source: urlParams.get('utm_source') || undefined,
      utm_medium: urlParams.get('utm_medium') || undefined,
      utm_campaign: urlParams.get('utm_campaign') || undefined,
    };
  }

  /**
   * Sign up with automatic UTM parameter detection
   * @param email - User's email address
   * @param options - Optional signup data
   * @returns Promise<void>
   */
  async signupWithTracking(
    email: string,
    options?: {
      full_name?: string;
      preferences?: SazonWaitlistSignup['preferences'];
      source?: string;
    }
  ): Promise<void> {
    const utmParams = this.getUTMParams();
    
    return this.signup(email, {
      ...options,
      ...utmParams,
    });
  }
}

// Create singleton instance
export const sazonWaitlistService = new SazonWaitlistService();

// Legacy compatibility - keep the old interface for backward compatibility
export const waitlistService = sazonWaitlistService; 