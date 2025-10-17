import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BookOpen, Sparkles, Image, FileText } from 'lucide-react'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      {/* Navigation */}
      <nav className="border-b border-border/40 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold">Hogwarts</span>
          </div>
          <div className="flex items-center gap-4">
            <SignedOut>
              <Link href="/sign-in">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/sign-up">
                <Button>Get Started</Button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Create Magical Ebooks
            <span className="block text-primary mt-2">with AI Wizardry</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your ideas into enchanting stories. Let AI magic help you craft, 
            write, and illustrate your tales with the power of Hogwarts.
          </p>
          <div className="flex gap-4 justify-center">
            <SignedOut>
              <Link href="/sign-up">
                <Button size="lg" className="text-lg px-8">
                  Start Creating
                </Button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <Button size="lg" className="text-lg px-8">
                  Go to Dashboard
                </Button>
              </Link>
            </SignedIn>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powered by AI Magic ✨
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From idea to complete story in minutes. Just describe what you want.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <FeatureCard
            icon={<Sparkles className="h-8 w-8 text-primary" />}
            title="Complete Story Generation"
            description="Just describe your story idea (genre, theme, characters). AI creates entire books with 8-12 chapters automatically!"
          />
          <FeatureCard
            icon={<Image className="h-8 w-8 text-primary" />}
            title="Visual Storybook with Images"
            description="Every chapter gets a beautiful, custom-generated illustration. True visual storybooks like children's books!"
          />
          <FeatureCard
            icon={<FileText className="h-8 w-8 text-primary" />}
            title="Professional Quality Content"
            description="Engaging narratives, vivid descriptions, and natural dialogue. Each chapter flows perfectly into the next."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 mt-24">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 Hogwarts. Where stories come to life with AI magic.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="bg-card border border-border rounded-lg p-8 space-y-4 hover:border-primary/50 transition-colors">
      <div className="flex justify-center">{icon}</div>
      <h3 className="text-xl font-semibold text-center">{title}</h3>
      <p className="text-muted-foreground text-center">{description}</p>
    </div>
  )
}
