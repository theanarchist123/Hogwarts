# 📚 Hogwarts AI Storybook Creator - Setup Guide

## What's New - Free AI Models + Professional Book Export

This update adds:
- ✅ **Groq Llama-3.1-70B** for blazing-fast text generation (FREE)
- ✅ **AI Horde** for high-quality images via Stable Diffusion (FREE)
- ✅ **PDF Export** with Paged.js (print-ready with running heads)
- ✅ **EPUB Export** with epub-gen-memory
- ✅ **DOCX Export** with docx npm (paragraph styles)
- ✅ **Professional Book Typography** (hyphenation, ligatures, drop caps)
- ✅ **Theme Switcher** (Paper, Sepia, Night, Dyslexia-friendly)
- ✅ **Page Layout** with running heads and folios

---

## 📦 Installation

### 1. Install Dependencies

The following packages were added for AI and export features:

```bash
npm install groq-sdk epub-gen-memory docx pagedjs
```

**Installed packages:**
- `groq-sdk` - Groq API client for Llama-3.1-70B text generation
- `epub-gen-memory` - EPUB export (in-memory, no file system)
- `docx` - DOCX export with paragraph and character styles
- `pagedjs` - PDF print-ready with @page CSS rules

### 2. Environment Variables

Add your Groq API key to `.env.local`:

```bash
# Get your free API key at https://console.groq.com
GROQ_API_KEY=your_groq_api_key_here

# Optional: Keep Gemini as fallback
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
```

**How to get Groq API key:**
1. Visit https://console.groq.com
2. Sign up/login (free account)
3. Navigate to API Keys
4. Create new API key
5. Copy and paste into `.env.local`

**Free tier limits:**
- Groq: 30 requests/minute, 7,000 tokens/minute (generous for stories)
- AI Horde: Truly free, queue-based (slower but no limits)

---

## 🚀 New Features

### 1. AI Text Generation with Groq

**File:** `lib/ai-providers.ts`

**Features:**
- **Story Outline:** Generates 5-7 chapter structure with summaries
- **Chapter Writing:** 700-900 words per chapter with rich prose
- **Content Improvement:** AI editor presets (Tighten, Raise tension, Simplify)
- **Enhanced Prompts:** Senior fiction editor system prompts
- **Show-Don't-Tell:** Vivid sensory details, character voice, natural dialogue

**Usage:**
```typescript
import { textGenerator } from '@/lib/ai-providers'

// Generate outline
const outline = await textGenerator.generateStoryOutline(userPrompt)

// Generate chapter
const content = await textGenerator.generateChapter({
  title: 'Chapter 1',
  summary: 'Hero discovers magical portal',
  genre: 'Fantasy'
})
```

### 2. AI Image Generation with AI Horde

**File:** `lib/ai-providers.ts`

**Features:**
- **Storybook Illustrations:** SDXL 1.0 model, 1024×1024
- **Quality Prompts:** Painterly, soft shading, clean lines, dramatic lighting
- **Negative Prompts:** Auto-removes blurry, watermarks, text, extra fingers
- **Fallback:** Pollinations URL proxy (instant, no queue)

**Usage:**
```typescript
import { imageGenerator } from '@/lib/ai-providers'

// Generate with AI Horde (queue-based, high quality)
const { url, seed } = await imageGenerator.generateImage(
  'storybook illustration of dragon, painterly style'
)

// Or use instant fallback
const url = imageGenerator.getPollinationsUrl('dragon illustration')
```

### 3. Export Pipeline

#### PDF Export (Print-Ready)

**Route:** `/print/[id]`

**Features:**
- Trade paperback size (6in × 9in)
- Running heads (chapter title + page number)
- Drop caps for chapter openings
- Proper margins and pagination
- @page CSS rules for print
- Paged.js polyfill for browser preview

**Access:**
```
http://localhost:3000/print/[ebook-id]
```

Then **File > Print > Save as PDF** in browser.

#### EPUB Export

**Route:** `/api/export/epub/[id]`

**Features:**
- Standards-compliant EPUB format
- Embedded cover image
- Chapter navigation (TOC)
- Responsive typography
- Hyphenation and justification

**Usage:**
```typescript
// Download button
<a href={`/api/export/epub/${ebookId}`} download>
  Download EPUB
</a>
```

#### DOCX Export

**Route:** `/api/export/docx/[id]`

