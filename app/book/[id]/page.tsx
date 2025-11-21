'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Home } from 'lucide-react'
import type { Ebook, Chapter } from '@/lib/supabase'

export default function BookPage() {
  const params = useParams()
  const router = useRouter()
  const [ebook, setEbook] = useState<Ebook | null>(null)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadBook() {
      try {
        const ebookRes = await fetch(`/api/ebooks/${params.id}`)
        const ebookData = await ebookRes.json()
        setEbook(ebookData)

        const chaptersRes = await fetch(`/api/chapters?ebookId=${params.id}`)
        const chaptersData = await chaptersRes.json()
        setChapters(chaptersData)
      } catch (error) {
        console.error('Failed to load book:', error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      loadBook()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading book...</p>
        </div>
      </div>
    )
  }

  if (!ebook || chapters.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Book not found</h2>
          <Button onClick={() => router.push('/dashboard')}>
            <Home className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  const currentChapter = chapters[currentChapterIndex]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/dashboard')}
            >
              <Home className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-bold text-lg">{ebook.title}</h1>
              <p className="text-sm text-muted-foreground">
                Chapter {currentChapterIndex + 1} of {chapters.length}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentChapterIndex(prev => Math.max(0, prev - 1))}
              disabled={currentChapterIndex === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentChapterIndex(prev => Math.min(chapters.length - 1, prev + 1))}
              disabled={currentChapterIndex === chapters.length - 1}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </header>

      {/* Chapter Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <article className="prose prose-slate dark:prose-invert max-w-none">
          <h2 className="text-3xl font-bold mb-6">{currentChapter.title}</h2>
          
          {(currentChapter as any).illustration_url && (
            <img
              src={(currentChapter as any).illustration_url}
              alt={currentChapter.title}
              className="w-full rounded-lg mb-8 shadow-lg"
            />
          )}

          <div
            className="whitespace-pre-wrap leading-relaxed text-lg"
            dangerouslySetInnerHTML={{ __html: currentChapter.content }}
          />
        </article>

        {/* Chapter Navigation Footer */}
        <div className="flex items-center justify-between mt-12 pt-8 border-t">
          {currentChapterIndex > 0 ? (
            <Button
              variant="ghost"
              onClick={() => setCurrentChapterIndex(prev => prev - 1)}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              {chapters[currentChapterIndex - 1]?.title}
            </Button>
          ) : (
            <div />
          )}

          {currentChapterIndex < chapters.length - 1 ? (
            <Button
              variant="ghost"
              onClick={() => setCurrentChapterIndex(prev => prev + 1)}
            >
              {chapters[currentChapterIndex + 1]?.title}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <div />
          )}
        </div>
      </main>
    </div>
  )
}
