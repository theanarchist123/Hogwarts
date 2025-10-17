# Hogwarts - AI Ebook Creator

A magical, AI-powered ebook creation platform built with Next.js, Supabase, and Gemini AI. Where stories come to life with the power of AI wizardry.

## 🚀 Features

- **AI-Powered Content Generation**: Generate outlines and chapters using Gemini AI magic
- **Illustration Generator**: Create enchanting images for your storybooks with Imagen 4
- **Real-time Editor**: Split-screen markdown editor with live preview
- **Chapter Management**: Organize chapters with drag-and-drop reordering
- **Authentication**: Secure user authentication with Clerk
- **Cloud Storage**: Store ebooks and images with Supabase
- **Dark Theme**: Beautiful, minimal dark UI design inspired by magical aesthetics
- **Responsive**: Works seamlessly on desktop, tablet, and mobile

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **Authentication**: Clerk
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **AI**: Google Gemini API, Imagen 4
- **Icons**: Lucide React

## 📦 Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd Hogwarts
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.local` and update with your API keys
   - Get Clerk keys from https://clerk.dev
   - Supabase keys are already configured
   - Gemini API key is already configured

4. Set up Supabase database:
   - Go to your Supabase project: https://supabase.com/dashboard/project/rxntsdckjkxfmefpkgrr
   - Navigate to SQL Editor
   - Run the SQL schema from `supabase/schema.sql`

5. Configure Clerk:
   - Create a new application at https://clerk.dev
   - Copy your publishable key and secret key to `.env.local`
   - Configure redirect URLs in Clerk dashboard

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
Hogwarts/
├── app/                      # Next.js app directory
│   ├── api/                 # API routes
│   │   └── ai/             # AI endpoints (outline, chapter, image)
│   ├── dashboard/          # Dashboard page
│   ├── editor/[id]/        # Ebook editor page
│   ├── sign-in/            # Sign in page
│   ├── sign-up/            # Sign up page
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Landing page
│   └── globals.css         # Global styles
├── components/              # React components
│   ├── ui/                 # shadcn/ui components
│   └── Navbar.tsx          # Navigation component
├── lib/                     # Utility libraries
│   ├── ai.ts               # Gemini AI integration
│   ├── supabase.ts         # Supabase client & operations
│   └── utils.ts            # Helper functions
├── supabase/               # Database schema
│   └── schema.sql          # SQL schema for tables
└── middleware.ts           # Clerk authentication middleware
```

## 🔑 Environment Variables

Required environment variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Supabase (Already configured)
NEXT_PUBLIC_SUPABASE_URL=https://rxntsdckjkxfmefpkgrr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# AI APIs (Already configured)
GEMINI_API_KEY=...
IMAGEN_API_KEY=...
```

## 🎨 Design System

- **Background**: `#0D0D0D` - `#1A1A1A`
- **Text**: Soft white `#EAEAEA`, muted gray `#9CA3AF`
- **Accent**: Blue `#3B82F6`
- **Font**: Inter
- **Icons**: Lucide React

## 📝 Usage

1. **Sign Up/Login**: Create an account or sign in with Clerk
2. **Dashboard**: View all your ebooks
3. **Create Ebook**: Click "Create New Ebook" button
4. **Edit**: Add chapters, write content, generate AI content
5. **AI Tools**:
   - Generate Outline: Get AI-generated ebook structure
   - Write Chapter: Let AI write chapter content
   - Generate Image: Create illustrations for your story
6. **Save**: Auto-save functionality with manual save option
7. **Export**: Download as PDF or DOCX (coming soon)

## 🔐 Database Schema

### Tables:
- **ebooks**: Store ebook metadata (title, author, cover, etc.)
- **chapters**: Store chapter content with ordering
- **Storage**: Cover images in `ebook-covers` bucket

### Security:
- Row Level Security (RLS) enabled
- User-specific access policies
- Secure authentication with Clerk

## 🚧 Roadmap

- [ ] PDF/DOCX export functionality
- [ ] Imagen 4 integration for illustrations
- [ ] Theme customization (light/dark toggle)
- [ ] Collaborative editing
- [ ] Version history
- [ ] Template library
- [ ] Publishing to various platforms

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Powered by [Google Gemini AI](https://deepmind.google/technologies/gemini/)
- Database by [Supabase](https://supabase.com/)
- Authentication by [Clerk](https://clerk.dev/)
