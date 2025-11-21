import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { chapterService } from '@/lib/supabase'

// GET /api/chapters?ebookId=xxx - Get all chapters for an ebook
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const ebookId = searchParams.get('ebookId')

    if (!ebookId) {
      return NextResponse.json(
        { error: 'ebookId is required' },
        { status: 400 }
      )
    }

    const chapters = await chapterService.getChaptersByEbookId(ebookId)
    return NextResponse.json(chapters)
  } catch (error) {
    console.error('Get chapters error:', error)
    return NextResponse.json(
      { error: 'Failed to get chapters' },
      { status: 500 }
    )
  }
}

// POST /api/chapters - Create a new chapter
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await req.json()
    
    if (!data.ebook_id || !data.title || data.order === undefined) {
      return NextResponse.json(
        { error: 'ebook_id, title, and order are required' },
        { status: 400 }
      )
    }

    const chapter = await chapterService.createChapter(
      data.ebook_id,
      data.title,
      data.content || '',
      data.order
    )

    return NextResponse.json(chapter, { status: 201 })
  } catch (error) {
    console.error('Create chapter error:', error)
    return NextResponse.json(
      { error: 'Failed to create chapter' },
      { status: 500 }
    )
  }
}
