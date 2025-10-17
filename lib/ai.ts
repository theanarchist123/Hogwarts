import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

// Available Gemini models:
// - gemini-1.5-flash: Fast text generation (free tier - RECOMMENDED)
// - gemini-1.5-pro: Advanced model (requires paid API access)
// Note: gemini-pro is deprecated, use gemini-1.5-flash instead

export interface StoryOutline {
  title: string
  subtitle: string
  author: string
  chapters: {
    title: string
    summary: string
  }[]
}

export interface GeneratedChapter {
  title: string
  content: string
}

export const geminiService = {
  async generateCompleteStory(prompt: string): Promise<{
    outline: StoryOutline
    chapters: GeneratedChapter[]
  }> {
    // Use gemini-1.5-flash (free tier model)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    // Step 1: Generate story outline (OPTIMIZED - fewer chapters)
    const outlinePrompt = `You are a master storyteller. Based on this request: "${prompt}"

Generate a complete story outline in VALID JSON format. Return ONLY the JSON, no other text.

{
  "title": "Engaging story title",
  "subtitle": "Compelling subtitle",
  "author": "AI Generated",
  "chapters": [
    {
      "title": "Chapter 1 title",
      "summary": "What happens in this chapter"
    },
    {
      "title": "Chapter 2 title",
      "summary": "What happens in this chapter"
    }
  ]
}

Create 5-7 chapters. Make it engaging and match the requested genre/theme.`

    const outlineResult = await model.generateContent(outlinePrompt)
    const outlineText = (await outlineResult.response).text()
    
    // Parse the outline (handle markdown code blocks if present)
    let outline: StoryOutline
    try {
      const jsonMatch = outlineText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        outline = JSON.parse(jsonMatch[0])
      } else {
        outline = JSON.parse(outlineText)
      }
    } catch (error) {
      throw new Error('Failed to parse story outline: ' + outlineText)
    }

    // Step 2: Generate all chapters (OPTIMIZED - shorter, faster)
    const chapters: GeneratedChapter[] = []
    
    for (let i = 0; i < outline.chapters.length; i++) {
      const chapter = outline.chapters[i]
      const previousContent = i > 0 ? chapters[i - 1].content : ''
      
      const chapterPrompt = `You are writing chapter ${i + 1} of "${outline.title}".

Story Context: ${prompt}
Chapter Title: ${chapter.title}
Chapter Summary: ${chapter.summary}
${previousContent ? `\nPrevious Chapter Summary: ${previousContent.substring(0, 500)}...` : ''}

Write a compelling chapter (600-800 words) that:
- Matches the requested genre and tone
- Develops characters and plot
- Uses vivid descriptions and dialogue
- Flows smoothly from the previous chapter

Format in Markdown. Be engaging and concise!`

      const chapterResult = await model.generateContent(chapterPrompt)
      const content = (await chapterResult.response).text()
      
      chapters.push({
        title: chapter.title,
        content: content
      })
    }

    return { outline, chapters }
  },

  async generateOutline(topic: string): Promise<string> {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const prompt = `Generate a detailed ebook outline for the topic: "${topic}".
    
    Format the outline as follows:
    - Title
    - Subtitle
    - 5-10 chapters with descriptive titles
    - 3-5 key points for each chapter
    
    Make it comprehensive and well-structured.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  },

  async generateChapter(title: string, outline: string, previousChapter?: string): Promise<string> {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

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

    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  },

  async improveContent(content: string, instruction: string): Promise<string> {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const prompt = `Improve the following content based on this instruction: "${instruction}"
    
    Content:
    ${content}
    
    Return the improved version maintaining the same format.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  },
}

export const imagenService = {
  async generateIllustrationPrompt(chapterTitle: string, chapterContent: string): Promise<string> {
    // Use Gemini to create an optimized image prompt from the chapter
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    
    const prompt = `Based on this chapter from a storybook:

Title: ${chapterTitle}
Content: ${chapterContent.substring(0, 1000)}...

Create a detailed image prompt for a storybook illustration that captures the essence of this chapter.
The prompt should be visual, descriptive, and suitable for AI image generation.

Format: Return ONLY the image prompt, nothing else. Make it vivid and specific.
Style: Storybook illustration, digital art, professional quality.

Example format: "A detailed storybook illustration showing [scene description], [character details], [atmosphere], [style notes]"`

    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text().trim()
  },

  async generateIllustration(imagePrompt: string): Promise<string> {
    // Generate image using Pollinations AI (free alternative to Imagen)
    // Pollinations.ai provides free image generation with no API key required
    const encodedPrompt = encodeURIComponent(imagePrompt + ', storybook illustration, professional digital art, high quality, detailed artwork')
    
    // Using Pollinations AI - a free, reliable image generation service
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true`
    
    return imageUrl
  },
}
