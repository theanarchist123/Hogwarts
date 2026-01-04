'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import type { Ebook, Chapter } from '@/lib/supabase'
import { BookOpen, Edit, Home, Maximize, X, Download, Printer, Book, FileText } from 'lucide-react'
import { Sparkles } from '@/components/animate-ui/icons/sparkles'
import ReactMarkdown from 'react-markdown'

export default function ReadBookPage() {
  const { user } = useUser()
  const params = useParams()
  const router = useRouter()
  const ebookId = params.id as string

  const [ebook, setEbook] = useState<Ebook | null>(null)
  const [currentSpread, setCurrentSpread] = useState(0) // Each spread shows 2 pages
  const [loading, setLoading] = useState(true)
  const [isFlipping, setIsFlipping] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  
  // AI Edit feature
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedText, setSelectedText] = useState('')
  const [editInstruction, setEditInstruction] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [currentEditChapter, setCurrentEditChapter] = useState<Chapter | null>(null)

  useEffect(() => {
    if (user && ebookId) {
      loadEbook()
    }
  }, [user, ebookId])

  const loadEbook = async () => {
    try {
      const response = await fetch(`/api/ebooks/${ebookId}`)
      if (!response.ok) throw new Error('Failed to load ebook')
      const data = await response.json()
      setEbook(data)
    } catch (error) {
      console.error('Error loading ebook:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  // Extract image from chapter content
  const extractImage = (content: string) => {
    const imageRegex = /!\[.*?\]\((https:\/\/image\.pollinations\.ai\/[^)]+)\)/
    const match = content.match(imageRegex)
    return match ? match[1] : null
  }

  // Remove image markdown from content
  const removeImageFromContent = (content: string) => {
    return content.replace(/!\[.*?\]\(https:\/\/image\.pollinations\.ai\/[^)]+\)\n\n/g, '')
  }

  // Build all pages: blank, cover, then for each chapter -> content page, then image page
  const buildAllPages = (): Array<{
    type: string;
    chapter?: Chapter;
    content?: string;
    image?: string;
  }> => {
    // Start with blank page so cover appears on right side
    const pages: Array<{
      type: string;
      chapter?: Chapter;
      content?: string;
      image?: string;
    }> = [{ type: 'blank' }, { type: 'cover' }]
    
    ebook?.chapters?.forEach((chapter) => {
      const chapterImage = extractImage(chapter.content)
      const chapterText = removeImageFromContent(chapter.content)
      
      // Add content page
      pages.push({
        type: 'chapter-content',
        chapter,
        content: chapterText
      })
      
      // Add image page if exists
      if (chapterImage) {
        pages.push({
          type: 'chapter-image',
          chapter,
          image: chapterImage
        })
      }
    })
    
    return pages
  }

  const allPagesExpanded = buildAllPages()
  const totalSpreadsUpdated = Math.ceil(allPagesExpanded.length / 2)
  const totalSpreads = totalSpreadsUpdated

  const canGoNext = currentSpread < totalSpreadsUpdated - 1
  const canGoPrev = currentSpread > 0

  const nextSpread = () => {
    if (canGoNext && !isFlipping) {
      setIsFlipping(true)
      setCurrentSpread(prev => prev + 1)
      setTimeout(() => setIsFlipping(false), 800)
    }
  }

  const prevSpread = () => {
    if (canGoPrev && !isFlipping) {
      setIsFlipping(true)
      setCurrentSpread(prev => prev - 1)
      setTimeout(() => setIsFlipping(false), 800)
    }
  }

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') nextSpread()
    if (e.key === 'ArrowLeft') prevSpread()
    if (e.key === 'f' || e.key === 'F') toggleFullscreen()
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentSpread, totalSpreadsUpdated, isFlipping])

  // Handle text selection for AI editing
  const handleTextSelection = (chapter: Chapter) => {
    const selection = window.getSelection()
    const text = selection?.toString().trim()
    
    if (text && text.length > 10) {
      setSelectedText(text)
      setCurrentEditChapter(chapter)
      setShowEditDialog(true)
      setEditInstruction('')
    }
  }

  // AI improve content
  const handleImproveContent = async () => {
    if (!selectedText || !editInstruction || !currentEditChapter) return
    
    setIsEditing(true)
    try {
      const response = await fetch('/api/improve-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapterId: currentEditChapter.id,
          originalText: selectedText,
          instruction: editInstruction,
          fullContent: currentEditChapter.content
        }),
      })

      if (!response.ok) throw new Error('Failed to improve content')
      
      const data = await response.json()
      
      // Reload the ebook to show updated content
      await loadEbook()
      
      setShowEditDialog(false)
      setSelectedText('')
      setEditInstruction('')
      setCurrentEditChapter(null)
      
      alert('✨ Content improved successfully!')
    } catch (error) {
      console.error('Error improving content:', error)
      alert('Failed to improve content. Please try again.')
    } finally {
      setIsEditing(false)
    }
  }

  // Get left and right pages for current spread
  const leftPageIndex = currentSpread * 2
  const rightPageIndex = currentSpread * 2 + 1
  
  const leftPage = allPagesExpanded[leftPageIndex]
  const rightPage = allPagesExpanded[rightPageIndex]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-black flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-white/80 animate-pulse mx-auto mb-4" />
          <p className="text-white/80 text-lg">Opening your book...</p>
        </div>
      </div>
    )
  }

  const renderPage = (page: any, side: 'left' | 'right') => {
    if (!page) {
      return (
        <div className="h-full bg-amber-50 flex items-center justify-center">
          <p className="text-gray-400 italic">End of book</p>
        </div>
      )
    }

    // Blank page (for proper book layout)
    if (page.type === 'blank') {
      return (
        <div className="h-full bg-amber-50"></div>
      )
    }

    // Cover page
    if (page.type === 'cover') {
      return (
        <div className="h-full p-12 bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-900 text-white relative overflow-hidden flex flex-col items-center justify-center">
          {/* Decorative elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-24 h-24 border-4 border-white rounded-full animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-20 h-20 border-4 border-white rotate-45"></div>
          </div>

          {ebook?.cover_image_url && (
            <div className="absolute inset-0 opacity-20">
              <img src={ebook.cover_image_url} alt="Cover" className="w-full h-full object-cover" />
            </div>
          )}

          <div className="relative z-10 text-center space-y-6">
            <BookOpen className="h-20 w-20 mx-auto mb-4 animate-pulse" />
            <h1 className="text-5xl font-bold leading-tight font-serif">
              {ebook?.title}
            </h1>
            {ebook?.subtitle && (
              <p className="text-xl text-white/90 italic font-serif">
                {ebook.subtitle}
              </p>
            )}
            <div className="pt-6 border-t-2 border-white/30 mt-6">
              <p className="text-lg text-white/80 font-serif">
                By {ebook?.author || 'Unknown Author'}
              </p>
            </div>
          </div>
        </div>
      )
    }

    // Chapter content page - FULL PAGE
    if (page.type === 'chapter-content') {
      const chapter = page.chapter
      const chapterText = page.content
      
      return (
        <div className="h-full bg-amber-50/95 overflow-y-auto p-8 user-select-text scrollbar-thin scrollbar-thumb-amber-400 scrollbar-track-amber-100"
          onMouseUp={() => handleTextSelection(chapter)}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4 font-serif border-b-2 border-purple-900 pb-2">
            {chapter.title}
          </h2>
          <div className="prose prose-base prose-amber max-w-none text-gray-800 font-serif chapter-text">
            <ReactMarkdown>{chapterText || '*No content yet*'}</ReactMarkdown>
          </div>
        </div>
      )
    }

    // Chapter image page - FULL PAGE
    if (page.type === 'chapter-image') {
      const chapter = page.chapter
      const chapterImage = page.image
      
      return (
        <div className="h-full bg-gray-900 flex flex-col items-center justify-center p-6">
          <img
            src={chapterImage}
            alt={chapter.title}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          />
          <p className="text-white/60 text-sm mt-4 font-serif italic">
            {chapter.title}
          </p>
        </div>
      )
    }

    // Fallback
    return (
      <div className="h-full bg-amber-50 flex items-center justify-center">
        <p className="text-gray-400 italic">Unknown page type</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-black">
      {/* Header - hide in fullscreen */}
      {!isFullscreen && (
        <div className="bg-black/50 backdrop-blur-sm border-b border-white/10">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-white/90" />
              <div>
                <h1 className="text-lg font-bold text-white">{ebook?.title}</h1>
                <p className="text-white/60 text-xs">
                  Spread {currentSpread + 1} of {totalSpreads}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={toggleFullscreen}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
              >
                <Maximize className="h-4 w-4 mr-2" />
                Fullscreen (F)
              </Button>
              
              {/* Export Dropdown */}
              <div className="relative group">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <div className="absolute right-0 top-full mt-1 bg-black/90 backdrop-blur-md rounded-lg shadow-xl border border-white/10 py-2 min-w-[160px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <a 
                    href={`/print/${ebookId}`}
                    target="_blank"
                    className="flex items-center gap-3 px-4 py-2 text-white/90 hover:bg-white/10 transition"
                  >
                    <Printer className="h-4 w-4" />
                    <span className="text-sm">Print/PDF</span>
                  </a>
                  <a 
                    href={`/api/export/epub/${ebookId}`}
                    download
                    className="flex items-center gap-3 px-4 py-2 text-white/90 hover:bg-white/10 transition"
                  >
                    <Book className="h-4 w-4" />
                    <span className="text-sm">EPUB</span>
                  </a>
                  <a 
                    href={`/api/export/docx/${ebookId}`}
                    download
                    className="flex items-center gap-3 px-4 py-2 text-white/90 hover:bg-white/10 transition"
                  >
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">DOCX</span>
                  </a>
                </div>
              </div>
              
              <Button
                onClick={() => router.push('/dashboard')}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
              >
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <Button
                onClick={() => router.push(`/editor/${ebookId}`)}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Book Container */}
      <div className="flex items-center justify-center px-4" style={{ height: isFullscreen ? '100vh' : 'calc(100vh - 60px)' }}>
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Previous Button - Left side */}
          <button
            onClick={prevSpread}
            disabled={!canGoPrev || isFlipping}
            className="absolute left-2 z-20 h-20 w-20 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-0 disabled:pointer-events-none text-white backdrop-blur-md transition-all duration-300 flex items-center justify-center border border-white/20 cursor-pointer"
            style={{ top: '50%', transform: 'translateY(-50%)' }}
          >
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Book Spread */}
          <div 
            className={`relative flex shadow-2xl transition-all duration-800 ease-in-out ${
              isFlipping ? 'scale-95' : 'scale-100'
            }`}
            style={{
              width: isFullscreen ? '92vw' : '85vw',
              height: isFullscreen ? '95vh' : '82vh',
              perspective: '2000px',
              transformStyle: 'preserve-3d'
            }}
          >
            {/* Book spine shadow */}
            <div className="absolute left-1/2 top-0 bottom-0 w-8 -ml-4 bg-gradient-to-r from-black/30 via-black/40 to-black/30 z-10 shadow-inner"></div>

            {/* Left Page */}
            <div 
              className={`w-1/2 h-full bg-amber-50 border-r-2 border-amber-200 shadow-xl transition-transform duration-800 ${
                isFlipping ? 'translate-x-4 rotate-y-5' : ''
              }`}
              style={{
                transformOrigin: 'right center',
                transformStyle: 'preserve-3d',
                boxShadow: 'inset -15px 0 30px rgba(0,0,0,0.1)'
              }}
            >
              {renderPage(leftPage, 'left')}
            </div>

            {/* Right Page */}
            <div 
              className={`w-1/2 h-full bg-amber-50 shadow-xl transition-transform duration-800 ${
                isFlipping ? '-translate-x-4 -rotate-y-5' : ''
              }`}
              style={{
                transformOrigin: 'left center',
                transformStyle: 'preserve-3d',
                boxShadow: 'inset 15px 0 30px rgba(0,0,0,0.1)'
              }}
            >
              {renderPage(rightPage, 'right')}
            </div>
          </div>

          {/* Next Button - Right side */}
          <button
            onClick={nextSpread}
            disabled={!canGoNext || isFlipping}
            className="absolute right-2 z-20 h-20 w-20 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-0 disabled:pointer-events-none text-white backdrop-blur-md transition-all duration-300 flex items-center justify-center border border-white/20 cursor-pointer"
            style={{ top: '50%', transform: 'translateY(-50%)' }}
          >
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Fullscreen hint */}
      {isFullscreen && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30 bg-black/70 backdrop-blur-md text-white px-6 py-3 rounded-full text-sm border border-white/20">
          Press F or ESC to exit fullscreen • Use ← → arrows to flip pages • Select text to edit with AI
        </div>
      )}

      {/* AI Edit Dialog */}
      {showEditDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl mx-4 overflow-hidden">
            {/* Header */}
            <div className="bg-purple-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={20} animateOnHover />
                <h3 className="font-bold text-lg">AI Content Editor</h3>
              </div>
              <button
                onClick={() => setShowEditDialog(false)}
                className="hover:bg-white/20 rounded p-1 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Selected Text */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Selected Text:
                </label>
                <div className="bg-amber-50 border border-amber-200 rounded p-3 text-sm text-gray-800 max-h-32 overflow-y-auto">
                  {selectedText}
                </div>
              </div>

              {/* Instruction Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  How should I improve this?
                </label>
                <Textarea
                  value={editInstruction}
                  onChange={(e) => setEditInstruction(e.target.value)}
                  placeholder="E.g., 'Make it more dramatic and emotional', 'Add more action and tension', 'Simplify the language', 'Make it darker and more atmospheric'..."
                  className="min-h-24 resize-none"
                  disabled={isEditing}
                />
              </div>

              {/* Quick Suggestions */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quick Suggestions:
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Make it more dramatic',
                    'Add more emotion',
                    'Increase tension',
                    'Simplify language',
                    'Make it darker',
                    'Add more details'
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setEditInstruction(suggestion)}
                      className="px-3 py-1 text-xs bg-purple-100 hover:bg-purple-200 text-purple-900 rounded-full transition"
                      disabled={isEditing}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  onClick={() => setShowEditDialog(false)}
                  variant="outline"
                  disabled={isEditing}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleImproveContent}
                  disabled={!editInstruction.trim() || isEditing}
                  className="bg-purple-900 hover:bg-purple-800"
                >
                  <Sparkles size={16} animateOnHover className="mr-2" />
                  {isEditing ? 'Improving...' : 'Improve Content'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        /* Enable text selection */
        .user-select-text {
          user-select: text;
          -webkit-user-select: text;
          -moz-user-select: text;
          -ms-user-select: text;
        }
        
        /* Chapter text styling */
        .chapter-text p {
          margin-bottom: 1em;
          text-align: justify;
          text-indent: 1.2em;
          line-height: 1.6;
          font-size: 0.85rem;
        }
        .chapter-text p:first-of-type::first-letter {
          font-size: 2.5em;
          font-weight: bold;
          float: left;
          line-height: 1;
          margin-right: 0.08em;
          margin-top: 0.02em;
          color: #581c87;
        }
        
        /* 3D rotation utilities */
        .rotate-y-5 {
          transform: rotateY(5deg);
        }
        .-rotate-y-5 {
          transform: rotateY(-5deg);
        }

        /* Smooth scrollbar */
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thumb-amber-400::-webkit-scrollbar-thumb {
          background-color: #fbbf24;
          border-radius: 3px;
        }
        .scrollbar-track-amber-100::-webkit-scrollbar-track {
          background-color: #fef3c7;
        }

        /* Cursor pointer for flip areas */
        .cursor-pointer {
          cursor: pointer;
        }

        /* Hide scrollbar in fullscreen mode for cleaner look */
        :fullscreen .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
      `}</style>
    </div>
  )
}
