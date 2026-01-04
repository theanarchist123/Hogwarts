# ✨ Hogwarts - AI Story Generator

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=for-the-badge&logo=tailwind-css)

**Transform your imagination into beautifully illustrated storybooks with AI magic** 🪄

[Live Demo](https://hogwarts-stories.vercel.app) • [Report Bug](https://github.com/theanarchist123/Hogwarts/issues)

</div>

---

## 🎭 What is Hogwarts?

Hogwarts is an AI-powered story generator that creates complete illustrated ebooks from simple prompts. Just describe your dream story, and watch as AI crafts chapters with stunning visuals - all in minutes.

## ⚡ Features

- 🤖 **AI Story Generation** - Generate 5-7 chapter stories with Groq's Llama 3.3
- 🎨 **Auto Illustrations** - Every chapter gets AI-generated artwork
- 📖 **Flip Book Reader** - Immersive reading with page-flip animations  
- ✏️ **AI Content Editor** - Select text and improve it with AI suggestions
- 📥 **Multi-Format Export** - Download as EPUB, DOCX, or print to PDF
- 🌙 **Beautiful UI** - Animated backgrounds, interactive icons, dark theme

## 🚀 Quick Start

```bash
# Clone the repo
git clone https://github.com/theanarchist123/Hogwarts.git

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

## 🔑 Environment Variables

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GROQ_API_KEY=
```

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 14 (App Router) |
| Auth | Clerk |
| Database | Supabase |
| AI | Groq (Llama 3.3), Pollinations |
| Styling | Tailwind CSS, Animate UI |
| Animations | Motion (Framer Motion) |

## 📸 Screenshots

<div align="center">
<img src="public/screenshot.png" alt="Story Generator" width="600"/>
</div>

## 📄 License

MIT © [theanarchist123](https://github.com/theanarchist123)

---

<div align="center">
Made with ❤️ and a lot of ☕
</div>
