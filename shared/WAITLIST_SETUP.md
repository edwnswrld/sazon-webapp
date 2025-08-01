# Waitlist System Setup Guide

This guide will help you set up the waitlist collection system for Sazon AI's landing page using Supabase.

## 🎯 Overview

The waitlist system allows visitors to your landing page to sign up for early access to Sazon AI. It includes:

- **Database Table**: Stores signup data with tracking information
- **Frontend Service**: Handles signup logic and API calls
- **Landing Page Component**: Beautiful signup form with validation
- **Admin Dashboard**: View and manage waitlist data (for authenticated users)

## 📋 Prerequisites

- Supabase project set up and configured
- Frontend application with Supabase client configured
- Access to Supabase SQL editor

## 🗄️ Database Setup

### Step 1: Create the Waitlist Table

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `shared/waitlist-table-setup.sql`
4. Click "Run" to execute the script

This will create:
- `waitlist_signups` table with proper indexes
- Row Level Security (RLS) policies
- Helper functions for statistics
- Proper permissions for anonymous and authenticated users

### Step 2: Verify Table Creation

Run this query to verify the table was created:

```sql
SELECT 
    table_name, 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'waitlist_signups'
ORDER BY ordinal_position;
```

## 🔧 Frontend Integration

### Step 1: Update Waitlist Service

The waitlist service (`frontend/src/lib/waitlistService.ts`) has been updated to use Supabase instead of localStorage. Key features:

- **Automatic UTM tracking**: Captures marketing parameters from URLs
- **Duplicate prevention**: Checks for existing emails before signup
- **Error handling**: Comprehensive error messages for users
- **Admin functions**: Statistics and data management for authenticated users

### Step 2: Update Landing Page Component

The `WaitlistSection` component has been enhanced with:

- **Better UX**: Success/error messages, loading states
- **Name field**: Optional name collection
- **Form validation**: Email validation and required fields
- **Responsive design**: Works on all device sizes

### Step 3: Add Admin Component (Optional)

The `WaitlistAdmin` component provides:

- **Statistics dashboard**: Total, daily, weekly, monthly signups
- **Data table**: View all signups with filtering
- **Export functionality**: Download data as JSON
- **Delete capability**: Remove signups (with confirmation)

## 🚀 Usage Examples

### Basic Signup

```typescript
import { sazonWaitlistService } from '../lib/waitlistService';

// Simple signup
await sazonWaitlistService.signup('user@example.com');

// Signup with additional data
await sazonWaitlistService.signup('user@example.com', {
  full_name: 'John Doe',
  source: 'landing_page',
  preferences: {
    dietaryRestrictions: ['vegetarian'],
    cuisinePreferences: ['mexican', 'italian'],
    cookingLevel: 'intermediate'
  }
});
```

### Signup with UTM Tracking

```typescript
// Automatically captures UTM parameters from URL
await sazonWaitlistService.signupWithTracking('user@example.com', {
  full_name: 'John Doe',
  source: 'landing_page'
});
```

### Admin Functions

```typescript
// Get statistics (requires authentication)
const stats = await sazonWaitlistService.getStats();
console.log(`Total signups: ${stats.total_signups}`);

// Get all signups (requires authentication)
const signups = await sazonWaitlistService.getAllSignups(100, 0);

// Export data (requires authentication)
const jsonData = await sazonWaitlistService.exportSignups();
```

## 📊 Data Structure

### Waitlist Signup Record

```typescript
interface SazonWaitlistSignup {
  id?: string;                    // UUID, auto-generated
  email: string;                  // User's email (unique)
  full_name?: string;             // Optional name
  source?: string;                // Signup source (default: 'landing_page')
  preferences?: {                 // User preferences
    dietaryRestrictions?: string[];
    cuisinePreferences?: string[];
    cookingLevel?: string;
  };
  ip_address?: string;            // User's IP (if available)
  user_agent?: string;            // Browser info
  referrer?: string;              // Referring URL
  utm_source?: string;            // UTM tracking
  utm_medium?: string;
  utm_campaign?: string;
  created_at?: string;            // Timestamp
  updated_at?: string;            // Last update
}
```

### Statistics Response

```typescript
interface SazonWaitlistStats {
  total_signups: number;          // All-time total
  today_signups: number;          // Signups today
  this_week_signups: number;      // Signups this week
  this_month_signups: number;     // Signups this month
}
```

## 🔐 Security Features

### Row Level Security (RLS)

- **Public Insert**: Anyone can sign up for the waitlist
- **Authenticated Read**: Only authenticated users can view data
- **Authenticated Update/Delete**: Only authenticated users can modify data

### Data Protection

- **Email Validation**: Server-side email format validation
- **Duplicate Prevention**: Prevents multiple signups with same email
- **Input Sanitization**: Trims whitespace and normalizes data

## 📈 Analytics & Tracking

### UTM Parameter Tracking

The system automatically captures UTM parameters from URLs:
- `utm_source`: Traffic source (e.g., 'google', 'facebook')
- `utm_medium`: Marketing medium (e.g., 'cpc', 'social')
- `utm_campaign**: Campaign name (e.g., 'summer_launch')

### Usage Examples

```bash
# Example URLs with UTM tracking
https://yoursite.com/?utm_source=google&utm_medium=cpc&utm_campaign=summer_launch
https://yoursite.com/?utm_source=facebook&utm_medium=social&utm_campaign=organic
```

## 🛠️ Troubleshooting

### Common Issues

1. **"Email already signed up" error**
   - The system prevents duplicate emails
   - Check if the email exists in the database

2. **Permission denied errors**
   - Ensure RLS policies are properly set up
   - Verify user authentication for admin functions

3. **Statistics not loading**
   - Check if the `get_waitlist_stats()` function exists
   - Verify user has proper permissions

### Debug Queries

```sql
-- Check if table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_name = 'waitlist_signups'
);

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'waitlist_signups';

-- Check recent signups
SELECT email, created_at, source, utm_source 
FROM waitlist_signups 
ORDER BY created_at DESC 
LIMIT 10;
```

## 🎨 Customization

### Styling the Waitlist Form

The `WaitlistSection` component uses Tailwind CSS classes. You can customize:

- **Colors**: Update the gradient classes (`from-orange-600 to-red-600`)
- **Layout**: Modify the grid and spacing classes
- **Typography**: Change font sizes and weights

### Adding Custom Fields

To add custom fields to the waitlist:

1. **Update the database table**:
```sql
ALTER TABLE waitlist_signups 
ADD COLUMN custom_field TEXT;
```

2. **Update the TypeScript interface**:
```typescript
interface SazonWaitlistSignup {
  // ... existing fields
  custom_field?: string;
}
```

3. **Update the form component** to include the new field

## 📞 Support

If you encounter any issues:

1. Check the browser console for error messages
2. Verify Supabase connection and permissions
3. Review the database setup script
4. Check the troubleshooting section above

## 🚀 Next Steps

After setup, consider:

- **Email Integration**: Connect to email service (Mailchimp, ConvertKit)
- **Analytics**: Add Google Analytics tracking
- **A/B Testing**: Test different form designs
- **Automation**: Set up welcome email sequences
- **CRM Integration**: Connect to customer relationship management tools 