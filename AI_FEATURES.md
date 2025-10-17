# AI Features Documentation

## Overview

The AI Ebook Creator leverages Google's Gemini AI and Imagen 4 to provide powerful content generation capabilities. This document explains how to use and customize these AI features.

## 🤖 AI Services

### 1. Gemini Pro - Text Generation

Used for:
- Generating ebook outlines
- Writing chapter content
- Improving existing content
- Creative suggestions

**API Endpoint:** `gemini-pro` model

### 2. Imagen 4 - Image Generation

Used for:
- Creating book cover illustrations
- Generating chapter images
- Storybook illustrations

**Status:** Placeholder implementation (requires Google Cloud setup)

## 📝 Using AI Features

### Generate Ebook Outline

**Purpose:** Create a structured outline for your ebook

**How to use:**
1. Click "Generate Outline" button in editor
2. Enter your ebook topic/title
3. AI generates a structured outline with:
   - Title and subtitle suggestions
   - 5-10 chapter titles
   - Key points for each chapter

**Example prompt:**
```
Topic: "Mastering TypeScript for Web Development"

Generated Outline:
- Introduction to TypeScript
- Setting Up Your Environment
- Basic Types and Interfaces
- Advanced Type Features
- etc...
```

**API Implementation:**
```typescript
// app/api/ai/outline/route.ts
POST /api/ai/outline
Body: { topic: string }
Response: { outline: string }
```

### Write Chapter Content

**Purpose:** Generate comprehensive chapter content

**How to use:**
1. Select a chapter
2. Click "Write Chapter" button
3. AI generates 800-1500 words based on:
   - Chapter title
   - Ebook outline
   - Previous chapter (for continuity)

**Features:**
- Maintains narrative flow
- Includes examples and explanations
- Professional language
- Markdown formatting

**API Implementation:**
```typescript
// app/api/ai/chapter/route.ts
POST /api/ai/chapter
Body: { 
  title: string,
  outline: string,
  previousChapter?: string 
}
Response: { content: string }
```

### Generate Illustrations

**Purpose:** Create visual content for your ebook

**How to use:**
1. Click "Generate Image" button
2. Enter image description or use chapter context
3. AI generates an image prompt (Imagen 4 integration pending)

**Note:** Currently returns enhanced prompts. Full image generation requires Google Cloud Vision API setup.

**API Implementation:**
```typescript
// app/api/ai/image/route.ts
POST /api/ai/image
Body: { prompt: string }
Response: { imageUrl: string }
```

## 🔧 Customizing AI Prompts

### Modify Outline Generation

Edit `lib/ai.ts`:

```typescript
const prompt = `Generate a detailed ebook outline for the topic: "${topic}".
    
Format the outline as follows:
- Title
- Subtitle
- 5-10 chapters with descriptive titles
- 3-5 key points for each chapter

Make it comprehensive and well-structured.`
```

**Customization tips:**
- Change chapter count (5-10 → 8-12)
- Add specific requirements (tone, audience, length)
- Include genre or style instructions
- Add formatting requirements

### Modify Chapter Writing

Edit `lib/ai.ts`:

```typescript
const prompt = `Write a detailed chapter for an ebook.
    
Chapter Title: ${title}
Ebook Outline: ${outline}
${previousChapter ? `Previous Chapter: ${previousChapter}` : ''}

Write a comprehensive, engaging chapter (800-1500 words) that:
- Follows the outline structure
- Maintains narrative flow
- Includes examples and explanations
- Uses clear, professional language

Format the content in Markdown.`
```

**Customization options:**
- Adjust word count
- Change writing style (formal, casual, academic)
- Add specific requirements (include code examples, add exercises)
- Modify tone (inspirational, educational, entertaining)

### Add Content Improvement Feature

```typescript
export const geminiService = {
  // ... existing methods
  
  async improveContent(content: string, instruction: string): Promise<string> {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const prompt = `Improve the following content based on this instruction: "${instruction}"
    
    Content:
    ${content}
    
    Return the improved version maintaining the same format.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  },
}
```

## 🎯 Advanced Features

### Context-Aware Generation

The AI maintains context across chapters:

```typescript
await geminiService.generateChapter(
  title,
  outline,
  previousChapter // Maintains continuity
)
```

### Batch Processing

Generate multiple chapters:

```typescript
const chapters = []
for (const chapterTitle of outlineChapters) {
  const content = await geminiService.generateChapter(
    chapterTitle,
    outline,
    chapters[chapters.length - 1]
  )
  chapters.push(content)
}
```

### Custom AI Workflows

Create custom AI features:

```typescript
// lib/ai.ts
export const customAIService = {
  async generateTitle(content: string): Promise<string> {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    const prompt = `Create an engaging title for this content: ${content}`
    const result = await model.generateContent(prompt)
    return result.response.text()
  },

  async summarizeChapter(content: string): Promise<string> {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    const prompt = `Summarize this chapter in 2-3 sentences: ${content}`
    const result = await model.generateContent(prompt)
    return result.response.text()
  },

  async generateKeywords(content: string): Promise<string[]> {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    const prompt = `Extract 5-10 keywords from this content: ${content}`
    const result = await model.generateContent(prompt)
    const text = result.response.text()
    return text.split(',').map(k => k.trim())
  },
}
```

## 🔐 API Security

### Rate Limiting

Implement rate limiting for AI endpoints:

```typescript
// middleware/rateLimit.ts
export function rateLimit(maxRequests: number, windowMs: number) {
  // Implementation
}

