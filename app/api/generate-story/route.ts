import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { ebookService, chapterService } from '@/lib/supabase'
import { generateCompleteStory } from '@/lib/ai-providers'

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { prompt } = body

    if (!prompt || prompt.trim().length < 10) {
      return NextResponse.json(
        { error: 'Please provide a detailed story prompt (at least 10 characters)' },
        { status: 400 }
      )
    }

    // Generate complete story with AI (Groq + AI Horde)
    const story = await generateCompleteStory(prompt)

    // Create ebook in database
    const ebook = await ebookService.createEbook(userId, story.title)

    // Update ebook with story details
    await ebookService.updateEbook(ebook.id, {
      title: story.title,
      subtitle: story.subtitle,
      cover_image_url: story.coverImageUrl,
    })

    // Create chapters
    for (const chapter of story.chapters) {
      // Format chapter content with image
      const content = `![${chapter.title}](${chapter.illustrationUrl})\n\n${chapter.content}`
      
      await chapterService.createChapter(
        ebook.id,
        chapter.title,
        content,
        chapter.number
      )
    }

    // Fetch the complete ebook with chapters
    const completeEbook = await ebookService.getEbookById(ebook.id)

    return NextResponse.json({ 
      success: true,
      ebook: completeEbook,
      message: 'Story generated successfully!'
    })
  } catch (error) {
    console.error('Error generating story:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to generate story',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
