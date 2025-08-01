# Sazon AI Backend

This is the backend service for the Sazon AI meal planning application. It provides RESTful API endpoints for generating personalized meal plans using OpenAI's GPT API.

## 🏗️ Architecture

The backend follows a clean architecture pattern with the following structure:

```
backend/
├── src/
│   ├── config/          # Configuration and environment variables
│   ├── controllers/     # HTTP request handlers
│   ├── middleware/      # Express middleware (error handling, etc.)
│   ├── services/        # Business logic and external API integrations
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── README.md           # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn package manager
- OpenAI API key
- Supabase project (for future database integration)

### Installation

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the backend directory:
   ```env
   # Server Configuration
   PORT=3001
   NODE_ENV=development
   
   # OpenAI Configuration
   OPENAI_API_KEY=your_openai_api_key_here
   OPENAI_MODEL=gpt-4
   
   # Supabase Configuration (for future use)
   SUPABASE_URL=your_supabase_url_here
   SUPABASE_SERVICE_KEY=your_supabase_service_key_here
   
   # CORS Configuration
   CORS_ORIGIN=http://localhost:5173
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3001` (or the port specified in your `.env` file).

## 📚 API Endpoints

### Health Check
- **GET** `/api/health`
- Returns the health status of the service

### Meal Planning
- **POST** `/api/meal-plan/generate`
- Generates a personalized meal plan using OpenAI GPT
- **POST** `/api/meal-plan/mock`
- Generates a mock meal plan for testing (development only)

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the TypeScript code
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests (when implemented)

### Development Mode Features

In development mode (`NODE_ENV=development`), you can:

1. **Use mock data:** Add `?mock=true` to any meal planning request to use mock data instead of calling the OpenAI API
2. **Detailed logging:** All requests and errors are logged with timestamps
3. **CORS debugging:** CORS is configured to allow requests from the frontend development server

## 🛡️ Security Features

- **Helmet.js:** Security headers and content security policy
- **CORS:** Configurable cross-origin resource sharing
- **Input validation:** Request validation for all endpoints
- **Error handling:** Comprehensive error handling with proper HTTP status codes
- **Rate limiting:** (To be implemented)

## 📝 API Documentation

### Generate Meal Plan

**Endpoint:** `POST /api/meal-plan/generate`

**Request Body:**
```json
{
  "dietary_preferences": ["vegetarian", "gluten-free"],
  "allergies": ["nuts", "shellfish"],
  "household_size": 4,
  "cooking_skill_level": "intermediate",
  "cuisine_preferences": ["italian", "mexican"],
  "meal_count": 7,
  "additional_notes": "Prefer quick meals during weekdays"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "meals": [
      {
        "id": "meal_1",
        "name": "Grilled Chicken with Roasted Vegetables",
        "description": "A healthy and delicious meal...",
        "ingredients": [...],
        "instructions": [...],
        "prep_time": 15,
        "cook_time": 25,
        "servings": 4,
        "nutrition_info": {...},
        "tags": ["healthy", "protein-rich"],
        "image_url": null
      }
    ],
    "grocery_list": [...],
    "total_estimated_cost": 45.67,
    "preparation_time": "45 minutes",
    "difficulty_level": "Intermediate"
  },
  "message": "Meal plan generated successfully"
}
```

### Error Response Format

```json
{
  "success": false,
  "error": "Error message",
  "message": "User-friendly message"
}
```

## 🔄 Integration with Frontend

The backend is designed to work seamlessly with the Sazon AI frontend. The frontend should:

1. Make requests to the backend API endpoints
2. Handle the standardized response format
3. Use the mock endpoint during development for faster iteration

## 🚀 Deployment

### Production Build

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Start the production server:**
   ```bash
   npm start
   ```

### Environment Variables for Production

Make sure to set the following environment variables in production:

- `NODE_ENV=production`
- `PORT` (your desired port)
- `OPENAI_API_KEY` (your OpenAI API key)
- `CORS_ORIGIN` (your frontend domain)

## 🤝 Contributing

1. Follow the existing code structure and patterns
2. Add proper TypeScript types for all new features
3. Include error handling for all new endpoints
4. Add tests for new functionality
5. Update this README for any new features

## 📄 License

This project is part of the Sazon AI application. 