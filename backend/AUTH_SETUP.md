# 🔐 Sazon Authentication Middleware Setup

This document explains how the authentication middleware works in the Sazon backend and how to use it.

## Overview

The Sazon backend uses **Supabase JWT tokens** for authentication. The authentication middleware validates these tokens and ensures that only authenticated users can access protected endpoints.

## How It Works

### 1. Token Flow
1. **Frontend**: User signs in through Supabase Auth
2. **Frontend**: Gets JWT token from Supabase session
3. **Frontend**: Sends requests with `Authorization: Bearer <token>` header
4. **Backend**: Middleware validates token with Supabase
5. **Backend**: If valid, attaches user info to request and continues
6. **Backend**: If invalid, returns 401 Unauthorized

### 2. Middleware Types

#### Required Authentication (`sazonAuthMiddleware`)
- **Use case**: Protected endpoints that require authentication
- **Behavior**: Blocks requests without valid tokens
- **Response**: 401 Unauthorized if no token or invalid token

#### Optional Authentication (`sazonOptionalAuthMiddleware`)
- **Use case**: Endpoints that work with or without authentication
- **Behavior**: Continues with or without valid tokens
- **Response**: Always continues, attaches user info if token is valid

## Implementation

### Backend Setup

The authentication middleware is already configured in the main Express app:

```typescript
// Protected routes (require authentication)
app.post('/api/meal-plan/generate', 
  sazonAuthMiddleware, 
  mealPlanningController.generateMealPlan
)

// Optional authentication routes
app.post('/api/meal-plan/mock', 
  sazonOptionalAuthMiddleware, 
  mealPlanningController.generateMockMealPlan
)
```

### Frontend Setup

The frontend API client automatically includes authentication tokens:

```typescript
// Helper function gets current Supabase session token
const getAuthToken = async (): Promise<string | null> => {
  const { data: { session } } = await supabaseClient.auth.getSession()
  return session?.access_token || null
}

// API calls automatically include the token
const response = await fetch('/api/meal-plan/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authToken}`,
  },
  body: JSON.stringify(request),
})
```

## Environment Variables

Make sure these environment variables are set in your backend `.env` file:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

## User Information

When authentication is successful, user information is attached to the request object:

```typescript
// In your controller
req.user = {
  id: string,           // Supabase user ID
  email: string,        // User's email
  role?: string,        // User role (if configured)
  metadata?: any        // User metadata from Supabase
}
```

## Error Handling

The middleware provides clear error messages:

### 401 Unauthorized
- No authorization header
- Invalid authorization format
- Invalid or expired token
- Email not confirmed

### 403 Forbidden
- Email not confirmed (if email confirmation is required)

### 500 Internal Server Error
- Authentication middleware error

## Testing

### Manual Testing
1. **Without Token**: Should return 401
2. **With Invalid Token**: Should return 401
3. **With Valid Token**: Should succeed and attach user info

### Automated Testing
Run the test suite:
```bash
cd backend
npm test
```

## Security Features

### Rate Limiting
The middleware includes rate limiting helpers to prevent brute force attacks:

```typescript
import { sazonAuthRateLimit } from './middleware/auth'

// Check if IP has exceeded login attempts
const allowed = sazonAuthRateLimit.checkLimit(req.ip, 5, 15 * 60 * 1000)
```

### Logging
All authentication attempts are logged with:
- User ID (if available)
- IP address
- User agent
- Request path
- Success/failure status

### CORS Protection
CORS is configured to only allow requests from the frontend domain.

## Troubleshooting

### Common Issues

1. **"Authentication required" error**
   - Check if user is signed in to Supabase
   - Verify token is being sent in Authorization header
   - Check if token has expired

2. **"Email not confirmed" error**
   - User needs to confirm their email address
   - Check Supabase Auth settings

3. **CORS errors**
   - Verify CORS_ORIGIN environment variable
   - Check if frontend URL matches backend CORS configuration

### Debug Mode

Enable debug logging by setting `NODE_ENV=development` in your backend environment.

## Next Steps

1. **Role-based Authorization**: Implement role-based access control
2. **Session Management**: Add session timeout and refresh logic
3. **Audit Logging**: Enhance logging for security audits
4. **Rate Limiting**: Implement more sophisticated rate limiting
5. **Two-Factor Authentication**: Add 2FA support if needed

## API Endpoints

### Protected Endpoints (Require Authentication)
- `POST /api/meal-plan/generate` - Generate meal plan
- `POST /api/meal-plan/save` - Save meal plan
- `GET /api/meal-plan/saved` - Get saved meal plans
- `PUT /api/meal-plan/preferences` - Update preferences

### Public Endpoints (No Authentication)
- `GET /api/health` - Health check
- `GET /` - API information

### Optional Authentication Endpoints
- `POST /api/meal-plan/mock` - Generate mock meal plan (for development) 