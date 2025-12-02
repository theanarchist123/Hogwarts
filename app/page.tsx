import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Image as ImageIcon, FileText, Wand2, BookMarked, Zap } from 'lucide-react'
import { Sparkles } from '@/components/animate-ui/icons/sparkles'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { TestimonialsMarquee } from '@/components/TestimonialsMarquee'
import { StarsBackground } from '@/components/animate-ui/components/backgrounds/stars'
import { FeatureFlipCard } from '@/components/FeatureFlipCard'

export default function Home() {
  return (
    <div className="min-h-screen bg-background relative">
      {/* Stars Background */}
      <StarsBackground className="absolute inset-0 z-0" />
      
      {/* Content Wrapper */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/95">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Image 
              src="/logo.png" 
              alt="Hogwarts Logo" 
              width={40} 
              height={40}
              className="object-contain"
            />
            <span className="text-xl font-bold tracking-tight">Hogwarts</span>
          </Link>
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary mb-4">
            <Sparkles className="h-4 w-4" animateOnHover />
            AI-Powered Story Creation
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Create Magical Ebooks
            <span className="block text-primary mt-2">with AI Wizardry</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Transform your ideas into enchanting visual storybooks. AI generates complete stories 
            with beautiful illustrations in minutes.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <SignedOut>
              <Link href="/sign-up">
                <Button size="lg" className="text-lg px-8">
                  <Sparkles className="mr-2 h-5 w-5" animateOnHover />
                  Start Creating Free
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
            <Link href="#features">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Marquee */}
      <TestimonialsMarquee />

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
            Powered by AI Magic
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From idea to complete illustrated story in minutes. Just describe what you want.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <FeatureFlipCard
            icon={<Sparkles className="h-10 w-10 text-primary" animateOnHover />}
            title="Complete Story Generation"
            description="Describe your story idea (genre, theme, characters). AI creates 5-7 chapters with engaging narratives automatically."
            backContent="✨ Powered by advanced AI language models that understand storytelling structure, character development, and narrative flow. Your ideas transform into professionally written stories in seconds!"
          />
          <FeatureFlipCard
            icon={<ImageIcon className="h-10 w-10 text-primary" />}
            title="Beautiful Illustrations"
            description="Every chapter gets a stunning AI-generated illustration. True visual storybooks like professional children's books."
            backContent="🎨 AI-powered image generation creates unique, high-quality illustrations that perfectly match your story's mood and theme. Each image is crafted to bring your narrative to life!"
          />
          <FeatureFlipCard
            icon={<FileText className="h-10 w-10 text-primary" />}
            title="Professional Content"
            description="Vivid descriptions, natural dialogue, and smooth chapter transitions. Publication-ready quality."
            backContent="📝 Every story features rich descriptive language, authentic character voices, and seamless narrative flow. Export-ready content suitable for publishing or sharing immediately!"
          />
          <FeatureFlipCard
            icon={<BookMarked className="h-10 w-10 text-primary" />}
            title="Flip Book Experience"
            description="Read with a beautiful two-page spread layout and smooth page-turning animations. Just like a real book."
            backContent="📖 Immersive reading interface with realistic page-turning animations and two-page spreads. Experience your stories the way they were meant to be read - like a physical book!"
          />
          <FeatureFlipCard
            icon={<Wand2 className="h-10 w-10 text-primary" />}
            title="AI Inline Editing"
            description="Select any text while reading and ask AI to improve it instantly. Refine your story on the fly."
            backContent="🪄 Real-time AI editing lets you select any passage and request improvements, expansions, or rewrites. Perfect your story iteratively with intelligent suggestions!"
          />
          <FeatureFlipCard
            icon={<Zap className="h-10 w-10 text-primary" />}
            title="Lightning Fast"
            description="Complete illustrated stories in 1-2 minutes. No waiting, just instant creative results."
            backContent="⚡ Optimized AI processing delivers complete illustrated ebooks in under 2 minutes. From concept to finished story faster than you can imagine!"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center border border-border/40 rounded-2xl p-12 md:p-16 bg-transparent backdrop-blur-sm shadow-lg hover:border-primary/50 transition-all">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
            Ready to Create Your Story?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of creators bringing their stories to life with AI
          </p>
          <SignedOut>
            <Link href="/sign-up">
              <Button size="lg" className="text-lg px-12">
                <Sparkles className="mr-2 h-5 w-5" animateOnHover />
                Get Started Free
              </Button>
            </Link>
          </SignedOut>
          <SignedIn>
            <Link href="/generate">
              <Button size="lg" className="text-lg px-12">
                <Sparkles className="mr-2 h-5 w-5" animateOnHover />
                Generate Your First Story
              </Button>
            </Link>
          </SignedIn>
        </div>
      </section>

        {/* Footer */}
        <footer className="border-t border-border/40 py-12 mt-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <Image 
                  src="/logo.png" 
                  alt="Hogwarts Logo" 
                  width={32} 
                  height={32}
                  className="object-contain"
                />
                <span className="font-semibold">Hogwarts</span>
              </div>
              <p className="text-muted-foreground text-sm">
                &copy; 2025 Hogwarts. Where stories come to life with AI magic.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}