// app/api/ai/outline/route.ts
import { rateLimit } from '@/middleware/rateLimit'

const limiter = rateLimit(10, 60000) // 10 requests per minute

export async function POST(req: Request) {
  await limiter(req)
  // ... rest of the code
}
```

### API Key Validation

Validate Gemini API key:

```typescript
if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set')
}
```

## 📊 Monitoring & Logging

### Track AI Usage

```typescript
// lib/analytics.ts
export function logAIUsage(
  userId: string,
  feature: string,
  tokensUsed: number
) {
  // Log to analytics service
  console.log(`User ${userId} used ${feature}, tokens: ${tokensUsed}`)
}

// In AI service
const result = await model.generateContent(prompt)
logAIUsage(userId, 'outline-generation', result.tokensUsed)
```

### Error Handling

```typescript
export const geminiService = {
  async generateOutline(topic: string): Promise<string> {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
      const result = await model.generateContent(prompt)
      return result.response.text()
    } catch (error) {
      console.error('AI Error:', error)
      if (error.code === 'QUOTA_EXCEEDED') {
        throw new Error('AI quota exceeded. Please try again later.')
      }
      throw new Error('Failed to generate content. Please try again.')
    }
  },
}
```

## 🎨 Integrating Imagen 4 (Full Implementation)

To fully implement Imagen 4 image generation:

### 1. Set Up Google Cloud

```bash
# Install Google Cloud SDK
npm install @google-cloud/aiplatform
```

### 2. Configure Credentials

```typescript
// lib/imagen.ts
import { ImageGenerationServiceClient } from '@google-cloud/aiplatform'

const client = new ImageGenerationServiceClient({
  apiKey: process.env.IMAGEN_API_KEY,
})

export async function generateImage(prompt: string): Promise<string> {
  const [response] = await client.generateImages({
    prompt,
    numberOfImages: 1,
    imageSize: 'large',
  })
  
  return response.images[0].url
}
```

### 3. Update API Route

```typescript
// app/api/ai/image/route.ts
import { generateImage } from '@/lib/imagen'

export async function POST(req: Request) {
  const { prompt } = await req.json()
  const imageUrl = await generateImage(prompt)
  return NextResponse.json({ imageUrl })
}
```

## 🚀 Performance Optimization

### Caching AI Responses

```typescript
// lib/cache.ts
const cache = new Map<string, string>()

export function getCachedOrGenerate(
  key: string,
  generator: () => Promise<string>
): Promise<string> {
  if (cache.has(key)) {
    return Promise.resolve(cache.get(key)!)
  }
  
  return generator().then(result => {
    cache.set(key, result)
    return result
  })
}

// Usage
const outline = await getCachedOrGenerate(
  `outline-${topic}`,
  () => geminiService.generateOutline(topic)
)
```

### Streaming Responses

```typescript
export async function POST(req: Request) {
  const { prompt } = await req.json()
  
  const encoder = new TextEncoder()
  const stream = new TransformStream()
  const writer = stream.writable.getWriter()
  
  // Generate content in chunks
  const result = await model.generateContentStream(prompt)
  
  for await (const chunk of result.stream) {
    const text = chunk.text()
    await writer.write(encoder.encode(text))
  }
  
  await writer.close()
  
  return new Response(stream.readable, {
    headers: { 'Content-Type': 'text/plain' },
  })
}
```

## 📚 Best Practices

1. **Always validate user input** before sending to AI
2. **Implement proper error handling** for API failures
3. **Monitor API usage** to stay within quotas
4. **Cache frequent requests** to reduce API calls
5. **Use streaming** for long-form content generation
6. **Implement rate limiting** to prevent abuse
7. **Log all AI interactions** for debugging and analytics
8. **Provide fallbacks** when AI service is unavailable

## 🔮 Future Enhancements

- Multi-language support
- Voice-to-text for content input
- AI-powered proofreading
- Style consistency checker
- Plagiarism detection
- SEO optimization suggestions
- Character development (for fiction)
- Plot consistency checker

---

**Need help? Check the main README.md or SETUP.md for more information.**
