'use client'

import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, BookOpen, Edit, Trash2, Sparkles, Download, FileText, Book, Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import type { Ebook } from '@/lib/supabase'
import Navbar from '@/components/Navbar'

export default function DashboardPage() {
  const { user } = useUser()
  const [ebooks, setEbooks] = useState<Ebook[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadEbooks()
    }
  }, [user])

  const loadEbooks = async () => {
    if (!user) return
    try {
      const response = await fetch('/api/ebooks')
      if (!response.ok) throw new Error('Failed to load ebooks')
      const data = await response.json()
      setEbooks(data)
    } catch (error) {
      console.error('Error loading ebooks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateEbook = async () => {
    if (!user) return
    try {
      const response = await fetch('/api/ebooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Untitled Ebook' }),
      })
      if (!response.ok) throw new Error('Failed to create ebook')
      const newEbook = await response.json()
      window.location.href = `/editor/${newEbook.id}`
    } catch (error) {
      console.error('Error creating ebook:', error)
    }
  }

  const handleDeleteEbook = async (id: string) => {
    if (!confirm('Are you sure you want to delete this ebook?')) return
    try {
      const response = await fetch(`/api/ebooks/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete ebook')
      setEbooks(ebooks.filter(e => e.id !== id))
    } catch (error) {
      console.error('Error deleting ebook:', error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">My Ebooks</h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Create and manage your AI-powered storybooks
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/generate">
              <Button size="lg" className="shadow-sm">
                <Sparkles className="mr-2 h-5 w-5" />
                Generate Story with AI
              </Button>
            </Link>
            <Button onClick={handleCreateEbook} size="lg" variant="outline" className="shadow-sm">
              <Plus className="mr-2 h-5 w-5" />
              Create Blank Ebook
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              <p className="text-muted-foreground">Loading your ebooks...</p>
            </div>
          </div>
        ) : ebooks.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-xl bg-muted/30">
            <BookOpen className="h-20 w-20 text-muted-foreground mx-auto mb-6 opacity-50" />
            <h3 className="text-2xl font-semibold mb-3">No ebooks yet</h3>
            <p className="text-muted-foreground mb-8 text-lg">
              Create your first AI-powered storybook to get started
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/generate">
                <Button size="lg">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate with AI
                </Button>
              </Link>
              <Button onClick={handleCreateEbook} size="lg" variant="outline">
                <Plus className="mr-2 h-5 w-5" />
                Create Blank Ebook
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {ebooks.map(ebook => (
              <Card key={ebook.id} className="overflow-hidden hover:border-primary/50 transition-all duration-200 hover:shadow-lg">
                <div className="aspect-[3/4] bg-muted flex items-center justify-center border-b">
                  {ebook.cover_image_url ? (
                    <img
                      src={ebook.cover_image_url}
                      alt={ebook.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <BookOpen className="h-20 w-20 text-muted-foreground opacity-30" />
                  )}
                </div>
                <CardContent className="p-5">
                  <h3 className="font-semibold text-lg truncate mb-1">{ebook.title}</h3>
                  {ebook.subtitle && (
                    <p className="text-sm text-muted-foreground truncate mb-3">
                      {ebook.subtitle}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>{ebook.chapters?.length || 0} chapters</span>
                  </div>
                  
                  {/* Export Buttons */}
                  <div className="flex gap-1 mb-2">
                    <a 
                      href={`/print/${ebook.id}`}
                      target="_blank"
                      className="flex-1"
                      title="Print/Save as PDF"
                    >
                      <Button variant="ghost" size="sm" className="w-full text-xs h-8">
                        <Printer className="mr-1.5 h-3.5 w-3.5" />
                        PDF
                      </Button>
                    </a>
                    <a 
                      href={`/api/export/epub/${ebook.id}`}
                      download
                      className="flex-1"
                      title="Download EPUB"
                    >
                      <Button variant="ghost" size="sm" className="w-full text-xs h-8">
                        <Book className="mr-1.5 h-3.5 w-3.5" />
                        EPUB
                      </Button>
                    </a>
                    <a 
                      href={`/api/export/docx/${ebook.id}`}
                      download
                      className="flex-1"
                      title="Download DOCX"
                    >
                      <Button variant="ghost" size="sm" className="w-full text-xs h-8">
                        <FileText className="mr-1.5 h-3.5 w-3.5" />
                        DOCX
                      </Button>
                    </a>
                  </div>
                </CardContent>
                <CardFooter className="p-5 pt-0 flex gap-2">
                  <Link href={`/read/${ebook.id}`} className="flex-1">
                    <Button variant="default" className="w-full shadow-sm">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Read
                    </Button>
                  </Link>
                  <Link href={`/editor/${ebook.id}`}>
                    <Button variant="outline" size="icon" className="shadow-sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="icon"
                    className="shadow-sm hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
                    onClick={() => handleDeleteEbook(ebook.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
