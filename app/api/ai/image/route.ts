import { NextResponse } from 'next/server'
import { imagenService } from '@/lib/ai'

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    const imageUrl = await imagenService.generateIllustration(prompt)

    return NextResponse.json({ imageUrl })
  } catch (error) {
    console.error('Error generating illustration:', error)
    return NextResponse.json(
      { error: 'Failed to generate illustration' },
      { status: 500 }
    )
  }
}
