# Sazon AI - Your Personal Meal Planning Assistant

Sazon AI is a mobile-first web application that uses artificial intelligence to create personalized meal plans based on your dietary preferences, cooking skills, and budget. Say goodbye to meal planning stress and hello to delicious, customized recipes!

## 🚀 Features

- **AI-Powered Meal Planning**: Generate personalized meal plans using GPT-4
- **Dietary Preferences**: Support for vegetarian, vegan, gluten-free, and other dietary restrictions
- **Allergy Management**: Avoid ingredients you're allergic to
- **Budget-Friendly**: Choose from budget, moderate, or premium meal plans
- **Cooking Skill Levels**: Recipes tailored to beginner, intermediate, or advanced cooks
- **Grocery Lists**: Automatically generated shopping lists with estimated costs
- **Mobile-First Design**: Optimized for mobile devices with responsive design
- **User Authentication**: Secure sign-up and sign-in with Supabase
- **Profile Management**: Save and update your preferences

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **AI Integration**: OpenAI GPT-4
- **Icons**: Lucide React
- **Routing**: React Router DOM

## 📱 Mobile-First Design

Sazon AI is built with mobile users in mind, featuring:
- Responsive design that works on all screen sizes
- Touch-friendly interface elements
- Optimized navigation for mobile devices
- Fast loading times
- Progressive Web App capabilities

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/sazon-ai.git
   cd sazon-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   OPENAI_API_KEY=your_openai_api_key
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

4. **Set up Supabase**
   - Create a new Supabase project
   - Set up the database schema (see `supabase-schema.md`)
   - Get your project URL and anon key from the Supabase dashboard

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
sazon-ai/
│
├── public/
│   └── favicon.ico
│
├── src/
│   ├── assets/              # Static assets
│   ├── components/          # Reusable UI components
│   │   ├── AuthWrapper.tsx
│   │   ├── MealCard.tsx
│   │   ├── GroceryListSection.tsx
│   │   └── Navbar.tsx
│   │
│   ├── pages/              # Page components
│   │   ├── Home.tsx        # Sign in/up page
│   │   ├── Onboarding.tsx  # User preferences setup
│   │   ├── Dashboard.tsx   # Main dashboard
│   │   └── Plan.tsx        # Meal plan generation
│   │
│   ├── lib/                # Utility functions and API
│   │   ├── supabaseClient.ts
│   │   ├── auth.ts
│   │   └── api.ts
│   │
│   ├── routes/             # Routing configuration
│   │   └── AppRoutes.tsx
│   │
│   ├── context/            # React context providers
│   │   └── UserContext.tsx
│   │
│   ├── styles/             # Global styles
│   │   └── globals.css
│   │
│   ├── backend/            # Backend API routes
│   │   └── generatePlan.ts
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── .env.example           # Environment variables template
├── index.html
├── package.json
├── README.md
├── sazon-ai-stack.md      # Detailed tech stack documentation
├── supabase-schema.md     # Database schema
└── prompt-template.md     # GPT prompt templates
```

## 🔧 Configuration

### Supabase Setup

1. Create a new Supabase project
2. Set up the database tables (see `supabase-schema.md`)
3. Configure Row Level Security (RLS) policies
4. Set up authentication providers

### OpenAI API

1. Get an OpenAI API key from [OpenAI Platform](https://platform.openai.com/)
2. Add the key to your `.env` file
3. Ensure you have sufficient credits for API calls

## 🎨 Customization

### Styling

The app uses Tailwind CSS for styling. You can customize:
- Colors in `tailwind.config.js`
- Global styles in `src/styles/globals.css`
- Component-specific styles in individual components

### AI Prompts

Modify the GPT prompts in `src/backend/generatePlan.ts` to:
- Change the tone of generated recipes
- Add specific dietary guidelines
- Include regional cuisine preferences
- Adjust recipe complexity

## 📊 Database Schema

See `supabase-schema.md` for detailed database schema information.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/sazon-ai/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set up environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify

1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Configure environment variables

### Other Platforms

The app can be deployed to any static hosting platform that supports:
- Static file hosting
- Environment variable configuration
- HTTPS

## 🔮 Future Features

- [ ] Recipe ratings and reviews
- [ ] Meal plan sharing
- [ ] Nutritional goal tracking
- [ ] Recipe scaling for different household sizes
- [ ] Integration with grocery delivery services
- [ ] Meal prep instructions
- [ ] Recipe video tutorials
- [ ] Social features and community recipes

---

Built with ❤️ by the Sazon AI team 