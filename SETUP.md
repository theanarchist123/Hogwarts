# AI Ebook Creator - Complete Setup Guide

## 🎯 Quick Start

Follow these steps to get your AI Ebook Creator up and running:

### 1. Install Dependencies

Open your terminal in the project directory and run:

```bash
npm install
```

This will install all required packages including:
- Next.js 14
- React 18
- Tailwind CSS
- Clerk for authentication
- Supabase client
- Google Gemini AI SDK
- shadcn/ui components
- And all other dependencies

### 2. Configure Clerk Authentication

**Get Your Clerk Keys:**

1. Go to [https://clerk.dev](https://clerk.dev)
2. Sign up or log in
3. Click "Add Application"
4. Name it "AI Ebook Creator"
5. Choose your authentication methods (Email, Google, GitHub, etc.)
6. Click "Create Application"

**Copy Your Keys:**

In your Clerk dashboard:
- Copy your **Publishable Key** (starts with `pk_test_` or `pk_live_`)
- Copy your **Secret Key** (starts with `sk_test_` or `sk_live_`)

**Update `.env.local`:**

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_secret_here
```

**Configure Redirect URLs in Clerk:**

In Clerk Dashboard → Paths:
- Sign-in URL: `/sign-in`
- Sign-up URL: `/sign-up`
- After sign-in URL: `/dashboard`
- After sign-up URL: `/dashboard`
- Home URL: `/`

### 3. Set Up Supabase Database

Your Supabase credentials are already configured in `.env.local`.

**Create Database Tables:**

1. Go to [https://supabase.com/dashboard/project/rxntsdckjkxfmefpkgrr](https://supabase.com/dashboard/project/rxntsdckjkxfmefpkgrr)
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy the entire contents of `supabase/schema.sql`
5. Paste it into the SQL editor
6. Click "Run" to execute the SQL

This will create:
- `ebooks` table - Store ebook metadata
- `chapters` table - Store chapter content
- `ebook-covers` storage bucket - Store cover images
- Row Level Security policies - Secure user data
- Indexes - Optimize database queries

**Verify Tables Created:**

1. Click "Table Editor" in the left sidebar
2. You should see `ebooks` and `chapters` tables
3. Click "Storage" to verify `ebook-covers` bucket exists

### 4. Verify AI API Keys

Your AI API keys are already configured in `.env.local`:

```env
GEMINI_API_KEY=AIzaSyABtRK0ABWMFoqnoLbxEiGjbq7ngnx0T2o
IMAGEN_API_KEY=AQ.Ab8RN6KscOJs4pCxPy-w5ckL5ty_Yt8PwaUQPf-MhbtbjgEp4Q
```

**Test Gemini API** (optional):
1. Go to [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
2. Verify your key is active
3. Check usage limits

### 5. Run the Development Server

```bash
npm run dev
```

The application will start at [http://localhost:3000](http://localhost:3000)

### 6. Test the Application

**Landing Page** (`/`)
- Should show hero section with "Create Professional Ebooks"
- Navigation bar with Login/Get Started buttons
- Features section showcasing AI capabilities

**Sign Up** (`/sign-up`)
- Click "Get Started" or "Sign Up"
- Create a new account using Clerk
- After signup, should redirect to dashboard

**Dashboard** (`/dashboard`)
- Shows "My Ebooks" heading
- "Create New Ebook" button in top right
- Empty state if no ebooks exist yet

**Create First Ebook**
- Click "Create New Ebook"
- Redirects to editor with new ebook
- Sidebar shows ebook title and chapters
- Can add new chapters with "Add Chapter" button

**Editor Features**
- Left panel: Markdown editor
- Right panel: Live preview
- Top toolbar: AI tools (Generate Outline, Write Chapter, etc.)
- Save button to persist changes

## 🔧 Configuration Files

### Environment Variables (`.env.local`)

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key_here  # ⚠️ NEEDS SETUP
CLERK_SECRET_KEY=your_clerk_secret_here                # ⚠️ NEEDS SETUP

# Supabase (✅ Already Configured)
NEXT_PUBLIC_SUPABASE_URL=https://rxntsdckjkxfmefpkgrr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# AI APIs (✅ Already Configured)
GEMINI_API_KEY=AIzaSyABtRK0ABWMFoqnoLbxEiGjbq7ngnx0T2o
IMAGEN_API_KEY=AQ.Ab8RN6KscOJs4pCxPy-w5ckL5ty_Yt8PwaUQPf-MhbtbjgEp4Q
```

## 📋 Troubleshooting

### Issue: "Cannot find module" errors
**Solution:** Run `npm install` again

### Issue: Clerk authentication not working
**Solution:** 
- Verify keys in `.env.local`
- Check Clerk dashboard for correct redirect URLs
- Restart dev server after changing env variables

### Issue: Supabase errors
**Solution:**
- Verify SQL schema was executed successfully
- Check Supabase dashboard for table existence
- Verify RLS policies are enabled

### Issue: AI features not working
**Solution:**
- Check Gemini API key is valid
- Verify API quota hasn't been exceeded
- Check browser console for errors

### Issue: Changes not saving
**Solution:**
- Check browser console for errors
- Verify Supabase connection
- Check network tab for failed requests

## 🏗️ Project Structure

```
Hogwarts/
├── app/                          # Next.js 14 App Router
│   ├── api/ai/                  # AI API endpoints
│   │   ├── outline/route.ts     # Generate ebook outline
│   │   ├── chapter/route.ts     # Write chapter content
│   │   └── image/route.ts       # Generate illustrations
│   ├── dashboard/page.tsx       # User's ebook library
│   ├── editor/[id]/page.tsx     # Ebook editor interface
│   ├── sign-in/                 # Clerk sign-in page
│   ├── sign-up/                 # Clerk sign-up page
│   ├── layout.tsx               # Root layout with Clerk
│   ├── page.tsx                 # Landing page
│   └── globals.css              # Dark theme styles
├── components/
│   ├── ui/                      # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   ├── label.tsx
│   │   └── dialog.tsx
│   └── Navbar.tsx               # Navigation component
├── lib/
│   ├── ai.ts                    # Gemini AI service
│   ├── supabase.ts              # Database operations
│   └── utils.ts                 # Helper functions
├── supabase/
│   └── schema.sql               # Database schema
├── middleware.ts                # Clerk auth middleware
├── tailwind.config.ts           # Tailwind configuration
├── next.config.js               # Next.js configuration
├── tsconfig.json                # TypeScript config
├── package.json                 # Dependencies
└── .env.local                   # Environment variables
```

## 🎨 Key Features Implementation

### 1. Authentication Flow
- Clerk handles all authentication
- Protected routes via middleware
- User session management
- Sign in/up components

### 2. Database Operations
- Supabase PostgreSQL database
- Row Level Security (RLS)
- Real-time updates
- File storage for images

### 3. AI Integration
- Gemini Pro for text generation
- Outline generation
- Chapter writing
- Content improvement
- Imagen 4 for illustrations (placeholder)

### 4. Editor Features
- Split-screen layout
- Markdown editing
- Live preview
- Chapter management
- Auto-save functionality

### 5. Responsive Design
- Mobile-first approach
- Tailwind CSS utilities
- Dark theme by default
- Smooth transitions

## 🚀 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables
5. Deploy

### Environment Variables for Production

Add all variables from `.env.local` to Vercel:
- Clerk keys
- Supabase keys (already configured)
- AI API keys (already configured)

## 📝 Next Steps

After setup, you can:

1. **Customize Design**
   - Edit colors in `tailwind.config.ts`
   - Modify theme in `app/globals.css`
   - Add custom fonts

2. **Add Features**
   - Export to PDF/DOCX
   - Version history
   - Collaboration
   - Templates

3. **Enhance AI**
   - Fine-tune prompts in `lib/ai.ts`
   - Add more AI models
   - Implement image generation

4. **Improve UX**
   - Add loading states
   - Better error handling
   - Toast notifications
   - Drag-and-drop for chapters

## 🆘 Support

If you encounter issues:

1. Check this setup guide
2. Review error messages in console
3. Verify all environment variables
4. Check Supabase and Clerk dashboards
5. Restart development server

## ✅ Setup Checklist

- [ ] Run `npm install`
- [ ] Create Clerk account and get API keys
- [ ] Update `.env.local` with Clerk keys
- [ ] Configure Clerk redirect URLs
- [ ] Run Supabase schema SQL
- [ ] Verify tables in Supabase
- [ ] Run `npm run dev`
- [ ] Test landing page
- [ ] Test sign up flow
- [ ] Test dashboard
- [ ] Create first ebook
- [ ] Test editor features
- [ ] Test save functionality

---

**You're all set! Start creating amazing ebooks with AI! 🎉**
