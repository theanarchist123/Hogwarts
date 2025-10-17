import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { chapterService, ebookService } from '@/lib/supabase'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const updates = await request.json()
    
    // Get chapter to verify ownership through ebook
    const chapter = await chapterService.getChapterById(params.id)
    const ebook = await ebookService.getEbookById(chapter.ebook_id)
    
    if (ebook.user_id !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    
    const updated = await chapterService.updateChapter(params.id, updates)
    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating chapter:', error)
    return NextResponse.json({ error: 'Failed to update chapter' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get chapter to verify ownership through ebook
    const chapter = await chapterService.getChapterById(params.id)
    const ebook = await ebookService.getEbookById(chapter.ebook_id)
    
    if (ebook.user_id !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    
    await chapterService.deleteChapter(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting chapter:', error)
    return NextResponse.json({ error: 'Failed to delete chapter' }, { status: 500 })
  }
}
