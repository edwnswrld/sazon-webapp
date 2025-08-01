# Supabase Database Schema

This document outlines the complete database schema for Sazon AI, including tables, relationships, and Row Level Security (RLS) policies.

## 🗄️ Database Overview

Sazon AI uses Supabase PostgreSQL with the following core tables:
- `user_profiles` - User preferences and dietary information
- `meal_plans` - Generated meal plans and recipes
- `saved_meal_plans` - User's saved meal plans
- `user_preferences` - Extended user preferences

## 📋 Table Definitions

### 1. User Profiles Table

```sql
-- Create user_profiles table
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    dietary_preferences TEXT[] DEFAULT '{}',
    allergies TEXT[] DEFAULT '{}',
    household_size INTEGER DEFAULT 1 CHECK (household_size > 0),
    cooking_skill_level TEXT CHECK (cooking_skill_level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',

    cuisine_preferences TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_user_profiles_email ON user_profiles(email);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

### 2. Meal Plans Table

```sql
-- Create meal_plans table
CREATE TABLE meal_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    name TEXT,
    meals JSONB NOT NULL,
    grocery_list JSONB NOT NULL,
    total_estimated_cost DECIMAL(10,2) NOT NULL,
    preparation_time TEXT,
    difficulty_level TEXT,
    dietary_tags TEXT[] DEFAULT '{}',
    cuisine_tags TEXT[] DEFAULT '{}',
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_meal_plans_user_id ON meal_plans(user_id);
CREATE INDEX idx_meal_plans_created_at ON meal_plans(created_at DESC);
CREATE INDEX idx_meal_plans_is_favorite ON meal_plans(is_favorite);

-- Create trigger for updated_at
CREATE TRIGGER update_meal_plans_updated_at 
    BEFORE UPDATE ON meal_plans 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

### 3. Saved Meal Plans Table

```sql
-- Create saved_meal_plans table for user's saved/favorited plans
CREATE TABLE saved_meal_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    meal_plan_id UUID NOT NULL REFERENCES meal_plans(id) ON DELETE CASCADE,
    saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    UNIQUE(user_id, meal_plan_id)
);

-- Create indexes
CREATE INDEX idx_saved_meal_plans_user_id ON saved_meal_plans(user_id);
CREATE INDEX idx_saved_meal_plans_meal_plan_id ON saved_meal_plans(meal_plan_id);
```

### 4. User Preferences Table (Extended)

```sql
-- Create extended user preferences table
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    preference_key TEXT NOT NULL,
    preference_value JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, preference_key)
);

-- Create indexes
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX idx_user_preferences_key ON user_preferences(preference_key);

-- Create trigger for updated_at
CREATE TRIGGER update_user_preferences_updated_at 
    BEFORE UPDATE ON user_preferences 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

## 🔐 Row Level Security (RLS) Policies

### Enable RLS on all tables

```sql
-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
```

### User Profiles Policies

```sql
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Users can delete their own profile
CREATE POLICY "Users can delete own profile" ON user_profiles
    FOR DELETE USING (auth.uid() = id);
```

### Meal Plans Policies

```sql
-- Users can view their own meal plans
CREATE POLICY "Users can view own meal plans" ON meal_plans
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own meal plans
CREATE POLICY "Users can insert own meal plans" ON meal_plans
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own meal plans
CREATE POLICY "Users can update own meal plans" ON meal_plans
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own meal plans
CREATE POLICY "Users can delete own meal plans" ON meal_plans
    FOR DELETE USING (auth.uid() = user_id);
```

### Saved Meal Plans Policies

```sql
-- Users can view their own saved meal plans
CREATE POLICY "Users can view own saved meal plans" ON saved_meal_plans
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own saved meal plans
CREATE POLICY "Users can insert own saved meal plans" ON saved_meal_plans
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own saved meal plans
CREATE POLICY "Users can update own saved meal plans" ON saved_meal_plans
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own saved meal plans
CREATE POLICY "Users can delete own saved meal plans" ON saved_meal_plans
    FOR DELETE USING (auth.uid() = user_id);
```

### User Preferences Policies

```sql
-- Users can view their own preferences
CREATE POLICY "Users can view own preferences" ON user_preferences
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own preferences
CREATE POLICY "Users can insert own preferences" ON user_preferences
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own preferences
CREATE POLICY "Users can update own preferences" ON user_preferences
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own preferences
CREATE POLICY "Users can delete own preferences" ON user_preferences
    FOR DELETE USING (auth.uid() = user_id);
