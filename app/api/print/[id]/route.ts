import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { ebookService, chapterService } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const id = params.id

    // Fetch ebook and verify ownership
    const ebook = await ebookService.getEbookById(id)
    
    if (!ebook || ebook.user_id !== userId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    // Fetch all chapters
    const chapters = await chapterService.getChaptersByEbookId(id)
    const sortedChapters = chapters.sort((a, b) => a.order - b.order)

    return NextResponse.json({
      ebook,
      chapters: sortedChapters
    })
  } catch (error) {
    console.error('Error fetching print data:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
