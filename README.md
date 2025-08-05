# Sazon MVP

A full-stack meal planning application with AI-powered recipe recommendations.

## 🌐 Live URLs

### Current Status: Development/Pre-Deployment

**The app is currently in development and not yet deployed to production.**

#### Local Development URLs:
- **Frontend (Web App)**: `http://localhost:3000` or `http://localhost:5173`
- **Backend API**: `http://localhost:3001`
- **Landing Page**: `http://localhost:3000` (same as frontend)

#### Planned Production URLs:
- **Frontend (Web App)**: `https://sazon-ai.vercel.app` (planned)
- **Backend API**: `https://sazon-backend.onrender.com` (planned)
- **Landing Page**: `https://sazon-ai.vercel.app` (same as frontend)

### 🚀 Quick Deployment

To get the app live:

1. **Deploy Frontend**: `vercel --prod` (from project root)
2. **Deploy Backend**: Create Render Web Service
3. **Update URLs** in this README once deployed

## Project Structure

This project is organized into three main directories:

### 📁 `frontend/`
Contains the React frontend application built with Vite, TypeScript, and Tailwind CSS.

**Key files:**
- `package.json` - Frontend dependencies and scripts
- `vite.config.ts` - Vite configuration
- `src/` - React source code
- `public/` - Static assets
- `tailwind.config.js` - Tailwind CSS configuration

**To run the frontend:**
```bash
cd frontend
npm install
npm run dev
```

### 📁 `backend/`
Contains the Node.js/Express backend API with TypeScript.

**Key files:**
- `package.json` - Backend dependencies and scripts
- `src/` - Backend source code
- `tsconfig.json` - TypeScript configuration

**To run the backend:**
```bash
cd backend
npm install
npm run dev
```

### 📁 `shared/`
Contains documentation, configuration templates, and project-wide resources.

**Key files:**
- `README.md` - Detailed project documentation
- `AUTH_SETUP.md` - Authentication setup guide
- `DEV_ROUTES.md` - Development routes documentation
- `PHASE1_COMPLETION_SUMMARY.md` - Phase 1 completion summary
- `prompt-template.md` - AI prompt templates
- `sazon-ai-stack.md` - Tech stack documentation
- `supabase-schema.md` - Database schema documentation
- `todo` - Project todo list

## Quick Start

1. **Clone the repository**
2. **Set up the backend:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
3. **Set up the frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
4. **Check shared documentation** for detailed setup instructions

## Development

- Frontend runs on `http://localhost:3000`
- Backend API runs on `http://localhost:5000`
- Check `shared/` directory for detailed documentation and setup guides

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Supabase
- **Backend:** Node.js, Express, TypeScript
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth 