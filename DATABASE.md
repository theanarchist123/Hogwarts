# Database Schema Documentation

## Overview

The AI Ebook Creator uses Supabase (PostgreSQL) as its database. This document explains the database structure, relationships, and security policies.

## 📊 Database Tables

### `ebooks` Table

Stores ebook metadata and information.

**Schema:**
```sql
CREATE TABLE ebooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  author TEXT,
  cover_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

**Columns:**
- `id` - Unique identifier (UUID, auto-generated)
- `user_id` - Clerk user ID (links to authenticated user)
- `title` - Ebook title (required)
- `subtitle` - Optional subtitle
- `author` - Author name (optional)
- `cover_image_url` - URL to cover image in Supabase Storage
- `created_at` - Timestamp of creation
- `updated_at` - Timestamp of last update

**Indexes:**
- `idx_ebooks_user_id` on `user_id` - Fast lookup of user's ebooks

### `chapters` Table

Stores chapter content for each ebook.

**Schema:**
```sql
CREATE TABLE chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ebook_id UUID NOT NULL REFERENCES ebooks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT DEFAULT '',
  "order" INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

**Columns:**
- `id` - Unique identifier (UUID, auto-generated)
- `ebook_id` - Foreign key to `ebooks` table
- `title` - Chapter title (required)
- `content` - Chapter content in Markdown format
- `order` - Chapter order/sequence number
- `created_at` - Timestamp of creation
- `updated_at` - Timestamp of last update

**Indexes:**
- `idx_chapters_ebook_id` on `ebook_id` - Fast lookup of ebook's chapters
- `idx_chapters_order` on `order` - Efficient chapter ordering

**Foreign Keys:**
- `ebook_id` references `ebooks(id)`
- `ON DELETE CASCADE` - When ebook is deleted, all chapters are deleted

## 🔐 Row Level Security (RLS)

All tables have Row Level Security enabled for data protection.

### Ebooks Policies

**SELECT Policy:**
```sql
CREATE POLICY "Users can view their own ebooks"
  ON ebooks FOR SELECT
  USING (auth.uid()::text = user_id);
```
Users can only view their own ebooks.

**INSERT Policy:**
```sql
CREATE POLICY "Users can insert their own ebooks"
  ON ebooks FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);
```
Users can only create ebooks for themselves.

**UPDATE Policy:**
```sql
CREATE POLICY "Users can update their own ebooks"
  ON ebooks FOR UPDATE
  USING (auth.uid()::text = user_id);
```
Users can only update their own ebooks.

**DELETE Policy:**
```sql
CREATE POLICY "Users can delete their own ebooks"
  ON ebooks FOR DELETE
  USING (auth.uid()::text = user_id);
```
Users can only delete their own ebooks.

### Chapters Policies

**SELECT Policy:**
```sql
CREATE POLICY "Users can view chapters of their ebooks"
  ON chapters FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM ebooks
      WHERE ebooks.id = chapters.ebook_id
      AND ebooks.user_id = auth.uid()::text
    )
  );
```
Users can only view chapters of their own ebooks.

**INSERT Policy:**
```sql
CREATE POLICY "Users can insert chapters to their ebooks"
  ON chapters FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM ebooks
      WHERE ebooks.id = chapters.ebook_id
      AND ebooks.user_id = auth.uid()::text
    )
  );
```
Users can only create chapters for their own ebooks.

**UPDATE Policy:**
```sql
CREATE POLICY "Users can update chapters of their ebooks"
  ON chapters FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM ebooks
      WHERE ebooks.id = chapters.ebook_id
      AND ebooks.user_id = auth.uid()::text
    )
  );
```
Users can only update chapters of their own ebooks.

**DELETE Policy:**
```sql
CREATE POLICY "Users can delete chapters of their ebooks"
  ON chapters FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM ebooks
      WHERE ebooks.id = chapters.ebook_id
      AND ebooks.user_id = auth.uid()::text
    )
  );
```
Users can only delete chapters of their own ebooks.

## 💾 Storage Buckets

### `ebook-covers` Bucket

Stores cover images for ebooks.

**Configuration:**
- **Public:** Yes (images are publicly accessible via URL)
- **File Size Limit:** 5MB (recommended)
- **Allowed Types:** Images (PNG, JPG, JPEG, WebP)

**Storage Policies:**

**SELECT Policy:**
```sql
CREATE POLICY "Anyone can view cover images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'ebook-covers');
```
All cover images are publicly viewable.

**INSERT Policy:**
```sql
CREATE POLICY "Users can upload cover images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'ebook-covers' AND auth.role() = 'authenticated');
```
Only authenticated users can upload images.

**UPDATE Policy:**
```sql
CREATE POLICY "Users can update their own cover images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'ebook-covers' AND auth.role() = 'authenticated');
```
Authenticated users can update images.

