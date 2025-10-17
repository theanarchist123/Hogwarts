'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import type { Ebook, Chapter } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import { 
  Save, 
  Sparkles, 
  FileText, 
  Image as ImageIcon,
  Plus,
  Trash2,
  GripVertical
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'

export default function EditorPage() {
  const { user } = useUser()
  const params = useParams()
  const router = useRouter()
  const ebookId = params.id as string

  const [ebook, setEbook] = useState<Ebook | null>(null)
  const [activeChapter, setActiveChapter] = useState<Chapter | null>(null)
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

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
      if (data.chapters && data.chapters.length > 0) {
        const firstChapter = data.chapters[0]
        setActiveChapter(firstChapter)
        setContent(firstChapter.content)
        setTitle(firstChapter.title)
      }
    } catch (error) {
      console.error('Error loading ebook:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!activeChapter) return
    setSaving(true)
    try {
      const response = await fetch(`/api/chapters/${activeChapter.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      })
      if (!response.ok) throw new Error('Failed to save chapter')
      // Reload to get updated data
      await loadEbook()
    } catch (error) {
      console.error('Error saving chapter:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleAddChapter = async () => {
    if (!ebook) return
    try {
      const response = await fetch('/api/chapters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ebookId,
          title: 'New Chapter',
          content: '',
          order: (ebook.chapters?.length || 0) + 1
        }),
      })
      if (!response.ok) throw new Error('Failed to create chapter')
      const newChapter = await response.json()
      await loadEbook()
      setActiveChapter(newChapter)
      setTitle(newChapter.title)
      setContent(newChapter.content)
    } catch (error) {
      console.error('Error creating chapter:', error)
    }
  }

  const handleDeleteChapter = async (chapterId: string) => {
    if (!confirm('Delete this chapter?')) return
    try {
      const response = await fetch(`/api/chapters/${chapterId}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete chapter')
      await loadEbook()
      setActiveChapter(null)
      setContent('')
      setTitle('')
    } catch (error) {
      console.error('Error deleting chapter:', error)
    }
  }

  const selectChapter = (chapter: Chapter) => {
    setActiveChapter(chapter)
    setTitle(chapter.title)
    setContent(chapter.content)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D]">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <p className="text-muted-foreground">Loading editor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <Navbar />
      
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar - Chapter List */}
        <aside className="w-64 border-r border-border/40 bg-secondary/30 overflow-y-auto">
          <div className="p-4 space-y-4">
            <div>
              <h2 className="font-semibold mb-2">{ebook?.title}</h2>
              <Button onClick={handleAddChapter} size="sm" variant="outline" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Chapter
              </Button>
            </div>

            <div className="space-y-2">
              {ebook?.chapters?.map((chapter) => (
                <div
                  key={chapter.id}
                  className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-accent/50 transition-colors ${
                    activeChapter?.id === chapter.id ? 'bg-accent' : ''
                  }`}
                  onClick={() => selectChapter(chapter)}
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <span className="flex-1 truncate text-sm">{chapter.title}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteChapter(chapter.id)
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Editor */}
        <main className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="border-b border-border/40 p-4 flex items-center gap-2 bg-secondary/20">
            <Button onClick={handleSave} disabled={saving || !activeChapter}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? 'Saving...' : 'Save'}
            </Button>
            <Button 
              onClick={() => router.push(`/read/${ebookId}`)}
              variant="default"
              className="bg-purple-600 hover:bg-purple-700"
            >
              <FileText className="mr-2 h-4 w-4" />
              Read Book
            </Button>
            <div className="h-6 w-px bg-border/40 mx-2" />
            <Button variant="outline" disabled>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Outline
            </Button>
            <Button variant="outline" disabled>
              <FileText className="mr-2 h-4 w-4" />
              Write Chapter
            </Button>
            <Button variant="outline" disabled>
              <ImageIcon className="mr-2 h-4 w-4" />
              Generate Image
            </Button>
          </div>

          {/* Content Area */}
          {activeChapter ? (
            <div className="flex-1 grid md:grid-cols-2">
              {/* Editor */}
              <div className="p-6 overflow-y-auto">
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Chapter Title"
                  className="mb-4 text-lg font-semibold"
                />
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Start writing your chapter..."
                  className="min-h-[calc(100vh-16rem)] font-mono"
                />
              </div>

              {/* Preview */}
              <div className="p-6 overflow-y-auto border-l border-border/40 bg-secondary/10">
                <h2 className="text-2xl font-bold mb-4">{title || 'Untitled'}</h2>
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown>{content || '*Preview will appear here*'}</ReactMarkdown>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Select or create a chapter to start editing</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
