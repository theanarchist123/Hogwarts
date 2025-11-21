import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import './globals.css'
import type { Metadata } from 'next'
import { CursorProvider, Cursor } from '@/components/animate-ui/components/animate/cursor'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Hogwarts - AI Ebook Creator',
  description: 'Create magical ebooks with AI assistance. Your gateway to enchanting storytelling and spellbinding content creation.',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className={inter.variable}>
          <CursorProvider global>
            <Cursor className="text-primary" />
            {children}
          </CursorProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
