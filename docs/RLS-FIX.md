# RLS & Supabase Client Fix - Hogwarts

## Problems Fixed

### Problem 1: RLS 401 Unauthorized Error
```
POST https://rxntsdckjkxfmefpkgrr.supabase.co/rest/v1/ebooks 401 (Unauthorized)
Error: new row violates row-level security policy for table "ebooks"
```

### Problem 2: Supabase Service Key Error
```
Uncaught Error: supabaseKey is required.
    at eval (supabase.ts:7:37)
```

## Root Causes
The issue occurred because:
1. **Supabase RLS policies** were configured to use Supabase's built-in authentication (`auth.uid()`)
2. **We're using Clerk** for authentication instead of Supabase Auth
3. The client-side Supabase client had no way to authenticate users

**Problem 1 Root Cause:**
- Supabase RLS policies were configured for Supabase Auth (`auth.uid()`)
- We're using Clerk for authentication instead
- Client-side Supabase client had no way to authenticate

**Problem 2 Root Cause:**
- `SUPABASE_SERVICE_ROLE_KEY` is a **server-only** environment variable
- Client-side pages were importing `lib/supabase.ts` which tried to access it
- Browser doesn't have access to server-only environment variables

## Solutions

### 1. Separated Server and Client Supabase Code
Created `lib/supabase-server.ts`:
```typescript
// Server-only - uses service role key
export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey)
```

Updated `lib/supabase.ts`:
- Only exports **types** and **services** (for API routes)
- No longer creates a client that can be imported client-side
- All services use `supabaseServer` internally

### 2. Server-Side Authentication via API Routes
Created **API routes** that handle authentication using Clerk:
- `GET /api/ebooks` - Fetch user's ebooks
- `POST /api/ebooks` - Create new ebook
- `GET /api/ebooks/[id]` - Get specific ebook
- `PATCH /api/ebooks/[id]` - Update ebook
- `DELETE /api/ebooks/[id]` - Delete ebook
- `POST /api/chapters` - Create chapter
- `PATCH /api/chapters/[id]` - Update chapter
- `DELETE /api/chapters/[id]` - Delete chapter

### 3. Client-Side Updates
Updated **all client pages** to use API routes instead of direct Supabase:

**app/dashboard/page.tsx:**
- ❌ `import { ebookService } from '@/lib/supabase'`
- ✅ `import type { Ebook } from '@/lib/supabase'`
- `loadEbooks()` → `fetch('/api/ebooks')`
- `handleCreateEbook()` → `fetch('/api/ebooks', { method: 'POST' })`
- `handleDeleteEbook()` → `fetch('/api/ebooks/${id}', { method: 'DELETE' })`

**app/editor/[id]/page.tsx:**
- ❌ `import { ebookService, chapterService } from '@/lib/supabase'`
- ✅ `import type { Ebook, Chapter } from '@/lib/supabase'`
- `loadEbook()` → `fetch('/api/ebooks/${id}')`
- `handleSave()` → `fetch('/api/chapters/${id}', { method: 'PATCH' })`
- `handleAddChapter()` → `fetch('/api/chapters', { method: 'POST' })`
- `handleDeleteChapter()` → `fetch('/api/chapters/${id}', { method: 'DELETE' })`

**app/book/[id]/page.tsx:**
- ❌ `import { ebookService } from '@/lib/supabase'`
- ✅ `import type { Ebook } from '@/lib/supabase'`
- `loadEbook()` → `fetch('/api/ebooks/${id}')`
- `handleSave()` → `fetch('/api/ebooks/${id}', { method: 'PATCH' })`

### 4. Security
Each API route:
1. ✅ Verifies the user is authenticated with Clerk (`await auth()`)
2. ✅ Checks ownership before allowing operations (`ebook.user_id === userId`)
3. ✅ Returns proper HTTP status codes (401, 403, 500)
4. ✅ Only runs server-side (never in browser)

## Architecture Flow

### Before (Broken - Multiple Issues)
```
❌ Problem 1: RLS Authentication
Client → Supabase Client (with anon key) → Supabase RLS → ❌ Rejected (no auth.uid())

❌ Problem 2: Environment Variables
Client (Browser) → import lib/supabase.ts → ❌ Error (SUPABASE_SERVICE_ROLE_KEY undefined)
```

### After (Fixed)
```
✅ Proper Architecture
Client → API Route (Server) → Clerk Auth ✓ → Supabase (service role) → ✓ Success
         │
         └─→ Server-only environment variables ✓ accessible
```

## What About RLS?
The RLS policies are still in place but not actively used because:
- We use the **service role key** which bypasses RLS
- **Authentication is handled by Clerk** on the API route level
- **Authorization is manual** - we check `ebook.user_id === userId` in code

This is the **recommended approach** when using third-party auth (Clerk, Auth0, etc.) with Supabase.

## Key Takeaways

### ✅ DO:
- Use **server-only** Supabase client with service role key in API routes
- Import only **types** from `lib/supabase.ts` in client components
- Call API routes from client components (fetch)
- Keep service role key in `.env.local` (server-only)

### ❌ DON'T:
- Import `ebookService` or `chapterService` in client components
- Use `SUPABASE_SERVICE_ROLE_KEY` in client-side code
- Call Supabase directly from browser (use API routes instead)
- Mix server-only and client code in same file

## File Structure
```
lib/
  ├── supabase-server.ts    ← Server-only Supabase client (service role key)
  └── supabase.ts            ← Types + Services (uses supabase-server internally)

app/api/                     ← Server-side API routes
  ├── ebooks/
  │   ├── route.ts          ← GET (list), POST (create)
  │   └── [id]/route.ts     ← GET, PATCH, DELETE (single ebook)
  └── chapters/
      ├── route.ts          ← POST (create)
      └── [id]/route.ts     ← PATCH, DELETE (single chapter)

app/                         ← Client components
  ├── dashboard/page.tsx    ← Uses fetch('/api/ebooks')
  ├── editor/[id]/page.tsx  ← Uses fetch('/api/ebooks/[id]'), fetch('/api/chapters')
  └── book/[id]/page.tsx    ← Uses fetch('/api/ebooks/[id]')
```

## Testing Checklist
- ✅ No console errors about `supabaseKey is required`
- ✅ No 401 Unauthorized errors when creating ebooks
- ✅ Dashboard loads ebooks correctly
- ✅ Can create new ebooks
- ✅ Can edit ebook details
- ✅ Can create/edit/delete chapters
- ✅ Authentication works with Clerk

---
**Fixed:** October 17, 2025
**Issues Resolved:** RLS authentication + Server-only environment variables
