# 📜 Sazón Web App – Cursor Rules

## 🧠 About the App
**Sazón** is a culturally aware meal planning app for busy parents.  
It generates **3-day meal plans** (breakfast, lunch, dinner) based on user preferences.

Includes:
- Grocery lists grouped by category and labeled per meal
- Recipes with ingredients and full instructions
- Customization for cuisine, dietary needs, and allergies

🎯 Goal: Help families eat healthy, flavorful meals — without the stress.

---

## 🛠️ Tech Stack

**Frontend**:
- React + TypeScript + Vite

**Styling**:
- Tailwind CSS
- Radix UI
- Lucide React

**State/Form Management**:
- React Hook Form
- Zod

**Routing**:
- React Router DOM

**Data Fetching**:
- React Query

**Authentication**:
- Supabase Auth (magic link)

**Database**:
- Supabase PostgreSQL

**AI Integration**:
- OpenAI GPT-4

**Deployment**:
- Frontend → Vercel  
- Backend → Render

---

## 📁 Project Structure & Architecture

```
sazon-mvp/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── AuthWrapper.tsx  # Authentication guard component
│   │   ├── DevModeToggle.tsx # Development mode toggle
│   │   ├── GroceryListSection.tsx # Grocery list display
│   │   ├── MealCard.tsx     # Individual meal display
│   │   └── Navbar.tsx       # Navigation component
│   │
│   ├── pages/              # Page components (routes)
│   │   ├── AuthCallback.tsx # OAuth callback handling
│   │   ├── Dashboard.tsx    # Main user dashboard
│   │   ├── DevOnboarding.tsx # Dev mode onboarding
│   │   ├── Home.tsx         # Landing/sign-in page
│   │   ├── Onboarding.tsx   # User preferences setup
│   │   ├── Plan.tsx         # Meal plan generation
│   │   ├── ResetPassword.tsx # Password reset flow
│   │   └── Settings.tsx     # User settings page
│   │
│   ├── lib/                # Utility functions and services
│   │   ├── api.ts          # API client and endpoints
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
│   ├── backend/            # Backend API functions
│   │   └── generatePlan.ts # Meal plan generation logic
│   │
│   ├── styles/             # Global styles
│   │   └── globals.css     # Tailwind and custom CSS
│   │
│   ├── assets/             # Static assets
│   ├── App.tsx             # Root app component
│   └── main.tsx            # App entry point
│
├── .cursorrules/           # Cursor IDE configuration
├── docs/                   # Documentation files
└── config files            # Package.json, tsconfig, etc.
```

---

## 🔐 Authentication & Authorization

**Authentication Flow**:
1. **Magic Link**: Users sign in via email magic link (Supabase Auth)
2. **OAuth Callback**: `AuthCallback.tsx` handles redirect after email verification
3. **Protected Routes**: `AuthWrapper.tsx` guards authenticated routes
4. **Dev Mode**: `DevModeToggle.tsx` provides bypass for development

**Key Components**:
- `src/lib/auth.ts`: Core authentication utilities
- `src/lib/devAuth.ts`: Development mode authentication bypass
- `src/components/AuthWrapper.tsx`: Route protection component
- `src/pages/AuthCallback.tsx`: OAuth callback handling

**User State Management**:
- `src/context/UserContext.tsx`: Global user state and profile management
- User preferences stored in Supabase `user_profiles` table
- Local state for development mode

---

## 🎯 State Management & Data Flow

**Global State**:
- `UserContext.tsx`: Manages user authentication and profile data
- React Query: Handles server state and caching
- Local Storage: Dev mode preferences and temporary data

**Data Flow Pattern**:
1. **User Context**: Provides user data to all components
2. **React Query**: Manages API calls and caching
3. **Form State**: React Hook Form for form management
4. **Validation**: Zod schemas for type safety

**Key State Patterns**:
- User profile: Stored in context, synced with Supabase
- Meal plans: Fetched via React Query, cached for 3 days
- Form data: Managed by React Hook Form with Zod validation
- Dev mode: Local storage for development convenience