**Features:**
- Microsoft Word compatible
- Proper heading styles (H1, H2)
- Paragraph indentation
- Page breaks between chapters
- 1-inch margins

**Usage:**
```typescript
// Download button
<a href={`/api/export/docx/${ebookId}`} download>
  Download DOCX
</a>
```

### 4. Professional Book Typography

**File:** `app/globals.css`

**CSS Classes:**

```css
/* Apply to reading container */
.book-prose {
  /* Enables hyphenation, ligatures, kerning */
  /* Prevents orphans/widows */
  /* Book serif font stack */
}

/* Drop cap for first paragraph */
.drop-cap::first-letter {
  /* Large decorative initial letter */
}

/* Theme variations */
.theme-paper /* White background, black text */
.theme-sepia /* Warm beige, brown text */
.theme-night /* Dark mode for reading */
.theme-dyslexia /* OpenDyslexic font, wider spacing */
```

**Features:**
- **Hyphenation:** Auto-hyphen for justified text
- **Ligatures:** ff, fi, fl ligatures enabled
- **Kerning:** Optical spacing between letters
- **Oldstyle Numerals:** Text-height numbers (123)
- **Orphans/Widows:** Minimum 2 lines per page break
- **Drop Caps:** Large first letter (3.5em)
- **Running Heads:** Chapter title in header
- **Folios:** Page numbers with oldstyle numerals

### 5. Page Layout Components

**Classes in globals.css:**

```css
/* Two-page spread */
.page-spread {
  display: flex;
  gap: 2rem;
  perspective: 1000px;
}

/* Single page */
.page-single {
  flex: 1;
  padding: 3rem 2.5rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

/* Running head (header) */
.running-head {
  position: absolute;
  top: 1.5rem;
  /* Chapter title on left page, page number on right */
}

/* Full-bleed images */
.full-bleed {
  margin: 0 -2.5rem;
  width: calc(100% + 5rem);
}
```

---

## 📖 Usage Examples

### Complete Story Generation

```typescript
import { generateCompleteStory } from '@/lib/ai-providers'

const story = await generateCompleteStory(
  'A young wizard discovers a hidden library with ancient spells'
)

// Returns:
// {
//   title: 'The Hidden Library',
//   subtitle: 'A Tale of Magic and Mystery',
//   genre: 'Fantasy',
//   coverImageUrl: 'data:image/png;base64,...',
//   chapters: [
//     {
//       number: 1,
//       title: 'The Discovery',
//       content: '...',
//       illustrationUrl: 'data:image/png;base64,...'
//     }
//   ]
// }
```

### Add Export Buttons to Dashboard

```tsx
// In your dashboard or reader component
<div className="flex gap-2">
  <a 
    href={`/print/${ebook.id}`}
    target="_blank"
    className="btn"
  >
    📄 Print/PDF
  </a>
  
  <a 
    href={`/api/export/epub/${ebook.id}`}
    download
    className="btn"
  >
    📚 Download EPUB
  </a>
  
  <a 
    href={`/api/export/docx/${ebook.id}`}
    download
    className="btn"
  >
    📝 Download DOCX
  </a>
</div>
```

### Apply Book Typography to Reader

```tsx
'use client'

import { useState } from 'react'

export default function BookReader({ content }: { content: string }) {
  const [theme, setTheme] = useState('paper')
  
  return (
    <div>
      {/* Theme switcher */}
      <select onChange={(e) => setTheme(e.target.value)}>
        <option value="paper">Paper</option>
        <option value="sepia">Sepia</option>
        <option value="night">Night</option>
        <option value="dyslexia">Dyslexia-Friendly</option>
      </select>
      
      {/* Book content */}
      <div className={`book-prose theme-${theme}`}>
        <p className="drop-cap">
          {content}
        </p>
      </div>
    </div>
  )
}
```

---

## 🎨 AI Prompt Templates

### Text Generation (Groq)

**Story Outline:**
```
Senior fiction editor system prompt
- Strong narrative arcs
- Distinct character voices
- Vivid world-building
- Proper pacing
- Show don't tell
```

**Chapter Content:**
```
Award-winning novelist system prompt
- Sensory details (sight, sound, smell, texture, taste)
- Varied sentence rhythm
- Natural dialogue
- Vivid imagery and metaphor
- 700-900 words per chapter
```

### Image Generation (AI Horde)

