import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'
import { BookOpen } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/95">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="text-xl font-semibold">Hogwarts</span>
        </Link>
        <UserButton afterSignOutUrl="/" />
      </div>
    </nav>
  )
}
