import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { textGenerator } from '@/lib/ai-providers'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { prompt } = await req.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    const outline = await textGenerator.generateStoryOutline(prompt)
    
    return NextResponse.json(outline)
  } catch (error) {
    console.error('Outline generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate outline' },
      { status: 500 }
    )
  }
}
