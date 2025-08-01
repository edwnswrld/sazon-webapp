# 🛣️ Sazón Routing Structure

## Overview

This document outlines the routing structure for the Sazón application, which is organized to separate public-facing content from the authenticated application.

## 🏗️ Route Structure

### **Public Routes**
- **`/`** - Landing page (for non-authenticated users)
- **`/landing`** - Direct access to landing page
- **`/auth/callback`** - Authentication callback
- **`/reset-password`** - Password reset page

### **App Routes (Authenticated)**
All authenticated routes are prefixed with `/app`:

- **`/app`** - App layout with navigation
- **`/app/dashboard`** - Main dashboard
- **`/app/plan`** - Meal planning interface
- **`/app/grocery`** - Grocery list management
- **`/app/settings`** - User settings
- **`/app/onboarding`** - User onboarding flow

### **Legacy Routes (Redirects)**
For backward compatibility, old routes redirect to new `/app` routes:

- **`/dashboard`** → `/app/dashboard`
- **`/plan`** → `/app/plan`
- **`/grocery`** → `/app/grocery`
- **`/settings`** → `/app/settings`
- **`/onboarding`** → `/app/onboarding`

## 🔐 Authentication Flow

### **Non-Authenticated Users**
1. Visit `/` → See landing page
2. Visit `/landing` → See landing page
3. Visit any `/app/*` route → Redirected to landing page

### **Authenticated Users**
1. Visit `/` → Redirected to `/app/dashboard` (if onboarding complete)
2. Visit `/` → Redirected to `/app/onboarding` (if onboarding incomplete)
3. Visit `/landing` → See landing page (can still access)
4. Visit `/app/*` → Access authenticated app

## 🎨 Layout Structure

### **Landing Page Layout**
- No navigation bar
- Full-width design
- Waitlist signup functionality
- Mock designs and features

### **App Layout (`/app/*`)**
- Navigation bar with logo and user menu
- Bottom navigation for mobile
- Consistent app styling
- Protected by authentication

## 🔧 Technical Implementation

### **Route Components**
- **`AppRoutes.tsx`** - Main routing configuration
- **`AppLayout.tsx`** - Layout wrapper for authenticated routes
- **`AuthWrapper.tsx`** - Authentication protection component

### **Navigation Components**
- **`Navbar.tsx`** - Top navigation bar
- **`BottomNavbar.tsx`** - Mobile bottom navigation

### **Active Route Detection**
Both navigation components use enhanced `isActiveRoute` function:
```typescript
const isActiveRoute = (path: string) => {
  return location.pathname === path || location.pathname === `/app${path}`
}
```

## 🚀 Benefits of This Structure

### **1. Clear Separation**
- Public marketing content vs. authenticated app
- Easy to manage different layouts and styling

### **2. SEO Optimization**
- Landing page at root (`/`) for better SEO
- App routes under `/app` for organization

### **3. User Experience**
- Non-authenticated users see marketing content
- Authenticated users get seamless app experience
- Backward compatibility maintained

### **4. Scalability**
- Easy to add new public routes
- App routes organized under single prefix
- Clear structure for future features

## 📱 Mobile Considerations

### **Bottom Navigation**
- Only shown in app routes (`/app/*`)
- Provides easy access to main features
- Responsive design for all screen sizes

### **Mobile Menu**
- Hamburger menu in top navigation
- Collapsible for better mobile UX
- Consistent across all app routes

## 🔄 Future Considerations

### **Potential Additions**
- **`/blog`** - Content marketing blog
- **`/pricing`** - Pricing page
- **`/about`** - About page
- **`/contact`** - Contact page

### **API Routes**
- **`/api/*`** - Backend API endpoints
- **`/webhooks/*`** - Webhook endpoints

### **Admin Routes**
- **`/admin/*`** - Admin panel (if needed)

## 🐛 Troubleshooting

### **Common Issues**
1. **Route not found**: Check if route is properly defined in `AppRoutes.tsx`
2. **Navigation not working**: Verify `isActiveRoute` function includes both old and new paths
3. **Authentication redirects**: Ensure `AuthWrapper` is properly configured
4. **Layout issues**: Check if route is using correct layout component

### **Development Tips**
- Use React Router DevTools for debugging
- Check browser console for routing errors
- Test both authenticated and non-authenticated flows
- Verify mobile navigation functionality 