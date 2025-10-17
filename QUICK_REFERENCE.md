# Quick Reference Card - AI Ebook Creator

## 🚀 Essential Commands

```bash
npm install           # Install dependencies
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run linter
```

## 📁 Key Files

```
app/page.tsx         # Landing page
app/dashboard/       # User dashboard
app/editor/[id]/     # Editor page
lib/ai.ts           # AI services
lib/supabase.ts     # Database operations
middleware.ts       # Auth protection
.env.local          # Environment vars
```

## 🔑 Environment Variables

```env
# REQUIRED (You must add)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_secret

# PRE-CONFIGURED (Already set)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
GEMINI_API_KEY=...
```

## 🎨 Common Components

```tsx
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import Navbar from '@/components/Navbar'

// Usage
<Button onClick={handler}>Click Me</Button>
<Card><CardHeader>Title</CardHeader></Card>
<Input value={val} onChange={e => setVal(e.target.value)} />
```

## 🤖 AI Service Usage

```typescript
import { geminiService } from '@/lib/ai'

// Generate outline
const outline = await geminiService.generateOutline(topic)

// Generate chapter
const content = await geminiService.generateChapter(
  title, 
  outline, 
  previousChapter
)

// Improve content
const improved = await geminiService.improveContent(
  content,
  instruction
)
```

## 💾 Database Operations

```typescript
import { ebookService, chapterService } from '@/lib/supabase'

// Get user's ebooks
const ebooks = await ebookService.getEbooksByUserId(userId)

// Get single ebook
const ebook = await ebookService.getEbookById(id)

// Create ebook
const newEbook = await ebookService.createEbook(userId, title)

// Update ebook
await ebookService.updateEbook(id, { title, subtitle })

// Delete ebook
await ebookService.deleteEbook(id)

// Create chapter
await chapterService.createChapter(ebookId, title, content, order)

// Update chapter
await chapterService.updateChapter(id, { title, content })
```

## 🔐 Auth Patterns

```tsx
import { useUser } from '@clerk/nextjs'
import { SignedIn, SignedOut } from '@clerk/nextjs'

// Get user
const { user } = useUser()
const userId = user?.id

// Conditional rendering
<SignedIn>
  <DashboardContent />
</SignedIn>
<SignedOut>
  <LoginPrompt />
</SignedOut>
```

## 🎨 Styling Classes

```tsx
// Backgrounds
className="bg-background"     // Main bg
className="bg-secondary"      // Secondary bg
className="bg-card"          // Card bg

// Text
className="text-foreground"   // Primary text
className="text-muted-foreground" // Muted text
className="text-primary"      // Accent text

// Layout
className="container mx-auto px-4" // Container
className="flex items-center gap-4" // Flexbox
className="grid grid-cols-3 gap-6" // Grid

// Responsive
className="hidden md:block"   // Hide on mobile
className="text-sm md:text-base" // Responsive text
```

## 📊 Page Routes

```
/                    → Landing page
/sign-in            → Sign in
/sign-up            → Sign up
/dashboard          → User dashboard
/editor/[id]        → Ebook editor
/book/[id]          → Book details
```

## 🛠️ Development Tips

```typescript
// Use 'use client' for interactive components
'use client'

// Import types
import type { Ebook, Chapter } from '@/lib/supabase'

// Handle loading states
const [loading, setLoading] = useState(true)

// Handle errors
try {
  await operation()
} catch (error) {
  console.error(error)
}

// Use async/await
const fetchData = async () => {
  const data = await service.getData()
  setData(data)
}
```

## 📚 Documentation

```
WELCOME.md          → Start here
INDEX.md           → Docs navigation
README.md          → Overview
SETUP.md           → Installation
DATABASE.md        → Database guide
AI_FEATURES.md     → AI integration
COMPONENTS.md      → Component library
PROJECT_SUMMARY.md → Full summary
```

## 🐛 Quick Fixes

```bash
# Module not found
npm install

# Clear cache
rd /s /q .next
npm run dev

# Port already in use
# Kill process on port 3000
npx kill-port 3000

# Type errors
# Check tsconfig.json
npm install --save-dev @types/node @types/react
```

## ✅ Pre-flight Checklist

Before starting:
- [ ] `npm install` completed
- [ ] Clerk keys in `.env.local`
- [ ] Supabase schema executed
- [ ] `npm run dev` running
- [ ] Browser at http://localhost:3000

## 🎯 Quick Start

```bash
# 1. Install
npm install

# 2. Configure .env.local
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_secret

# 3. Run Supabase SQL
# Copy from supabase/schema.sql
# Paste in Supabase SQL Editor

# 4. Start
npm run dev

# 5. Open
# http://localhost:3000
```

## 🆘 Help

- Troubleshooting → SETUP.md
- Database help → DATABASE.md
- AI help → AI_FEATURES.md
- Component help → COMPONENTS.md
- General help → INDEX.md

---

**Print this card for quick reference!**
