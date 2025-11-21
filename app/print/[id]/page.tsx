'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

interface Chapter {
  id: string
  title: string
  content: string
  order: number
  illustration_url?: string
}

interface Ebook {
  id: string
  title: string
  subtitle?: string
  author: string
  cover_image_url?: string
}

export default function PrintPage() {
  const params = useParams()
  const id = params?.id as string
  
  const [ebook, setEbook] = useState<Ebook | null>(null)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadEbook() {
      if (!id) return
      
      try {
        const response = await fetch(`/api/print/${id}`)
        if (!response.ok) throw new Error('Failed to load ebook')
        
        const data = await response.json()
        setEbook(data.ebook)
        setChapters(data.chapters)
      } catch (error) {
        console.error('Error loading ebook:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadEbook()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!ebook) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Ebook not found</p>
      </div>
    )
  }

  return (
    <>
      <style jsx global>{`
        @page {
          size: 6in 9in;
          margin: 0.75in 0.625in;
          
          @top-left {
            content: "${ebook.title}";
            font-family: 'Garamond', 'Georgia', serif;
            font-size: 9pt;
            font-style: italic;
          }
          
          @top-right {
            content: counter(page);
            font-family: 'Garamond', 'Georgia', serif;
            font-size: 9pt;
          }
        }
        
        @page :first {
          margin: 0;
          @top-left { content: none; }
          @top-right { content: none; }
        }
      `}</style>
      
      <div className="book-prose theme-paper">
        {/* Cover */}
        {ebook.cover_image_url && (
          <div className="title-page" style={{ pageBreakAfter: 'always' }}>
            <img 
              src={ebook.cover_image_url} 
              alt="Cover" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        )}
        
        {/* Title page */}
        <div className="title-page" style={{ textAlign: 'center', pageBreakAfter: 'always' }}>
          <h1 style={{ marginTop: '3in' }}>{ebook.title}</h1>
          {ebook.subtitle && (
            <p style={{ fontSize: '14pt', fontStyle: 'italic', margin: '0.5em 0' }}>
              {ebook.subtitle}
            </p>
          )}
          <p style={{ fontSize: '12pt', marginTop: '2em' }}>
            by {ebook.author}
          </p>
        </div>
        
        {/* Chapters */}
        {chapters.map((chapter, index) => (
          <div key={chapter.id} style={{ pageBreakBefore: index > 0 ? 'always' : 'auto' }}>
            <h2>{chapter.title}</h2>
            {chapter.illustration_url && (
              <img 
                src={chapter.illustration_url} 
                alt={chapter.title}
                style={{ maxWidth: '100%', margin: '1em auto', display: 'block' }}
              />
            )}
            {chapter.content.split('\n\n').map((para, pIndex) => {
              const text = para
                .replace(/^#+\s+/, '')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
              
              return (
                <p 
                  key={pIndex}
                  className={index === 0 && pIndex === 0 ? 'drop-cap' : ''}
                  dangerouslySetInnerHTML={{ __html: text }}
                />
              )
            })}
          </div>
        ))}
      </div>
      
      {/* Paged.js polyfill */}
      <script src="https://unpkg.com/pagedjs/dist/paged.polyfill.js"></script>
    </>
  )
}
