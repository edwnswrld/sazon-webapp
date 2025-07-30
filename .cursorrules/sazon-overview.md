# 📜 Sazón Web App – Cursor Rules

## 🧠 About the App
**Sazón** is a culturally aware meal planning app for busy parents.  
It generates **3-day meal plans** (breakfast, lunch, dinner) based on user preferences.

Includes:
- Grocery lists grouped by category and labeled per meal
- Recipes with ingredients and full instructions
- Customization for cuisine, dietary needs, and allergies

🎯 Goal: Help families eat healthy, flavorful meals rooted in cultural traditions — without the stress.

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

**Deployment**:
- Frontend → Netlify  
- Backend → Render

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

- Free plan: 3-day plan, once per ip address
- Paid plan: full weekly access
- Billing provider: Stripe 
- Capture emails for waitlist + conversion funnel (through supabase)

---

## ✍️ Branding & Voice

- Emphasize **flavor, family, and simplicity**
- Avoid sterile or fitness-first tone
- Examples:
  - ✅ “Healthy meals shouldn’t be boring.”
  - ✅ “Cook with flavor, plan with ease.”
  - ❌ “Optimize your macros.”

---

## 📁 File Suggestions

You may break this into multiple files for clarity:
- `docs/mvp.md`
- `docs/dev-rules.md`
- `docs/branding.md`
- `docs/subscription.md`

Or keep as one central file: `cursor-rules.md`

---
