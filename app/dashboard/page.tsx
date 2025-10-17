'use client'

import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, BookOpen, Edit, Trash2, Sparkles } from 'lucide-react'
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
    <div className="min-h-screen bg-[#0D0D0D]">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Ebooks</h1>
            <p className="text-muted-foreground mt-2">
              Create and manage your AI-powered ebooks
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/generate">
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                <Sparkles className="mr-2 h-5 w-5" />
                Generate Story with AI
              </Button>
            </Link>
            <Button onClick={handleCreateEbook} size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Create Blank Ebook
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading your ebooks...</p>
          </div>
        ) : ebooks.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border rounded-lg">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No ebooks yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first ebook to get started
            </p>
            <Button onClick={handleCreateEbook}>
              <Plus className="mr-2 h-5 w-5" />
              Create Your First Ebook
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ebooks.map(ebook => (
              <Card key={ebook.id} className="overflow-hidden hover:border-primary/50 transition-colors">
                <div className="aspect-[3/4] bg-secondary flex items-center justify-center">
                  {ebook.cover_image_url ? (
                    <img
                      src={ebook.cover_image_url}
                      alt={ebook.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <BookOpen className="h-16 w-16 text-muted-foreground" />
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg truncate">{ebook.title}</h3>
                  {ebook.subtitle && (
                    <p className="text-sm text-muted-foreground truncate mt-1">
                      {ebook.subtitle}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    {ebook.chapters?.length || 0} chapters
                  </p>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex gap-2">
                  <Link href={`/read/${ebook.id}`} className="flex-1">
                    <Button variant="default" className="w-full bg-purple-600 hover:bg-purple-700">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Read
                    </Button>
                  </Link>
                  <Link href={`/editor/${ebook.id}`}>
                    <Button variant="outline" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="icon"
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
