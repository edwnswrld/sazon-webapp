# 🚀 Sazón Deployment Architecture & Project Structure

## 📋 Overview

This document outlines the **deployment-ready architecture** for Sazón, a culturally aware meal planning app. The project is structured for **dual deployment**:
- **Frontend**: Vite + React → Vercel
- **Backend**: Express API → Render

## 🎯 Current Status

### ✅ **Completed (Phase 1 & 2)**
- **Backend Separation**: Express API server fully implemented and separated from frontend
- **Frontend Updates**: API client updated to call external backend, backend logic removed
- **Environment Configuration**: Both frontend and backend have proper .env files
- **Authentication**: Supabase JWT validation middleware implemented
- **API Integration**: Frontend successfully calls backend API endpoints
- **Testing**: Basic test structure implemented for backend middleware

### 🔄 **Next Steps (Phase 3)**
- **Deployment Configuration**: Set up Vercel and Render deployment
- **Production Environment Variables**: Configure production environment variables
- **End-to-End Testing**: Test complete deployment pipeline

## 🏗️ Current Architecture Analysis

### Frontend Structure (Vite + React)
```
sazon-mvp/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── AuthWrapper.tsx  # Authentication guard
│   │   ├── DevModeToggle.tsx # Dev mode toggle
│   │   ├── GroceryListSection.tsx # Shopping list display
│   │   ├── MealCard.tsx     # Individual meal display
│   │   └── Navbar.tsx       # Navigation component
│   │
│   ├── pages/              # Route components
│   │   ├── AuthCallback.tsx # OAuth callback handling
│   │   ├── Dashboard.tsx    # Main user dashboard
│   │   ├── DevOnboarding.tsx # Dev mode onboarding
│   │   ├── Home.tsx         # Landing/sign-in page
│   │   ├── Onboarding.tsx   # User preferences setup
│   │   ├── Plan.tsx         # Meal plan generation
│   │   ├── ResetPassword.tsx # Password reset flow
│   │   └── Settings.tsx     # User settings page
│   │
│   ├── lib/                # Utilities and services
│   │   ├── api.ts          # API client and endpoints ✅ Updated for external backend
│   │   ├── auth.ts         # Authentication utilities
│   │   ├── devAuth.ts      # Development auth bypass
│   │   ├── onboardingUtils.ts # Onboarding helpers
│   │   └── supabaseClient.ts # Supabase client config
│   │
│   ├── context/            # React context providers
│   │   └── UserContext.tsx # Global user state management
│   │
│   ├── routes/             # Routing configuration
│   │   └── AppRoutes.tsx   # Main routing setup
│   │
│   ├── styles/             # Global styles
│   │   └── globals.css     # Tailwind and custom CSS
│   │
│   ├── assets/             # Static assets
│   ├── App.tsx             # Root app component
│   └── main.tsx            # App entry point
│
├── public/                 # Static files for Vite
├── dist/                   # Build output (for Vercel)
├── package.json            # Frontend dependencies
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind CSS config
├── tsconfig.json           # TypeScript config
└── .env                    # Environment variables
```

### Current Backend Structure ✅ (Separated)
```
backend/
├── src/
│   ├── controllers/        # Route handlers
│   │   └── mealPlanningController.ts ✅
│   ├── services/          # Business logic
│   │   └── mealPlanningService.ts ✅
│   ├── middleware/        # Express middleware
│   │   ├── auth.ts ✅
│   │   └── errorHandler.ts ✅
│   ├── utils/            # Utility functions
│   │   └── logger.ts ✅
│   ├── config/           # Configuration
│   │   └── index.ts ✅
│   ├── types/            # TypeScript types
│   │   └── index.ts ✅
│   └── index.ts          # Express app setup ✅
├── package.json          # Backend dependencies ✅
├── tsconfig.json         # Backend TypeScript config ✅
└── .env                  # Backend environment variables ✅
```

## 🔄 Architecture Changes for Deployment ✅

### 1. Backend Separation (Express API) ✅

**Status**: ✅ **COMPLETED** - Backend has been successfully separated from frontend.

**Current Structure**:
```
sazon-mvp/
├── frontend/               # Vite + React app
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── lib/
│   │   │   └── api.ts      # Updated to call external API
│   │   └── ...
│   ├── package.json
│   ├── vite.config.ts
│   └── ...
│
├── backend/                # Express API server
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   │   └── mealPlanController.ts
│   │   ├── routes/         # API routes
│   │   │   └── mealPlanRoutes.ts
│   │   ├── services/       # Business logic
│   │   │   └── generatePlanService.ts
│   │   ├── middleware/     # Express middleware
│   │   │   ├── auth.ts
│   │   │   ├── cors.ts
│   │   │   └── validation.ts
│   │   ├── utils/          # Utility functions
│   │   │   └── openai.ts
│   │   ├── types/          # TypeScript types
│   │   │   └── index.ts
│   │   └── app.ts          # Express app setup
│   ├── package.json        # Backend dependencies
│   ├── tsconfig.json       # Backend TypeScript config
│   └── .env                # Backend environment variables
│
└── shared/                 # Shared types and utilities
    ├── types/
    └── constants/
```

### 2. Environment Configuration

**Frontend (.env for Vercel)**:
```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# API Configuration
VITE_API_BASE_URL=https://your-render-app.onrender.com

# OpenAI Configuration (if needed in frontend)
VITE_OPENAI_API_KEY=your_openai_key

# Environment
VITE_NODE_ENV=production
```

**Backend (.env for Render)**:
```env
# Server Configuration
PORT=3001
NODE_ENV=production

# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# CORS Configuration
FRONTEND_URL=https://your-vercel-app.vercel.app

# Database Configuration
DATABASE_URL=your_database_url
```

