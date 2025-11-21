import { supabaseServer } from './supabase-server'

// Database types
export type Ebook = {
  id: string
  user_id: string
  title: string
  subtitle?: string
  author?: string
  cover_image_url?: string
  chapters: Chapter[]
  created_at: string
  updated_at: string
}

export type Chapter = {
  id: string
  ebook_id: string
  title: string
  content: string
  order: number
  created_at: string
  updated_at: string
}

// Database operations (server-side only)
export const ebookService = {
  async getEbooksByUserId(userId: string) {
    const { data, error } = await supabaseServer
      .from('ebooks')
      .select('*, chapters(*)')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
    
    if (error) throw error
    return data as Ebook[]
  },

  async getEbookById(id: string) {
    const { data, error } = await supabaseServer
      .from('ebooks')
      .select('*, chapters(*)')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as Ebook
  },

  async createEbook(userId: string, title: string) {
    const { data, error } = await supabaseServer
      .from('ebooks')
      .insert({
        user_id: userId,
        title,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateEbook(id: string, updates: Partial<Ebook>) {
    const { data, error } = await supabaseServer
      .from('ebooks')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async deleteEbook(id: string) {
    const { error } = await supabaseServer
      .from('ebooks')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  async uploadCoverImage(file: File, ebookId: string) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${ebookId}-${Math.random()}.${fileExt}`
    const filePath = `covers/${fileName}`

    const { error: uploadError } = await supabaseServer.storage
      .from('ebook-covers')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    const { data } = supabaseServer.storage
      .from('ebook-covers')
      .getPublicUrl(filePath)

    return data.publicUrl
  },
}

export const chapterService = {
  async getChaptersByEbookId(ebookId: string) {
    const { data, error } = await supabaseServer
      .from('chapters')
      .select('*')
      .eq('ebook_id', ebookId)
      .order('order', { ascending: true })
    
    if (error) throw error
    return data as Chapter[]
  },

  async getChapterById(id: string) {
    const { data, error } = await supabaseServer
      .from('chapters')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as Chapter
  },

  async createChapter(ebookId: string, title: string, content: string, order: number) {
    const { data, error } = await supabaseServer
      .from('chapters')
      .insert({
        ebook_id: ebookId,
        title,
        content,
        order,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateChapter(id: string, updates: Partial<Chapter>) {
    const { data, error } = await supabaseServer
      .from('chapters')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async deleteChapter(id: string) {
    const { error } = await supabaseServer
      .from('chapters')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  async reorderChapters(chapters: { id: string; order: number }[]) {
    const updates = chapters.map(({ id, order }) =>
      supabaseServer
        .from('chapters')
        .update({ order })
        .eq('id', id)
    )

    await Promise.all(updates)
  },
}
