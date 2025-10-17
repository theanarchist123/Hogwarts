# Component Library Documentation

## Overview

This document describes all reusable components in the AI Ebook Creator application.

## 🧩 UI Components (`components/ui/`)

All UI components are built with Radix UI primitives and styled with Tailwind CSS following the shadcn/ui design system.

### Button

A versatile button component with multiple variants and sizes.

**Import:**
```typescript
import { Button } from '@/components/ui/button'
```

**Usage:**
```tsx
<Button>Default Button</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Icon /></Button>
```

**Props:**
- `variant`: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
- `size`: "default" | "sm" | "lg" | "icon"
- `asChild`: boolean (render as child component)
- All standard button HTML attributes

**Examples:**
```tsx
// Primary action
<Button onClick={handleSave}>Save Changes</Button>

// Secondary action
<Button variant="outline" onClick={handleCancel}>Cancel</Button>

// Destructive action
<Button variant="destructive" onClick={handleDelete}>
  <Trash2 className="mr-2 h-4 w-4" />
  Delete
</Button>

// Icon only
<Button size="icon" variant="ghost">
  <Settings className="h-4 w-4" />
</Button>

// As Link
<Link href="/dashboard">
  <Button>Go to Dashboard</Button>
</Link>
```

---

### Card

Container component for grouping related content.

**Import:**
```typescript
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
```

**Usage:**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

**Components:**
- `Card`: Main container
- `CardHeader`: Header section
- `CardTitle`: Title text
- `CardDescription`: Subtitle/description
- `CardContent`: Main content area
- `CardFooter`: Footer with actions

**Example - Dashboard Card:**
```tsx
<Card className="hover:border-primary/50 transition-colors">
  <div className="aspect-[3/4] bg-secondary">
    <img src={coverUrl} alt={title} />
  </div>
  <CardContent className="p-4">
    <h3 className="font-semibold">{title}</h3>
    <p className="text-sm text-muted-foreground">{subtitle}</p>
  </CardContent>
  <CardFooter className="p-4 pt-0">
    <Button className="w-full">Edit</Button>
  </CardFooter>
</Card>
```

---

### Input

Text input field component.

**Import:**
```typescript
import { Input } from '@/components/ui/input'
```

**Usage:**
```tsx
<Input type="text" placeholder="Enter text..." />
<Input type="email" placeholder="email@example.com" />
<Input type="password" placeholder="Password" />
<Input type="file" accept="image/*" />
```

**Props:**
- All standard input HTML attributes
- `type`: "text" | "email" | "password" | "number" | "file" | etc.
- `className`: Additional CSS classes

**Example with Label:**
```tsx
<div>
  <Label htmlFor="title">Title</Label>
  <Input
    id="title"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    placeholder="Enter book title"
  />
</div>
```

---

### Textarea

Multi-line text input component.

**Import:**
```typescript
import { Textarea } from '@/components/ui/textarea'
```

**Usage:**
```tsx
<Textarea 
  placeholder="Enter content..."
  rows={10}
/>
```

**Props:**
- All standard textarea HTML attributes
- `className`: Additional CSS classes

**Example:**
```tsx
<Textarea
  value={content}
  onChange={(e) => setContent(e.target.value)}
  placeholder="Start writing your chapter..."
  className="min-h-[500px] font-mono"
/>
```

---

### Label

Accessible label component for form fields.

**Import:**
```typescript
import { Label } from '@/components/ui/label'
```

**Usage:**
```tsx
<Label htmlFor="input-id">Label Text</Label>
<Input id="input-id" />
```

**Props:**
- `htmlFor`: Input ID to associate with
- All standard label HTML attributes

---

### Dialog

Modal dialog component for overlays and confirmations.

**Import:**
```typescript
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
```

**Usage:**
```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>
        Dialog description text
      </DialogDescription>
    </DialogHeader>
    <div>
      {/* Dialog content */}
    </div>
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

**Example - Confirm Delete:**
```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button variant="destructive">Delete</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogDescription>
        This action cannot be undone. This will permanently delete your ebook.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline" onClick={handleCancel}>
        Cancel
      </Button>
      <Button variant="destructive" onClick={handleDelete}>
        Delete
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

## 📦 Custom Components

