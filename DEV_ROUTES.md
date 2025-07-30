# Development Routes

This document describes the development-only routes available in the Sazon AI application.

## Overview

Development routes are only available when running the application in development mode (`import.meta.env.DEV` is `true`). These routes are automatically excluded from production builds.

## Available Development Routes

### `/dev-onboarding`

**Purpose**: Access the onboarding flow without authentication requirements

**Description**: This route allows developers to preview and test the onboarding screens without needing to log in or create a user account. It's useful for:

- Testing the onboarding UI/UX
- Debugging onboarding flow issues
- Demonstrating the onboarding process
- Development and testing without authentication overhead

**Features**:
- Bypasses all authentication requirements
- Shows a development mode indicator banner
- Logs form data to console when completed
- Displays an alert when onboarding is finished
- Uses the same onboarding component as the production flow

**Usage**:
1. Start the development server: `npm run dev`
2. Navigate to: `http://localhost:5173/dev-onboarding`
3. Complete the onboarding flow
4. Check the browser console for the form data
5. An alert will confirm completion

**Security**: This route is automatically disabled in production builds and will redirect to the home page if accessed in production.

## Implementation Details

### Route Configuration

The development routes are conditionally rendered in `src/routes/AppRoutes.tsx`:

```tsx
{import.meta.env.DEV && (
  <Route 
    path="/dev-onboarding" 
    element={
      <React.Suspense fallback={<LoadingSpinner />}>
        <SazonDevOnboardingPage />
      </React.Suspense>
    } 
  />
)}
```

### Component Structure

- `SazonDevOnboardingPage`: Development wrapper component
- `SazonOnboardingPage`: Modified to accept development mode props
- Lazy loading for better performance

### Development Mode Props

The onboarding component accepts these optional props for development mode:

```tsx
interface SazonOnboardingPageProps {
  isDevMode?: boolean
  onDevComplete?: (formData: any) => void
}
```

## Adding New Development Routes

To add a new development route:

1. Create a development wrapper component in `src/pages/`
2. Add the route conditionally in `src/routes/AppRoutes.tsx`
3. Use lazy loading for better performance
4. Add documentation here

## Best Practices

- Always check `import.meta.env.DEV` before rendering development routes
- Use lazy loading for development components
- Provide clear visual indicators that you're in development mode
- Log relevant data to console for debugging
- Never include development routes in production builds 