**Base Template:**
```
storybook illustration, painterly, soft shading, clean lines, 
high detail, dramatic lighting, professional quality, 1024x1024
```

**Negative Prompt:**
```
blurry, low-res, text, watermark, logo, extra fingers, 
deformed, cropped head, bad anatomy, worst quality
```

**Example Prompts:**
```
// Fantasy
"young wizard in ancient library, magical glowing books, 
candlelight, storybook illustration, painterly style"

// Adventure
"pirate ship on stormy seas, dramatic waves, sunset sky, 
detailed rigging, storybook illustration, soft shading"

// Sci-Fi
"robot exploring alien planet, bioluminescent plants, 
two moons, high detail, storybook illustration, clean lines"
```

---

## 🔧 Troubleshooting

### Groq API Errors

**Rate Limit Exceeded:**
- Free tier: 30 requests/minute
- Solution: Add delays between requests or upgrade plan

**Invalid API Key:**
- Check `.env.local` has correct `GROQ_API_KEY`
- Verify key at https://console.groq.com

### AI Horde Timeout

**Queue Too Long:**
- AI Horde is free but queue-based
- May take 1-3 minutes during peak hours
- Fallback to Pollinations if timeout occurs

**Image Generation Failed:**
- Check prompt doesn't violate content policy
- Reduce image size if needed
- Try simpler prompt

### Export Errors

**PDF Print Issues:**
- Ensure Paged.js script loads (check network tab)
- Use Chrome/Edge for best @page CSS support
- File > Print > Save as PDF (not Save Page As)

**EPUB/DOCX Download Fails:**
- Check ebook ownership (user_id matches)
- Verify chapters exist in database
- Check server logs for errors

### Typography Not Applied

**Book Fonts Missing:**
- Palatino/Garamond are system fonts
- Install from Google Fonts if needed
- Fallback to Georgia (always available)

**Hyphenation Not Working:**
- Requires `hyphens: auto` CSS
- Browser support: Chrome 88+, Firefox 43+, Safari 17+
- Set `lang="en"` on HTML element

---

## 🚢 Deployment

### Vercel

Add environment variables in dashboard:

```
GROQ_API_KEY=your_groq_key
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key
```

### Edge Functions Note

Groq SDK works with Edge Runtime (Vercel Edge Functions).  
AI Horde may timeout on edge (use Node.js runtime for images).

Add to API routes if needed:
```typescript
export const runtime = 'nodejs'
```

---

## 📚 Resources

### API Documentation

- **Groq:** https://console.groq.com/docs
- **AI Horde:** https://aihorde.net/api
- **Paged.js:** https://pagedjs.org
- **epub-gen:** https://github.com/cyrilis/epub-gen
- **docx:** https://docx.js.org

### Free API Keys

- **Groq:** https://console.groq.com (sign up free)
- **AI Horde:** No API key needed (anonymous tier)
- **Pollinations:** No API key needed (free proxy)

### Typography References

- **Butterick's Practical Typography:** https://practicaltypography.com
- **The Elements of Typographic Style:** Book by Robert Bringhurst
- **@page CSS Spec:** https://www.w3.org/TR/css-page-3/

---

## 🎯 Next Steps

1. **Get Groq API Key** at https://console.groq.com
2. **Add to `.env.local`** - `GROQ_API_KEY=your_key`
3. **Test Story Generation** - Try `/generate` page
4. **Add Export Buttons** - Update dashboard with download links
5. **Customize Themes** - Adjust CSS color variables
6. **Deploy to Vercel** - Add env vars in dashboard

---

## 💡 Pro Tips

### Faster Image Generation

Use Pollinations fallback for instant images:
```typescript
const url = imageGenerator.getPollinationsUrl(prompt)
// No queue, instant URL
```

### Better Story Quality

Add context to chapters:
```typescript
const content = await textGenerator.generateChapter(
  chapterInfo,
  previousChapterContext // Last 500 chars
)
```

### Print-Ready PDFs

1. Open `/print/[id]` in Chrome
2. Wait for Paged.js to render
3. **File > Print**
4. Destination: **Save as PDF**
5. Margins: **None** (already in @page CSS)
6. Background graphics: **Enabled**

### Theme Customization

Edit CSS variables in `globals.css`:
```css
.theme-custom {
  --book-bg: #f9f7f4;
  --book-fg: #2d2d2d;
}
```

---

**Built with ❤️ using Next.js, Groq, AI Horde, and Paged.js**