**DELETE Policy:**
```sql
CREATE POLICY "Users can delete their own cover images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'ebook-covers' AND auth.role() = 'authenticated');
```
Authenticated users can delete images.

## 🔄 Relationships

```
ebooks (1) ─────< (many) chapters
  │
  │ user_id
  │
  └──> Clerk Users (external)

ebooks (1) ─────< (1) ebook-covers (Storage)
```

**One-to-Many:**
- One ebook can have many chapters
- Chapters belong to one ebook

**External Relationship:**
- Ebooks linked to Clerk users via `user_id`

## 📝 Common Queries

### Get all ebooks for a user
```typescript
const { data, error } = await supabase
  .from('ebooks')
  .select('*, chapters(*)')
  .eq('user_id', userId)
  .order('updated_at', { ascending: false })
```

### Get single ebook with chapters
```typescript
const { data, error } = await supabase
  .from('ebooks')
  .select('*, chapters(*)')
  .eq('id', ebookId)
  .single()
```

### Create new ebook
```typescript
const { data, error } = await supabase
  .from('ebooks')
  .insert({
    user_id: userId,
    title: 'My New Ebook',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })
  .select()
  .single()
```

### Update ebook
```typescript
const { data, error } = await supabase
  .from('ebooks')
  .update({
    title: 'Updated Title',
    subtitle: 'New Subtitle',
    updated_at: new Date().toISOString(),
  })
  .eq('id', ebookId)
  .select()
  .single()
```

### Create chapter
```typescript
const { data, error } = await supabase
  .from('chapters')
  .insert({
    ebook_id: ebookId,
    title: 'Chapter 1',
    content: 'Chapter content...',
    order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })
  .select()
  .single()
```

### Update chapter
```typescript
const { data, error } = await supabase
  .from('chapters')
  .update({
    title: 'Updated Chapter Title',
    content: 'Updated content...',
    updated_at: new Date().toISOString(),
  })
  .eq('id', chapterId)
  .select()
  .single()
```

### Reorder chapters
```typescript
const updates = chapters.map(({ id, order }) =>
  supabase
    .from('chapters')
    .update({ order })
    .eq('id', id)
)

await Promise.all(updates)
```

### Upload cover image
```typescript
const fileExt = file.name.split('.').pop()
const fileName = `${ebookId}-${Math.random()}.${fileExt}`
const filePath = `covers/${fileName}`

const { error: uploadError } = await supabase.storage
  .from('ebook-covers')
  .upload(filePath, file)

const { data } = supabase.storage
  .from('ebook-covers')
  .getPublicUrl(filePath)

const coverUrl = data.publicUrl
```

### Delete ebook (cascades to chapters)
```typescript
const { error } = await supabase
  .from('ebooks')
  .delete()
  .eq('id', ebookId)
```

## 🛠️ Database Maintenance

### Backup Strategy

Supabase provides automatic daily backups. For manual backups:

1. Go to Supabase Dashboard
2. Navigate to Database → Backups
3. Click "Create Backup"

### Performance Optimization

**Indexes:**
All necessary indexes are created by the schema:
- `user_id` index for fast user queries
- `ebook_id` index for chapter lookups
- `order` index for chapter sorting

**Optimization Tips:**
1. Use `select('*')` only when needed
2. Specify columns: `select('id, title')`
3. Use pagination for large datasets
4. Cache frequent queries

### Monitoring

Monitor database performance:

1. **Query Performance:**
   - Supabase Dashboard → Database → Query Performance

2. **Storage Usage:**
   - Supabase Dashboard → Storage → Usage

3. **Row Counts:**
```sql
SELECT 
  (SELECT COUNT(*) FROM ebooks) as total_ebooks,
  (SELECT COUNT(*) FROM chapters) as total_chapters;
```

## 🔧 Migrations

### Adding New Columns

To add columns to existing tables:

```sql
-- Add genre column to ebooks
ALTER TABLE ebooks ADD COLUMN genre TEXT;

-- Add word_count to chapters
ALTER TABLE chapters ADD COLUMN word_count INTEGER DEFAULT 0;
```

### Adding New Tables

To add related tables:

```sql
-- Add tags table
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE
);

-- Add ebook_tags junction table
CREATE TABLE ebook_tags (
  ebook_id UUID REFERENCES ebooks(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (ebook_id, tag_id)
);
```

## 🐛 Troubleshooting

### Common Issues

**Issue: RLS prevents data access**
- Verify user is authenticated
- Check Clerk user ID matches `user_id` in database
- Review RLS policies in Supabase Dashboard

**Issue: Foreign key constraint violations**
- Ensure referenced ebook exists before creating chapter
- Use cascade delete to prevent orphaned records

**Issue: Storage upload fails**
- Check file size (max 5MB)
- Verify file type is allowed
- Ensure user is authenticated

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Documentation](https://supabase.com/docs/guides/storage)

---

**For implementation details, see `lib/supabase.ts`**
