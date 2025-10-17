import { NextResponse } from 'next/server'
import { geminiService } from '@/lib/ai'

export async function POST(req: Request) {
  try {
    const { topic } = await req.json()

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
    }

    const outline = await geminiService.generateOutline(topic)

    return NextResponse.json({ outline })
  } catch (error) {
    console.error('Error generating outline:', error)
    return NextResponse.json(
      { error: 'Failed to generate outline' },
      { status: 500 }
    )
  }
}
