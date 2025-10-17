import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { geminiService, imagenService } from '@/lib/ai'
import { ebookService, chapterService } from '@/lib/supabase'

export const maxDuration = 300 // 5 minutes for story generation

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { prompt } = await request.json()
    
    if (!prompt || prompt.trim().length < 10) {
      return NextResponse.json(
        { error: 'Please provide a detailed story prompt (at least 10 characters)' },
        { status: 400 }
      )
    }

    // Generate the complete story with AI
    const { outline, chapters } = await geminiService.generateCompleteStory(prompt)

    // Create the ebook in database
    const ebook = await ebookService.createEbook(userId, outline.title)
    
    // Generate cover image for the ebook
    const coverPrompt = `Book cover for "${outline.title}" - ${outline.subtitle}. ${prompt.substring(0, 200)}. Professional book cover art, dramatic composition, title space at top`
    const coverImageUrl = await imagenService.generateIllustration(coverPrompt)
    
    // Update ebook with subtitle, author, and cover image
    await ebookService.updateEbook(ebook.id, {
      subtitle: outline.subtitle,
      author: outline.author,
      cover_image_url: coverImageUrl,
    })

    // Create all chapters with images in database
    const createdChapters = []
    for (let i = 0; i < chapters.length; i++) {
      // Generate image prompt from chapter content
      const imagePrompt = await imagenService.generateIllustrationPrompt(
        chapters[i].title,
        chapters[i].content
      )
      
      // Generate image URL
      const imageUrl = await imagenService.generateIllustration(imagePrompt)
      
      // Add image to chapter content (image at the top of each chapter)
      const contentWithImage = `![${chapters[i].title}](${imageUrl})\n\n${chapters[i].content}`
      
      const chapter = await chapterService.createChapter(
        ebook.id,
        chapters[i].title,
        contentWithImage,
        i + 1
      )
      createdChapters.push(chapter)
    }

    return NextResponse.json({
      success: true,
      ebook: {
        id: ebook.id,
        title: outline.title,
        subtitle: outline.subtitle,
        author: outline.author,
        chaptersCount: chapters.length,
      },
    })
  } catch (error) {
    console.error('Error generating story:', error)
    return NextResponse.json(
      { error: 'Failed to generate story. Please try again.' },
      { status: 500 }
    )
  }
}
