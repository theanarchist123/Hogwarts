import Groq from 'groq-sdk'

// Free AI providers with fallbacks
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! })

// AI Horde configuration
const HORDE_API = 'https://aihorde.net/api/v2'

export interface StoryOutline {
  title: string
  subtitle?: string
  genre: string
  chapters: Array<{
    number: number
    title: string
    summary: string
  }>
}

export interface GeneratedChapter {
  title: string
  content: string
}

// Enhanced prompts for rich content
const SYSTEM_PROMPTS = {
  outline: `You are a senior fiction editor with decades of experience. Create compelling, well-structured story outlines.

Requirements:
- Strong narrative arcs with rising action, climax, resolution
- Distinct character voices and development
- Vivid sensory details and world-building
- Proper pacing and chapter breaks
- Show don't tell; avoid exposition dumps
- No copyrighted characters or settings

Return ONLY valid JSON, no markdown blocks.`,

  chapter: `You are an award-winning novelist known for immersive, character-driven fiction.

Writing guidelines:
- Show don't tell; use sensory details (sight, sound, smell, texture, taste)
- Varied sentence rhythm (mix short punchy and flowing complex sentences)
- Strong character voice and consistent POV
- Natural dialogue without exposition
- Vivid imagery and metaphor
- End with a subtle hook to the next chapter
- 700-900 words
- No modern slang in historical settings
- Proper paragraphing and pacing

Write in markdown format with proper formatting.`,

  image: `Create a vivid, detailed image prompt for a storybook illustration.

Requirements:
- Describe the key scene, characters, and mood
- Include art style: "storybook illustration, painterly, soft shading, clean lines"
- Specify lighting and atmosphere
- Color palette if relevant
- NO text, watermarks, or logos
- High detail, professional quality

Return ONLY the image prompt (no explanation).`
}

