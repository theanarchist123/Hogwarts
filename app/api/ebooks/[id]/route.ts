import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { ebookService } from '@/lib/supabase'

// GET /api/ebooks/[id] - Get a single ebook
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const ebook = await ebookService.getEbookById(params.id)
    
    if (!ebook) {
      return NextResponse.json({ error: 'Ebook not found' }, { status: 404 })
    }

    return NextResponse.json(ebook)
  } catch (error) {
    console.error('Get ebook error:', error)
    return NextResponse.json(
      { error: 'Failed to get ebook' },
      { status: 500 }
    )
  }
}

// PATCH /api/ebooks/[id] - Update an ebook
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
    const ebook = await ebookService.updateEbook(params.id, updates)

    return NextResponse.json(ebook)
  } catch (error) {
    console.error('Update ebook error:', error)
    return NextResponse.json(
      { error: 'Failed to update ebook' },
      { status: 500 }
    )
  }
}

// DELETE /api/ebooks/[id] - Delete an ebook
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await ebookService.deleteEbook(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete ebook error:', error)
    return NextResponse.json(
      { error: 'Failed to delete ebook' },
      { status: 500 }
    )
  }
}