### Navbar

Application navigation bar with user authentication.

**Location:** `components/Navbar.tsx`

**Import:**
```typescript
import Navbar from '@/components/Navbar'
```

**Usage:**
```tsx
<Navbar />
```

**Features:**
- App logo and title
- Links to dashboard
- User button with profile menu
- Sticky positioning
- Dark theme styling

**Example:**
```tsx
export default function Page() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>{/* Page content */}</main>
    </div>
  )
}
```

---

## 🎨 Styling Guidelines

### Color Classes

**Background:**
```tsx
className="bg-background"        // Main background
className="bg-secondary"         // Secondary background
className="bg-card"             // Card background
```

**Text:**
```tsx
className="text-foreground"      // Primary text
className="text-muted-foreground" // Muted text
className="text-primary"         // Accent text
```

**Borders:**
```tsx
className="border-border"        // Standard border
className="border-primary"       // Accent border
```

### Spacing

Use Tailwind spacing scale (4px base):
```tsx
className="p-4"    // padding: 1rem (16px)
className="m-2"    // margin: 0.5rem (8px)
className="gap-6"  // gap: 1.5rem (24px)
```

### Responsive Design

```tsx
className="text-sm md:text-base lg:text-lg"
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
className="hidden md:block"
```

---

## 🔧 Creating Custom Components

### Best Practices

1. **Use TypeScript**
```typescript
interface ComponentProps {
  title: string
  onSave: () => void
  children?: React.ReactNode
}

export function Component({ title, onSave, children }: ComponentProps) {
  // Component code
}
```

2. **Export Named Components**
```typescript
export function MyComponent() {
  // Better for tree-shaking
}
```

3. **Use Composition**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    <CustomContent />
  </CardContent>
</Card>
```

4. **Apply Variants with CVA**
```typescript
import { cva } from "class-variance-authority"

const variants = cva("base-classes", {
  variants: {
    variant: {
      default: "default-classes",
      outline: "outline-classes",
    },
    size: {
      sm: "small-classes",
      lg: "large-classes",
    },
  },
})
```

---

## 📚 Component Patterns

### Loading State

```tsx
function Component() {
  const [loading, setLoading] = useState(true)

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return <div>{/* Content */}</div>
}
```

### Error State

```tsx
function Component() {
  const [error, setError] = useState<string | null>(null)

  if (error) {
    return (
      <div className="p-4 border border-destructive rounded-lg">
        <p className="text-destructive">{error}</p>
      </div>
    )
  }

  return <div>{/* Content */}</div>
}
```

### Empty State

```tsx
function Component({ items }: { items: any[] }) {
  if (items.length === 0) {
    return (
      <div className="text-center py-16 border border-dashed border-border rounded-lg">
        <Icon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">No items found</h3>
        <p className="text-muted-foreground mb-6">
          Get started by creating your first item
        </p>
        <Button onClick={handleCreate}>Create Item</Button>
      </div>
    )
  }

  return <div>{/* Items list */}</div>
}
```

### Form Component

```tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function FormComponent() {
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Submit logic
      await submitData(value)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="field">Field Label</Label>
        <Input
          id="field"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter value..."
          required
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save'}
      </Button>
    </form>
  )
}
```

---

## 🎯 Component Organization

### File Structure

```
components/
├── ui/                    # Base UI components
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   └── index.ts          # Export all
├── Navbar.tsx            # App navigation
├── DashboardCard.tsx     # Feature components
├── EditorToolbar.tsx
└── ChapterList.tsx
```

### Import/Export Pattern

```typescript
// components/ui/index.ts
export { Button } from './button'
export { Card, CardHeader, CardContent } from './card'
export { Input } from './input'

// Usage in other files
import { Button, Card, Input } from '@/components/ui'
```

---

## 🔍 Testing Components

### Visual Testing

1. Create component variations
2. Test in different states (loading, error, success)
3. Test responsive breakpoints
4. Test dark/light modes

### Accessibility Testing

1. Keyboard navigation
2. Screen reader compatibility
3. ARIA labels
4. Color contrast

---

## 📖 Additional Resources

- [Radix UI Documentation](https://www.radix-ui.com/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev/)

---

**For implementation examples, see the actual component files in `components/` directory.**
