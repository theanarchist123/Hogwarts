import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { geminiService } from '@/lib/ai'
import { supabaseServer } from '@/lib/supabase-server'

export const maxDuration = 60 // 60 seconds timeout

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { chapterId, originalText, instruction, fullContent } = await request.json()

    if (!chapterId || !originalText || !instruction) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    console.log('Improving content with AI...')
    console.log('Original text:', originalText.substring(0, 100) + '...')
    console.log('Instruction:', instruction)

    // Use Gemini AI to improve the content
    const improvedText = await geminiService.improveContent(originalText, instruction)

    console.log('Improved text:', improvedText.substring(0, 100) + '...')

    // Replace the original text with improved text in the full content
    const updatedContent = fullContent.replace(originalText, improvedText)

    // Update the chapter in database
    const { error: updateError } = await supabaseServer
      .from('chapters')
      .update({ content: updatedContent })
      .eq('id', chapterId)
      .eq('user_id', userId)

    if (updateError) {
      console.error('Database update error:', updateError)
      throw new Error('Failed to update chapter')
    }

    console.log('✅ Content improved and saved successfully')

    return NextResponse.json({
      success: true,
      improvedText,
      message: 'Content improved successfully'
    })
  } catch (error) {
    console.error('Error improving content:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to improve content' },
      { status: 500 }
    )
  }
}
