import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { ebookService, chapterService } from '@/lib/supabase'
import { generateEPUB } from '@/lib/export-helpers'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const id = params.id

    // Fetch ebook and verify ownership
    const ebook = await ebookService.getEbookById(id)
    
    if (!ebook || ebook.user_id !== userId) {
      return new NextResponse('Not found', { status: 404 })
    }

    // Fetch all chapters
    const chapters = await chapterService.getChaptersByEbookId(id)
    const sortedChapters = chapters.sort((a, b) => a.order - b.order)

    // Generate EPUB
    const epubBuffer = await generateEPUB({
      title: ebook.title,
      subtitle: ebook.subtitle,
      author: ebook.author || 'Anonymous',
      chapters: sortedChapters.map(ch => ({
        title: ch.title,
        content: ch.content,
        imageUrl: (ch as any).illustration_url
      })),
      coverImageUrl: ebook.cover_image_url
    })

    // Return EPUB file
    return new NextResponse(new Uint8Array(epubBuffer), {
      headers: {
        'Content-Type': 'application/epub+zip',
        'Content-Disposition': `attachment; filename="${ebook.title.replace(/[^a-z0-9]/gi, '_')}.epub"`
      }
    })
  } catch (error) {
    console.error('EPUB export error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
