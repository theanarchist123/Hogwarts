'use client'

import { Marquee } from "@/components/ui/marquee"

const testimonials = [
  {
    name: "Emma Stone",
    role: "Author",
    content: "Created a complete fantasy novel in minutes! The AI-generated illustrations are stunning.",
    avatar: "ES"
  },
  {
    name: "James Wilson",
    role: "Writer",
    content: "Perfect for getting story ideas flowing. The chapter-by-chapter generation is brilliant.",
    avatar: "JW"
  },
  {
    name: "Sarah Chen",
    role: "Educator",
    content: "My students love creating their own visual storybooks. Game-changer for creative writing!",
    avatar: "SC"
  },
  {
    name: "Michael Brown",
    role: "Content Creator",
    content: "The flip-book reading experience is gorgeous. Feels like a real book.",
    avatar: "MB"
  },
  {
    name: "Lisa Martinez",
    role: "Novelist",
    content: "AI inline editing while reading? Absolute magic. Saves so much time.",
    avatar: "LM"
  },
  {
    name: "David Kim",
    role: "Indie Author",
    content: "From idea to published-quality ebook in under 3 minutes. Incredible.",
    avatar: "DK"
  }
]

const TestimonialCard = ({ name, role, content, avatar }: typeof testimonials[0]) => {
  return (
    <div className="relative w-80 cursor-pointer overflow-hidden rounded-xl border border-border/40 bg-transparent backdrop-blur-sm p-6 hover:border-primary/50 transition-all duration-200 hover:shadow-lg hover:shadow-primary/5">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
          {avatar}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-foreground mb-3 leading-relaxed">&ldquo;{content}&rdquo;</p>
          <div className="text-xs text-muted-foreground">
            <p className="font-semibold text-foreground">{name}</p>
            <p>{role}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function TestimonialsMarquee() {
  const firstRow = testimonials.slice(0, testimonials.length / 2)
  const secondRow = testimonials.slice(testimonials.length / 2)

  return (
    <section className="relative py-16 border-y border-border/40">
      <div className="container mx-auto px-4 mb-8">
        <p className="text-center text-sm text-muted-foreground uppercase tracking-wide font-medium">
          Trusted by creators worldwide
        </p>
      </div>
      <div className="relative flex flex-col gap-4 overflow-hidden">
        {/* Fade effect on left edge */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-background via-background/80 to-transparent z-10"></div>
        
        {/* Fade effect on right edge */}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-background via-background/80 to-transparent z-10"></div>
        
        <Marquee pauseOnHover className="[--duration:40s]">
          {firstRow.map((testimonial, idx) => (
            <TestimonialCard key={idx} {...testimonial} />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className="[--duration:40s]">
          {secondRow.map((testimonial, idx) => (
            <TestimonialCard key={idx} {...testimonial} />
          ))}
        </Marquee>
      </div>
    </section>
  )
}
