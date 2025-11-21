import Link from 'next/link'
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs'

export default function Navbar() {
  return (
    <nav className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/95">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <Image 
            src="/logo.png" 
            alt="Hogwarts Logo" 
            width={40} 
            height={40}
            className="object-contain"
          />
          <span className="text-xl font-bold tracking-tight">Hogwarts</span>
        </Link>
        <UserButton afterSignOutUrl="/" />
      </div>
    </nav>
  )
}