## 🚀 Deployment Preparation

### Frontend Deployment (Vercel)

**1. Build Configuration**:
```json
// package.json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

**2. Vite Configuration for Production**:
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu']
        }
      }
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  }
})
```

**3. Vercel Configuration**:
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### Backend Deployment (Render)

**1. Express Server Setup**:
```typescript
// backend/src/app.ts
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import mealPlanRoutes from './routes/mealPlanRoutes'
import authMiddleware from './middleware/auth'

const app = express()
const PORT = process.env.PORT || 3001

// Security middleware
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})
app.use(limiter)

// Body parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/meal-plan', authMiddleware, mealPlanRoutes)

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export default app
```

**2. Backend Package Configuration**:
```json
// backend/package.json
{
  "name": "sazon-backend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/app.ts",
    "build": "tsc",
    "start": "node dist/app.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5",
    "@supabase/supabase-js": "^2.38.4",
    "openai": "^4.20.1",
    "zod": "^4.0.14",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/node": "^20.10.0",
    "typescript": "^5.2.2",
    "tsx": "^4.6.0"
  }
}
```

**3. Render Configuration**:
```yaml
# render.yaml
services:
  - type: web
    name: sazon-backend
    env: node
    plan: free
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 3001
      - key: SUPABASE_URL
        sync: false
      - key: SUPABASE_SERVICE_ROLE_KEY
        sync: false
      - key: OPENAI_API_KEY
        sync: false
      - key: FRONTEND_URL
        sync: false
```

## 🔧 Migration Steps

### Phase 1: Backend Separation ✅
- [x] **Create backend directory structure**
- [x] **Move `generatePlan.ts` to backend services**
- [x] **Set up Express server with proper middleware**
- [x] **Create API routes and controllers**
- [x] **Add authentication middleware**

### Phase 2: Frontend Updates ✅
- [x] **Update API client to call external backend**
- [x] **Remove backend logic from frontend**
- [x] **Update environment variables**
- [x] **Test API integration**

### Phase 3: Deployment Setup
- [ ] **Configure Vercel for frontend**
- [ ] **Configure Render for backend**
- [ ] **Set up environment variables in both platforms**
- [ ] **Test end-to-end functionality**

## 🔐 Security Considerations

### Frontend Security
- **Environment Variables**: All sensitive data in `VITE_*` variables
- **CORS**: Configured to only allow backend domain
- **Content Security Policy**: Implemented via Vite
- **HTTPS**: Enforced by Vercel

### Backend Security
- **Authentication**: Supabase JWT validation
- **Rate Limiting**: Express rate limiter
- **CORS**: Restricted to frontend domain
- **Helmet**: Security headers
- **Input Validation**: Zod schemas for all inputs
- **Environment Variables**: No secrets in code

## 📊 Performance Optimization

### Frontend (Vercel)
- **Code Splitting**: Automatic with Vite
- **Asset Optimization**: Vite build optimization
- **CDN**: Vercel's global CDN
- **Caching**: Static assets cached aggressively

### Backend (Render)
- **Connection Pooling**: Database connection management
- **Response Caching**: Redis for frequently accessed data
- **Compression**: Gzip compression
- **Load Balancing**: Render's built-in load balancer

## 🧪 Testing Strategy

### Frontend Testing
```typescript
// Example test structure
src/
├── __tests__/
│   ├── components/
│   │   └── MealCard.test.tsx
│   ├── pages/
│   │   └── Dashboard.test.tsx
│   └── lib/
│       └── api.test.ts
```

### Backend Testing ✅
```typescript
// Current test structure
backend/
├── src/
│   └── middleware/
│       └── __tests__/
│           └── auth.test.ts  ✅ Implemented
```

## 📈 Monitoring & Logging

### Frontend Monitoring
- **Vercel Analytics**: Performance monitoring
- **Error Tracking**: Sentry integration
- **User Analytics**: Privacy-compliant tracking

### Backend Monitoring
- **Render Logs**: Application logs
- **Health Checks**: `/health` endpoint
- **Error Tracking**: Structured error logging
- **Performance Monitoring**: Response time tracking

## 🔄 CI/CD Pipeline

### Frontend (Vercel)
- **Automatic Deployments**: Git push triggers deployment
- **Preview Deployments**: Pull request previews
- **Environment Management**: Production/staging environments

### Backend (Render)
- **Automatic Deployments**: Git push triggers deployment
- **Health Checks**: Automatic rollback on failure
- **Environment Variables**: Secure environment management

## 📝 Deployment Checklist

### Pre-Deployment ✅
- [x] Backend separated from frontend
- [x] Environment variables configured
- [x] API endpoints tested
- [x] Security middleware implemented
- [x] Error handling configured
- [x] Performance optimizations applied

### Frontend Deployment (Vercel)
- [ ] Build configuration optimized
- [ ] Environment variables set in Vercel
- [ ] Custom domain configured (if needed)
- [ ] SSL certificate enabled
- [ ] Performance monitoring enabled

### Backend Deployment (Render)
- [ ] Express server configured
- [ ] Environment variables set in Render
- [ ] Health check endpoint implemented
- [ ] Logging configured
- [ ] Rate limiting enabled

### Post-Deployment
- [ ] End-to-end functionality tested
- [ ] Performance benchmarks met
- [ ] Security scan completed
- [ ] Monitoring alerts configured
- [ ] Backup strategy implemented

## 🎯 Next Steps

1. **Immediate**: Separate backend logic from frontend
2. **Short-term**: Set up Express API server
3. **Medium-term**: Configure deployment environments
4. **Long-term**: Implement monitoring and optimization

This architecture ensures a **scalable, secure, and maintainable** deployment strategy for Sazón's dual-platform setup. 