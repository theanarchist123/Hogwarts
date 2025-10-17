-- Create ebooks table
CREATE TABLE IF NOT EXISTS ebooks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  author TEXT,
  cover_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create chapters table
CREATE TABLE IF NOT EXISTS chapters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ebook_id UUID NOT NULL REFERENCES ebooks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT DEFAULT '',
  "order" INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_ebooks_user_id ON ebooks(user_id);
CREATE INDEX IF NOT EXISTS idx_chapters_ebook_id ON chapters(ebook_id);
CREATE INDEX IF NOT EXISTS idx_chapters_order ON chapters("order");

-- Enable Row Level Security
ALTER TABLE ebooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;

-- Create policies for ebooks
CREATE POLICY "Users can view their own ebooks"
  ON ebooks FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own ebooks"
  ON ebooks FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own ebooks"
  ON ebooks FOR UPDATE
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own ebooks"
  ON ebooks FOR DELETE
  USING (auth.uid()::text = user_id);

-- Create policies for chapters
CREATE POLICY "Users can view chapters of their ebooks"
  ON chapters FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM ebooks
      WHERE ebooks.id = chapters.ebook_id
      AND ebooks.user_id = auth.uid()::text
    )
  );

CREATE POLICY "Users can insert chapters to their ebooks"
  ON chapters FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM ebooks
      WHERE ebooks.id = chapters.ebook_id
      AND ebooks.user_id = auth.uid()::text
    )
  );

CREATE POLICY "Users can update chapters of their ebooks"
  ON chapters FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM ebooks
      WHERE ebooks.id = chapters.ebook_id
      AND ebooks.user_id = auth.uid()::text
    )
  );

CREATE POLICY "Users can delete chapters of their ebooks"
  ON chapters FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM ebooks
      WHERE ebooks.id = chapters.ebook_id
      AND ebooks.user_id = auth.uid()::text
    )
  );

-- Create storage bucket for cover images
INSERT INTO storage.buckets (id, name, public)
VALUES ('ebook-covers', 'ebook-covers', true)
ON CONFLICT DO NOTHING;

-- Create storage policies
CREATE POLICY "Anyone can view cover images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'ebook-covers');

CREATE POLICY "Users can upload cover images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'ebook-covers' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own cover images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'ebook-covers' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own cover images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'ebook-covers' AND auth.role() = 'authenticated');