---

## 🔌 API Integration & Backend

**API Structure**:
- `src/lib/api.ts`: Centralized API client
- `src/backend/generatePlan.ts`: Meal plan generation logic
- Supabase: Database and authentication backend

**Key Endpoints**:
- `/api/generate-plan`: Creates meal plans using GPT-4
- Supabase RPC: Database operations and user management
- OpenAI API: Recipe generation and meal planning

**Data Flow**:
1. User submits preferences → API validation
2. GPT-4 generates meal plan → Database storage
3. React Query fetches and caches results
4. UI displays meal plan with grocery list

**Error Handling**:
- API errors caught and displayed via toast notifications
- Network errors handled gracefully with retry logic
- Validation errors shown inline in forms

---

## 🧪 Development Workflow

**Development Mode**:
- Toggle dev mode via `DevModeToggle.tsx` component
- Automatic login as `dev@sazon.ai`
- Mock user profile for testing
- Local state management (no database writes)
- Visual indicator in navbar when active

**Development Tools**:
- TypeScript: Strict type checking enabled
- ESLint: Code quality and consistency
- Vite: Fast development server and build tool
- Hot reload: Automatic refresh on file changes

**Testing Strategy**:
- Component testing: Individual component validation
- Integration testing: User flow testing
- Manual testing: Dev mode for rapid iteration
- Error boundary testing: Graceful error handling

**Code Quality**:
- TypeScript: No `any` types, strict typing
- ESLint: Enforce coding standards
- Prettier: Consistent code formatting
- Component modularity: Reusable, testable components

---

## 🗄️ Database Schema & Data Models

**Core Tables** (see `supabase-schema.md`):
- `users`: Supabase auth users
- `user_profiles`: Extended user preferences
- `meal_plans`: Generated meal plans
- `recipes`: Individual recipe data
- `grocery_lists`: Shopping list items

**Data Relationships**:
- User → Profile (1:1)
- User → Meal Plans (1:many)
- Meal Plan → Recipes (1:many)
- Meal Plan → Grocery List (1:1)

**Key Data Patterns**:
- User preferences: Cuisine, dietary restrictions, allergies
- Meal plans: 3-day plans with breakfast, lunch, dinner
- Recipes: Ingredients, instructions, cooking time
- Grocery lists: Categorized items with quantities

---

## 🧩 Component Architecture

**Component Hierarchy**:
```
App.tsx
├── UserContext.Provider
├── QueryClient.Provider
└── Router
    ├── AuthWrapper (protected routes)
    │   ├── Navbar
    │   ├── Dashboard
    │   ├── Plan
    │   └── Settings
    └── Public Routes
        ├── Home
        ├── Onboarding
        └── AuthCallback
```

**Component Patterns**:
- **Container Components**: Pages that manage data and state
- **Presentational Components**: Reusable UI components
- **Layout Components**: Structure and navigation
- **Form Components**: Input handling and validation

**Key Components**:
- `MealCard.tsx`: Displays individual meal with recipe
- `GroceryListSection.tsx`: Categorized shopping list
- `Navbar.tsx`: Navigation and user menu
- `AuthWrapper.tsx`: Route protection and auth state

---

## 🧭 Routing & Navigation

**Route Structure**:
- `/`: Landing page (Home.tsx)
- `/onboarding`: User preferences setup
- `/dashboard`: Main user dashboard
- `/plan`: Meal plan generation and display
- `/settings`: User settings and preferences
- `/auth/callback`: OAuth callback handling
- `/reset-password`: Password reset flow

**Navigation Flow**:
1. **Unauthenticated**: Home → Onboarding → Dashboard
2. **Authenticated**: Dashboard → Plan → Settings
3. **Dev Mode**: Direct access to all routes

**Route Protection**:
- `AuthWrapper.tsx`: Guards authenticated routes
- Redirects to home if not authenticated
- Dev mode bypass for development

---

## 🎨 Styling & Design System

