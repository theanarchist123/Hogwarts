import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { ebookService } from '@/lib/supabase'

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const ebooks = await ebookService.getEbooksByUserId(userId)
    return NextResponse.json(ebooks)
  } catch (error) {
    console.error('Error fetching ebooks:', error)
    return NextResponse.json({ error: 'Failed to fetch ebooks' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title } = await request.json()
    const ebook = await ebookService.createEbook(userId, title || 'Untitled Ebook')
    
    return NextResponse.json(ebook)
  } catch (error) {
    console.error('Error creating ebook:', error)
    return NextResponse.json({ error: 'Failed to create ebook' }, { status: 500 })
  }
}
