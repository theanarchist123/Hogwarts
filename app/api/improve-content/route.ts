import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { textGenerator } from '@/lib/ai-providers'

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { content, instruction } = body

    if (!content || !instruction) {
      return NextResponse.json(
        { error: 'Content and instruction are required' },
        { status: 400 }
      )
    }

    // Improve content with Groq AI
    const improvedContent = await textGenerator.improveContent(content, instruction)

    return NextResponse.json({ 
      success: true,
      improvedContent
    })
  } catch (error) {
    console.error('Error improving content:', error)
    return NextResponse.json(
      { error: 'Failed to improve content' },
      { status: 500 }
    )
  }
}
