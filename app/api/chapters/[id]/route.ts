import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { chapterService } from '@/lib/supabase'

// GET /api/chapters/[id] - Get a single chapter
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const chapter = await chapterService.getChapterById(params.id)
    
    if (!chapter) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 })
    }

    return NextResponse.json(chapter)
  } catch (error) {
    console.error('Get chapter error:', error)
    return NextResponse.json(
      { error: 'Failed to get chapter' },
      { status: 500 }
    )
  }
}

// PATCH /api/chapters/[id] - Update a chapter
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const updates = await req.json()
    const chapter = await chapterService.updateChapter(params.id, updates)

    return NextResponse.json(chapter)
  } catch (error) {
    console.error('Update chapter error:', error)
    return NextResponse.json(
      { error: 'Failed to update chapter' },
      { status: 500 }
    )
  }
}

// DELETE /api/chapters/[id] - Delete a chapter
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await chapterService.deleteChapter(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete chapter error:', error)
    return NextResponse.json(
      { error: 'Failed to delete chapter' },
      { status: 500 }
    )
  }
}
