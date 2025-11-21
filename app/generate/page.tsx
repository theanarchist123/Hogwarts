'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Navbar from '@/components/Navbar'
import { Sparkles, Loader2, BookOpen, Wand2 } from 'lucide-react'

const EXAMPLE_PROMPTS = [
  "A gothic war romance between a battle-hardened general and a mysterious healer in a cursed kingdom",
  "A dark fantasy adventure where a reluctant hero must save a world on the brink of apocalypse",
  "A steampunk mystery involving a detective investigating supernatural crimes in Victorian London",
  "A space opera romance between a rebel pilot and an enemy prince during an intergalactic war",
  "A magical academy story where students discover they're prophesied to save or destroy the world",
  "A cyberpunk thriller about a hacker uncovering a conspiracy that threatens humanity's existence",
]

export default function GenerateStoryPage() {
  const router = useRouter()
  const [prompt, setPrompt] = useState('')
  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState('')

  const handleGenerate = async () => {
    if (!prompt.trim() || prompt.trim().length < 10) {
      alert('Please enter a detailed story prompt (at least 10 characters)')
      return
    }

    setGenerating(true)
    setProgress('🎭 Creating story outline...')

    try {
      setTimeout(() => setProgress('✍️ Writing chapters with AI magic...'), 3000)
      setTimeout(() => setProgress('🎨 Generating beautiful illustrations...'), 10000)
      setTimeout(() => setProgress('📚 Bringing your visual storybook to life...'), 20000)

      const response = await fetch('/api/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to generate story')
      }

      const data = await response.json()
      
      setProgress('✨ Story created successfully!')
      
      // Redirect to the flip book reader to enjoy the story!
      setTimeout(() => {
        router.push(`/read/${data.ebook.id}`)
      }, 1500)
    } catch (error) {
      console.error('Error generating story:', error)
      alert(error instanceof Error ? error.message : 'Failed to generate story. Please try again.')
      setGenerating(false)
      setProgress('')
    }
  }

  const handleExampleClick = (example: string) => {
    setPrompt(example)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary mb-6">
            <Sparkles className="h-4 w-4" />
            AI Story Generator
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            Create Your Story
          </h1>
          <p className="text-xl text-muted-foreground">
            Describe your dream story, and watch AI magic bring it to life
          </p>
        </div>

        <Card className="mb-8 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Wand2 className="h-6 w-6 text-primary" />
              Your Story Idea
            </CardTitle>
            <CardDescription className="text-base">
              Be as detailed as you want! Include genre, themes, characters, setting, and tone.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Example: I want a gothic war romance set in a cursed kingdom. The story should follow a battle-hardened general who falls in love with a mysterious healer. Include dark magic, political intrigue, and epic battle scenes..."
              className="min-h-[200px] text-base resize-none"
              disabled={generating}
            />

            <Button
              onClick={handleGenerate}
              disabled={generating || !prompt.trim() || prompt.trim().length < 10}
              size="lg"
              className="w-full shadow-sm"
            >
              {generating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Your Story...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Complete Story
                </>
              )}
            </Button>

            {generating && (
              <div className="p-6 bg-primary/5 rounded-xl border border-primary/20">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <p className="text-center text-lg font-semibold">{progress}</p>
                </div>
                <p className="text-center text-sm text-muted-foreground">
                  Creating <span className="text-primary font-semibold">5-7 chapters</span> with{' '}
                  <span className="text-primary font-semibold">beautiful illustrations</span>. This takes 1-2 minutes.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Example Story Prompts
            </CardTitle>
            <CardDescription>
              Click any example to use it as inspiration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {EXAMPLE_PROMPTS.map((example, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(example)}
                  disabled={generating}
                  className="text-left p-5 rounded-xl border border-border hover:border-primary/50 hover:bg-muted/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-2">
                    Example {index + 1}
                  </p>
                  <p className="text-sm leading-relaxed group-hover:text-foreground transition-colors">{example}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 p-6 bg-muted/30 rounded-xl border border-border">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-primary" />
            Tips for Best Results
          </h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span><strong className="text-foreground">Be specific</strong> about genre, tone, and themes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span><strong className="text-foreground">Describe characters</strong> and their relationships</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span><strong className="text-foreground">Mention the setting</strong> - time period, location, world</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span><strong className="text-foreground">Include plot elements</strong> you want to see</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span><strong className="text-foreground">Specify the mood</strong> - dark, lighthearted, suspenseful, etc.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
