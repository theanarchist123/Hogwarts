import { NextResponse } from 'next/server'
import { geminiService } from '@/lib/ai'

export async function POST(req: Request) {
  try {
    const { title, outline, previousChapter } = await req.json()

    if (!title || !outline) {
      return NextResponse.json(
        { error: 'Title and outline are required' },
        { status: 400 }
      )
    }

    const content = await geminiService.generateChapter(title, outline, previousChapter)

    return NextResponse.json({ content })
  } catch (error) {
    console.error('Error generating chapter:', error)
    return NextResponse.json(
      { error: 'Failed to generate chapter' },
      { status: 500 }
    )
  }
}
