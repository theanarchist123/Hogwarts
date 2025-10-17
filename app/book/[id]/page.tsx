'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Ebook } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import { Save, Upload, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function BookDetailsPage() {
  const { user } = useUser()
  const params = useParams()
  const router = useRouter()
  const ebookId = params.id as string

  const [ebook, setEbook] = useState<Ebook | null>(null)
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [author, setAuthor] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

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
      setTitle(data.title || '')
      setSubtitle(data.subtitle || '')
      setAuthor(data.author || '')
    } catch (error) {
      console.error('Error loading ebook:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!ebook) return
    setSaving(true)
    try {
      const response = await fetch(`/api/ebooks/${ebookId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, subtitle, author }),
      })
      if (!response.ok) throw new Error('Failed to save ebook')
      alert('Book details saved successfully!')
    } catch (error) {
      console.error('Error saving ebook:', error)
      alert('Failed to save book details')
    } finally {
      setSaving(false)
    }
  }

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      // For now, we'll handle file upload client-side
      // You can later create a dedicated API route for file uploads
      const formData = new FormData()
      formData.append('file', file)
      formData.append('ebookId', ebookId)
      
      // TODO: Create /api/upload-cover route
      alert('Cover upload feature needs API route implementation')
      // const response = await fetch('/api/upload-cover', {
      //   method: 'POST',
      //   body: formData,
      // })
      // if (!response.ok) throw new Error('Failed to upload cover')
      // await loadEbook()
      // alert('Cover image uploaded successfully!')
    } catch (error) {
      console.error('Error uploading cover:', error)
      alert('Failed to upload cover image')
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D]">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <p className="text-muted-foreground">Loading book details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href={`/editor/${ebookId}`}>
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Editor
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Book Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Cover Image */}
            <div>
              <Label>Cover Image</Label>
              <div className="mt-2 flex items-start gap-6">
                <div className="w-48 h-64 bg-secondary rounded-lg flex items-center justify-center overflow-hidden">
                  {ebook?.cover_image_url ? (
                    <img
                      src={ebook.cover_image_url}
                      alt="Cover"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-muted-foreground">No cover</span>
                  )}
                </div>
                <div className="flex-1">
                  <Label htmlFor="cover-upload" className="cursor-pointer">
                    <div className="border-2 border-dashed border-border rounded-lg p-6 hover:border-primary transition-colors">
                      <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-center text-muted-foreground">
                        {uploading ? 'Uploading...' : 'Click to upload cover image'}
                      </p>
                      <p className="text-xs text-center text-muted-foreground mt-1">
                        PNG, JPG up to 5MB
                      </p>
                    </div>
                    <Input
                      id="cover-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleCoverUpload}
                      disabled={uploading}
                    />
                  </Label>
                </div>
              </div>
            </div>

            {/* Title */}
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter book title"
                className="mt-2"
              />
            </div>

            {/* Subtitle */}
            <div>
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Enter book subtitle (optional)"
                className="mt-2"
              />
            </div>

            {/* Author */}
            <div>
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Enter author name"
                className="mt-2"
              />
            </div>

            {/* Save Button */}
            <div className="flex justify-end gap-2 pt-4">
              <Link href={`/editor/${ebookId}`}>
                <Button variant="outline">Cancel</Button>
              </Link>
              <Button onClick={handleSave} disabled={saving || !title}>
                <Save className="mr-2 h-4 w-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
