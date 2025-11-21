import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { textGenerator } from '@/lib/ai-providers'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { chapterInfo, previousContext, genre } = await req.json()

    if (!chapterInfo?.title || !chapterInfo?.summary) {
      return NextResponse.json(
        { error: 'Chapter info (title and summary) is required' },
        { status: 400 }
      )
    }

    const result = await textGenerator.generateChapter(
      { ...chapterInfo, genre: genre || 'fantasy' },
      previousContext
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error('Chapter generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate chapter' },
      { status: 500 }
    )
  }
}