```

## 🔄 Database Functions

### Create User Profile Function

```sql
-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Get User Meal Plans Function

```sql
-- Function to get user's meal plans with metadata
CREATE OR REPLACE FUNCTION get_user_meal_plans(user_uuid UUID)
RETURNS TABLE (
    id UUID,
    name TEXT,
    total_estimated_cost DECIMAL(10,2),
    preparation_time TEXT,
    difficulty_level TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    is_favorite BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        mp.id,
        mp.name,
        mp.total_estimated_cost,
        mp.preparation_time,
        mp.difficulty_level,
        mp.created_at,
        mp.is_favorite
    FROM meal_plans mp
    WHERE mp.user_id = user_uuid
    ORDER BY mp.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## 📊 Data Types and Constraints

### Enums

```sql
-- Create custom types for better data integrity
CREATE TYPE cooking_skill_level AS ENUM ('beginner', 'intermediate', 'advanced');

CREATE TYPE difficulty_level AS ENUM ('easy', 'intermediate', 'hard');
```

### JSONB Schema Validation

```sql
-- Function to validate meal plan JSON structure
CREATE OR REPLACE FUNCTION validate_meal_plan(plan_data JSONB)
RETURNS BOOLEAN AS $$
BEGIN
    -- Check if meals array exists and is not empty
    IF NOT (plan_data ? 'meals' AND jsonb_array_length(plan_data->'meals') > 0) THEN
        RETURN FALSE;
    END IF;
    
    -- Check if grocery_list exists
    IF NOT (plan_data ? 'grocery_list') THEN
        RETURN FALSE;
    END IF;
    
    -- Check if total_estimated_cost exists and is numeric
    IF NOT (plan_data ? 'total_estimated_cost' AND 
            jsonb_typeof(plan_data->'total_estimated_cost') = 'number') THEN
        RETURN FALSE;
    END IF;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;
```

## 🔍 Sample Queries

### Get User Profile with Preferences

```sql
SELECT 
    up.*,
    array_agg(upref.preference_key) as extended_preferences
FROM user_profiles up
LEFT JOIN user_preferences upref ON up.id = upref.user_id
WHERE up.id = $1
GROUP BY up.id;
```

### Get Recent Meal Plans

```sql
SELECT 
    mp.*,
    jsonb_array_length(mp.meals) as meal_count
FROM meal_plans mp
WHERE mp.user_id = $1
ORDER BY mp.created_at DESC
LIMIT 10;
```

### Get Favorite Meal Plans

```sql
SELECT 
    mp.*,
    smp.saved_at,
    smp.notes
FROM meal_plans mp
JOIN saved_meal_plans smp ON mp.id = smp.meal_plan_id
WHERE smp.user_id = $1
ORDER BY smp.saved_at DESC;
```

## 🚀 Database Setup Script

```sql
-- Complete database setup script
-- Run this in your Supabase SQL editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables (run the table creation scripts above)

-- Enable RLS (run the RLS enable scripts above)

-- Create policies (run the policy creation scripts above)

-- Create functions (run the function creation scripts above)

-- Create triggers (run the trigger creation scripts above)

-- Insert sample data (optional)
INSERT INTO user_profiles (id, email, full_name, dietary_preferences, household_size)
VALUES (
    '00000000-0000-0000-0000-000000000000',
    'demo@example.com',
    'Demo User',
    ARRAY['vegetarian'],
    2
);
```

## 🔧 Database Maintenance

### Regular Maintenance Tasks

```sql
-- Analyze tables for better query performance
ANALYZE user_profiles;
ANALYZE meal_plans;
ANALYZE saved_meal_plans;
ANALYZE user_preferences;

-- Vacuum tables to reclaim storage
VACUUM ANALYZE user_profiles;
VACUUM ANALYZE meal_plans;
VACUUM ANALYZE saved_meal_plans;
VACUUM ANALYZE user_preferences;
```

### Backup Strategy

- **Automated backups**: Supabase provides daily automated backups
- **Point-in-time recovery**: Available for disaster recovery
- **Manual exports**: Use Supabase CLI for manual database exports

---

This schema provides a robust foundation for the Sazon AI application with proper security, performance, and scalability considerations. 