# 🔐 Sazon MVP Authentication Setup Guide

This guide explains how to set up Supabase authentication for the Sazon MVP project, including email & password and magic link authentication.

## 📋 Prerequisites

1. A Supabase account and project
2. Node.js and npm/yarn installed
3. The Sazon MVP project cloned locally

## 🚀 Quick Setup

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Create a new project
3. Wait for the project to be provisioned

### 2. Configure Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

**Where to find these values:**
- Go to your Supabase project dashboard
- Navigate to Settings → API
- Copy the "Project URL" and "anon public" key

### 3. Configure Supabase Authentication

In your Supabase dashboard:

1. **Enable Email Authentication:**
   - Go to Authentication → Settings
   - Enable "Email auth"
   - Configure email templates if desired

2. **Set up Email Templates:**
   - Go to Authentication → Email Templates
   - Customize the "Magic Link" and "Reset Password" templates
   - Update the redirect URLs to match your app:
     - Magic Link: `https://your-domain.com/auth/callback`
     - Reset Password: `https://your-domain.com/reset-password`

3. **Configure Site URL:**
   - Go to Authentication → Settings
   - Set Site URL to your app's domain
   - For local development: `http://localhost:5173`

### 4. Create Database Tables

Run the following SQL in your Supabase SQL editor:

```sql
-- Create user_profiles table
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  dietary_preferences TEXT[],
  allergies TEXT[],
  household_size INTEGER,
  cooking_skill_level TEXT CHECK (cooking_skill_level IN ('beginner', 'intermediate', 'advanced')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

## 🔧 Features Implemented

### ✅ Email & Password Authentication
- User registration with email and password
- User login with email and password
- Password validation (8+ chars, uppercase, lowercase, number)
- Email validation

### ✅ Magic Link Authentication
- Passwordless authentication via email
- Secure token-based authentication
- Automatic session management

### ✅ Password Reset
- Forgot password functionality
- Secure password reset via email
- Password update in settings

### ✅ Session Management
- Automatic session persistence
- Session refresh handling
- Logout functionality

### ✅ Protected Routes
- Route protection based on authentication status
- Automatic redirects for unauthenticated users
- Loading states during authentication checks

### ✅ User Profile Management
- User profile creation on signup
- Profile information display
- Settings page for account management

## 🧪 Testing the Authentication

### Local Development
1. Start the development server: `npm run dev`
2. Navigate to `http://localhost:5173`
3. Test the following flows:
   - Sign up with email/password
   - Sign in with email/password
   - Sign in with magic link
   - Password reset
   - Settings page access

### Magic Link Testing
1. Enter your email in the magic link form
2. Check your email for the magic link
3. Click the link to authenticate
4. You should be redirected to the onboarding page

### Password Reset Testing
1. Click "Forgot your password?" on the login page
2. Enter your email address
3. Check your email for the reset link
4. Click the link and set a new password

## 🔒 Security Features

- **Password Requirements:** Minimum 8 characters with uppercase, lowercase, and number
- **Email Validation:** Proper email format validation
- **Session Security:** Secure token-based sessions
- **Row Level Security:** Database-level security policies
- **CSRF Protection:** Built-in CSRF protection via Supabase
- **Rate Limiting:** Supabase handles rate limiting automatically

## 🚨 Troubleshooting

### Common Issues

1. **Environment Variables Not Loading:**
   - Ensure `.env` file is in the project root
   - Restart the development server after adding variables

2. **Magic Link Not Working:**
   - Check Site URL configuration in Supabase
   - Verify email template redirect URLs
   - Check spam folder for emails

3. **Database Connection Issues:**
   - Verify Supabase URL and API key
   - Check if RLS policies are properly configured
   - Ensure database tables exist

4. **Authentication State Not Persisting:**
   - Check browser localStorage
   - Verify Supabase client configuration
   - Ensure `persistSession: true` is set

### Debug Mode

To enable debug logging, add this to your Supabase client configuration:

```typescript
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': 'sazon-mvp'
    }
  }
})
```

## 📚 Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [React Router Documentation](https://reactrouter.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

## 🤝 Contributing

When adding new authentication features:

1. Follow the existing code patterns
2. Add proper error handling
3. Include loading states
4. Test both success and error scenarios
5. Update this documentation

---

**Note:** This authentication system is designed for the Sazon MVP and includes all necessary features for a production-ready authentication flow. 