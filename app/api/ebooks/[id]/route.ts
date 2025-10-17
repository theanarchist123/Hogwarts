import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { ebookService } from '@/lib/supabase'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const ebook = await ebookService.getEbookById(params.id)
    
    // Verify ownership
    if (ebook.user_id !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    
    return NextResponse.json(ebook)
  } catch (error) {
    console.error('Error fetching ebook:', error)
    return NextResponse.json({ error: 'Failed to fetch ebook' }, { status: 500 })
  }
}

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
    
    // Verify ownership first
    const ebook = await ebookService.getEbookById(params.id)
    if (ebook.user_id !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    
    const updated = await ebookService.updateEbook(params.id, updates)
    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating ebook:', error)
    return NextResponse.json({ error: 'Failed to update ebook' }, { status: 500 })
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

    // Verify ownership first
    const ebook = await ebookService.getEbookById(params.id)
    if (ebook.user_id !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    
    await ebookService.deleteEbook(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting ebook:', error)
    return NextResponse.json({ error: 'Failed to delete ebook' }, { status: 500 })
  }
}