**Styling Approach**:
- **Tailwind CSS**: Utility-first styling
- **Radix UI**: Accessible component primitives
- **Lucide React**: Consistent icon system
- **Framer Motion**: Smooth animations and transitions

**Design Principles**:
- Mobile-first responsive design
- Consistent spacing and typography
- Accessible color contrast
- Touch-friendly interface elements

**Component Styling**:
- Utility classes preferred over custom CSS
- Component-specific styles in individual files
- Global styles in `src/styles/globals.css`
- Dark mode support (future enhancement)

**Key Styling Patterns**:
- Responsive breakpoints: sm, md, lg, xl
- Consistent spacing: 4, 8, 16, 24, 32px
- Color system: Primary, secondary, accent colors
- Typography: Heading and body text hierarchy

---

## ⚠️ Error Handling & Validation

**Form Validation**:
- **Zod**: Schema validation for all forms
- **React Hook Form**: Form state management
- **Inline Errors**: Real-time validation feedback
- **Toast Notifications**: Success/error messages

**Error Boundaries**:
- Graceful error handling for component failures
- User-friendly error messages
- Fallback UI for critical errors
- Error logging for debugging

**API Error Handling**:
- Network error detection and retry logic
- Rate limiting and timeout handling
- User-friendly error messages
- Error state management in React Query

**Validation Patterns**:
- Required field validation
- Email format validation
- Password strength requirements
- Custom validation rules for preferences

---

## ✅ MVP Features (Must Have)

- [x] Email login with magic link
- [x] User preferences: first name, cuisine, dietary restrictions, allergies
- [x] 3-day meal plan (breakfast, lunch, dinner)
- [x] Recipes: meal name, ingredients, instructions
- [x] Grocery list: grouped by category, includes quantity, labeled per meal
- [x] Mobile-first design
- [x] Recipe feedback form
- [x] GPT outputs stored in DB, expire after 3 days
- [x] Basic subscription model (billing system to be decided)

---

## 🚫 Out of Scope for MVP

- [ ] Editable grocery list
- [ ] Instacart or shopping integration
- [ ] Community uploads or recipe sharing
- [ ] Calendar or meal scheduling
 

---

## ⚙️ Development Rules

- Use Tailwind utility classes before writing custom CSS
- All UI components must be responsive (mobile-first)
- Validate all forms using `zod`
- Use React Query for data fetching with caching
- Store and expire GPT outputs in backend (3-day TTL)
- Protect all user-authenticated routes
- Avoid hardcoding secrets in frontend (use `.env`)
- Icons must come from Lucide React
- Add Framer Motion for smooth transitions where it improves UX

---

## 🧪 Code Best Practices

- TypeScript: no `any`
- Break UI into modular, reusable components
- Prefer semantic HTML (accessibility matters)
- Write pure functions where possible
- Minimal business logic in frontend
- Basic tests for utilities and helpers encouraged

---

## 💸 Subscription Model

- Free plan: 3-day plan, once per IP address
- Paid plan: full weekly access
- Billing provider: Stripe 
- Capture emails for waitlist + conversion funnel (through supabase)

---

## ✍️ Branding & Voice

- Emphasize **flavor, family, and simplicity**
- Avoid sterile or fitness-first tone
- Examples:
  - ✅ "Healthy meals shouldn't be boring."
  - ✅ "Cook with flavor, plan with ease."
  - ❌ "Optimize your macros."

---

## 📚 Additional Documentation

**Related Files**:
- `README.md`: Project overview and setup instructions
- `supabase-schema.md`: Detailed database schema
- `sazon-ai-stack.md`: Comprehensive tech stack documentation
- `prompt-template.md`: GPT prompt templates and AI configuration

**Development Resources**:
- Supabase Dashboard: Database management and auth
- Vercel Dashboard: Frontend deployment and monitoring
- OpenAI Platform: API usage and billing
- Tailwind CSS Docs: Styling reference

---

## 🚀 Quick Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Preview production build
npm run preview
```

---

This overview should guide all aspects of the Sazón codebase, from architecture decisions to development workflows. Use this as your primary reference when working on the project.