// Text generation with Groq (free, fast)
export const textGenerator = {
  async generateStoryOutline(userPrompt: string): Promise<StoryOutline> {
    const prompt = `User's story idea: ${userPrompt}

Create a complete story outline with 5-7 chapters.

Return JSON in this exact format:
{
  "title": "Story Title",
  "subtitle": "Optional Subtitle",
  "genre": "Genre",
  "chapters": [
    {"number": 1, "title": "Chapter Title", "summary": "Brief summary"}
  ]
}`

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPTS.outline },
        { role: 'user', content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 2000
    })

    const text = response.choices[0].message?.content?.trim() || '{}'
    // Remove markdown code blocks if present
    const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    
    return JSON.parse(cleanText)
  },

  async generateChapter(
    chapterInfo: { title: string; summary: string; genre: string },
    previousContext?: string
  ): Promise<string> {
    const contextNote = previousContext 
      ? `\n\nPrevious context: ${previousContext.slice(-500)}` 
      : ''

    const prompt = `Genre: ${chapterInfo.genre}
Chapter Title: ${chapterInfo.title}
Chapter Summary: ${chapterInfo.summary}${contextNote}

Write this chapter now (700-900 words):`

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPTS.chapter },
        { role: 'user', content: prompt }
      ],
      temperature: 0.85,
      max_tokens: 2500
    })

    return response.choices[0].message?.content?.trim() || ''
  },

  async improveContent(content: string, instruction: string): Promise<string> {
    const systemPrompt = `You are an expert editor. Improve the text based on the instruction while maintaining voice and style.

Guidelines:
- Keep the original tone and character voice
- Preserve key plot points
- Show don't tell
- Use vivid sensory details
- Natural dialogue
- Varied sentence structure

Return ONLY the improved text (no explanations).`

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Instruction: ${instruction}\n\nOriginal text:\n${content}` }
      ],
      temperature: 0.7,
      max_tokens: 3000
    })

    return response.choices[0].message?.content?.trim() || content
  },

  async generateImagePrompt(chapterTitle: string, chapterContent: string, genre: string): Promise<string> {
    const excerpt = chapterContent.slice(0, 800)
    
    const prompt = `Genre: ${genre}
Chapter: ${chapterTitle}
Content excerpt: ${excerpt}

Generate a detailed image prompt for the key scene in this chapter.`

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPTS.image },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 300
    })

    const basePrompt = response.choices[0].message?.content?.trim() || ''
    
    // Enhance with quality tags
    return `${basePrompt}, storybook illustration, painterly, soft shading, clean lines, high detail, dramatic lighting, professional quality, 1024x1024`
  }
}

// Image generation with AI Horde (free, Stable Diffusion)
export const imageGenerator = {
  async generateImage(prompt: string, model: string = 'SDXL 1.0'): Promise<{ url: string; seed: number }> {
    // Use Pollinations as primary (instant, no queue)
    console.log('🎨 Generating image with Pollinations...')
    const url = this.getPollinationsUrl(prompt)
    
    return {
      url,
      seed: Date.now() // Use timestamp as seed
    }
  },

  // Pollinations: Instant, free image generation
  getPollinationsUrl(prompt: string): string {
    const encoded = encodeURIComponent(prompt)
    const seed = Math.floor(Math.random() * 1000000)
    return `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=1024&seed=${seed}&nologo=true&enhance=true&model=flux`
  },

  // Backup: AI Horde (slower but more control)
  async generateImageWithHorde(prompt: string, model: string = 'SDXL 1.0'): Promise<{ url: string; seed: number }> {
    const negativePrompt = 'blurry, low-res, text, watermark, logo, extra fingers, deformed, cropped head, bad anatomy, worst quality'
    
    // Submit generation request
    const submitResponse = await fetch(`${HORDE_API}/generate/async`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': '0000000000' // Anonymous key (free tier)
      },
      body: JSON.stringify({
        prompt,
        params: {
          sampler_name: 'k_euler',
          width: 1024,
          height: 1024,
          steps: 28,
          cfg_scale: 6.5,
          karras: true,
          hires_fix: true,
          n: 1
        },
        nsfw: false,
        censor_nsfw: true,
        trusted_workers: false,
        slow_workers: true,
        workers: [],
        models: [model],
        r2: true,
        replacement_filter: true
      })
    })

    const submitData = await submitResponse.json()
    const id = submitData.id

    if (!id) {
      throw new Error('Failed to submit image generation request')
    }

    // Poll for completion (with timeout)
    const maxAttempts = 120 // 2 minutes max
    let attempts = 0

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const statusResponse = await fetch(`${HORDE_API}/generate/status/${id}`)
      const status = await statusResponse.json()

      if (status.done) {
        const generation = status.generations?.[0]
        if (generation?.img) {
          return {
            url: `data:image/png;base64,${generation.img}`,
            seed: generation.seed || 0
          }
        }
      }

      if (status.faulted) {
        throw new Error('Image generation failed')
      }

      attempts++
    }

    throw new Error('Image generation timeout')
  }
}

// Complete story generation pipeline
export async function generateCompleteStory(userPrompt: string) {
  console.log('📖 Generating story outline...')
  const outline = await textGenerator.generateStoryOutline(userPrompt)

  console.log('🎨 Generating cover image...')
  const coverPrompt = `Book cover for "${outline.title}", ${outline.genre} genre, professional book cover design, dramatic composition, title space at top, high quality illustration, detailed artwork`
  const coverImage = await imageGenerator.generateImage(coverPrompt)

  console.log('✍️ Generating chapters...')
  const chapters = []
  let previousContext = ''

  for (const chapterOutline of outline.chapters) {
    console.log(`  Chapter ${chapterOutline.number}: ${chapterOutline.title}`)
    
    // Generate chapter text
    const content = await textGenerator.generateChapter(
      {
        title: chapterOutline.title,
        summary: chapterOutline.summary,
        genre: outline.genre
      },
      previousContext
    )

    // Generate image prompt
    const imagePrompt = await textGenerator.generateImagePrompt(
      chapterOutline.title,
      content,
      outline.genre
    )

    // Generate chapter illustration
    const illustration = await imageGenerator.generateImage(imagePrompt)

    chapters.push({
      number: chapterOutline.number,
      title: chapterOutline.title,
      content,
      illustrationUrl: illustration.url,
      illustrationSeed: illustration.seed
    })

    // Keep context for next chapter
    previousContext = content.slice(-500)
  }

  return {
    ...outline,
    coverImageUrl: coverImage.url,
    coverSeed: coverImage.seed,
    chapters
  }
}
