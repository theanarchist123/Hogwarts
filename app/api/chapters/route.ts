import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { chapterService, ebookService } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { ebookId, title, order, content = '' } = await request.json()
    
    // Verify ebook ownership
    const ebook = await ebookService.getEbookById(ebookId)
    if (ebook.user_id !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    
    const chapter = await chapterService.createChapter(ebookId, title, content, order)
    return NextResponse.json(chapter)
  } catch (error) {
    console.error('Error creating chapter:', error)
    return NextResponse.json({ error: 'Failed to create chapter' }, { status: 500 })
  }
}
