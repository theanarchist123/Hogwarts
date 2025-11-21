import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, PageBreak } from 'docx'
import EPub from 'epub-gen-memory'

export interface ExportChapter {
  title: string
  content: string
  imageUrl?: string
}

export interface ExportOptions {
  title: string
  subtitle?: string
  author: string
  chapters: ExportChapter[]
  coverImageUrl?: string
}

// EPUB Export (epub-gen-memory)
export async function generateEPUB(options: ExportOptions): Promise<Buffer> {
  const content = options.chapters.map((chapter, index) => ({
    title: chapter.title,
    content: `
      <h2>${chapter.title}</h2>
      ${chapter.imageUrl ? `<img src="${chapter.imageUrl}" alt="${chapter.title}" style="max-width: 100%; height: auto; margin: 2em 0;" />` : ''}
      ${formatContentForHTML(chapter.content)}
    `,
    beforeToc: index === 0
  }))

  const epubOptions = {
    title: options.title,
    author: options.author,
    publisher: 'Hogwarts AI Storybook Creator',
    cover: options.coverImageUrl || undefined,
    fonts: [],
    lang: 'en',
    css: `
      body {
        font-family: 'Palatino', 'Georgia', serif;
        font-size: 1.1em;
        line-height: 1.7;
        text-align: justify;
        margin: 1.5em;
        hyphens: auto;
        -webkit-hyphens: auto;
      }
      h2 {
        font-family: 'Garamond', 'Georgia', serif;
        font-size: 1.8em;
        margin-top: 2em;
        margin-bottom: 1em;
        text-align: center;
        page-break-before: always;
      }
      p {
        margin: 0.5em 0;
        text-indent: 1.5em;
      }
      p:first-of-type {
        text-indent: 0;
      }
      img {
        display: block;
        margin: 2em auto;
        max-width: 100%;
        height: auto;
      }
    `
  }

  const epub = new (EPub as any)(epubOptions, content)
  return await epub.genEpub()
}

// DOCX Export (docx npm)
export async function generateDOCX(options: ExportOptions): Promise<Buffer> {
  const { Document: DocxDocument, Packer } = await import('docx')
  
  const children: any[] = []

  // Title page
  children.push(
    new Paragraph({
      text: options.title,
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 }
    })
  )

  if (options.subtitle) {
    children.push(
      new Paragraph({
        text: options.subtitle,
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 }
      })
    )
  }

  children.push(
    new Paragraph({
      text: `by ${options.author}`,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 }
    }),
    new Paragraph({ text: '', pageBreakBefore: true })
  )

  // Chapters
  for (const chapter of options.chapters) {
    // Chapter title
    children.push(
      new Paragraph({
        text: chapter.title,
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { before: 240, after: 240 },
        pageBreakBefore: true
      })
    )

    // Chapter content (split by paragraphs)
    const paragraphs = chapter.content
      .split('\n\n')
      .filter(p => p.trim())
      .map(p => p.trim())

    for (let i = 0; i < paragraphs.length; i++) {
      const text = paragraphs[i]
        .replace(/^#+\s+/, '') // Remove markdown headings
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
        .replace(/\*(.*?)\*/g, '$1') // Remove italic
      
      children.push(
        new Paragraph({
          text,
          spacing: { 
            before: i === 0 ? 0 : 120,
            after: 120 
          },
          indent: {
            firstLine: i === 0 ? 0 : 720 // First paragraph no indent
          }
        })
      )
    }
  }

  const doc = new DocxDocument({
    sections: [{
      properties: {
        page: {
          margin: {
            top: 1440, // 1 inch
            right: 1440,
            bottom: 1440,
            left: 1440
          }
        }
      },
      children
    }]
  })

  return await Packer.toBuffer(doc)
}

// HTML for print-ready PDF (with Paged.js)
export function generatePrintHTML(options: ExportOptions): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${options.title}</title>
  <script src="https://unpkg.com/pagedjs/dist/paged.polyfill.js"></script>
  <style>
    /* Page setup */
    @page {
      size: 6in 9in; /* Trade paperback */
      margin: 0.75in 0.625in; /* Outer margins */
      
      @top-left {
        content: string(bookTitle);
        font-family: 'Garamond', 'Georgia', serif;
        font-size: 9pt;
        font-style: italic;
      }
      
      @top-right {
        content: counter(page);
        font-family: 'Garamond', 'Georgia', serif;
        font-size: 9pt;
      }
    }
    
    @page :first {
      margin: 0;
      @top-left { content: none; }
      @top-right { content: none; }
    }
    
    @page :left {
      @top-left { content: string(bookTitle); }
      @top-right { content: counter(page); }
    }
    
    @page :right {
      @top-left { content: counter(page); }
      @top-right { content: string(chapterTitle); }
    }
    
    /* Typography */
    body {
      font-family: 'Palatino', 'Baskerville', 'Georgia', serif;
      font-size: 11pt;
      line-height: 1.6;
      text-align: justify;
      hyphens: auto;
      -webkit-hyphens: auto;
      font-feature-settings: "liga" 1, "kern" 1;
      color: #1a1a1a;
    }
    
    h1 {
      string-set: bookTitle content(text);
      font-family: 'Garamond', 'Georgia', serif;
      font-size: 28pt;
      font-weight: normal;
      text-align: center;
      margin: 3in 0 0.5in;
      page-break-before: always;
    }
    
    h2 {
      string-set: chapterTitle content(text);
      font-family: 'Garamond', 'Georgia', serif;
      font-size: 18pt;
      font-weight: normal;
      text-align: center;
      margin: 1.5in 0 0.5in;
      page-break-before: always;
    }
    
    p {
      margin: 0;
      text-indent: 1.5em;
      orphans: 2;
      widows: 2;
    }
    
    p:first-of-type,
    p.no-indent {
      text-indent: 0;
    }
    
    /* Drop cap for chapter openings */
    .chapter-start::first-letter {
      font-size: 3.5em;
      line-height: 0.9;
      float: left;
      margin: 0.05em 0.1em 0 0;
      font-weight: bold;
    }
    
    /* Images */
    img {
      max-width: 100%;
      height: auto;
      display: block;
      margin: 1em auto;
    }
    
    .cover {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    /* Prevent breaks */
    h1, h2, h3 {
      page-break-after: avoid;
    }
    
    /* Title page */
    .title-page {
      text-align: center;
      page-break-after: always;
    }
    
    .title-page h1 {
      margin-top: 3in;
      page-break-before: auto;
    }
    
    .subtitle {
      font-size: 14pt;
      font-style: italic;
      margin: 0.5em 0;
    }
    
    .author {
      font-size: 12pt;
      margin-top: 2em;
    }
  </style>
</head>
<body>
  <!-- Cover -->
  ${options.coverImageUrl ? `<div class="title-page">
    <img src="${options.coverImageUrl}" alt="Cover" class="cover" />
  </div>` : ''}
  
  <!-- Title page -->
  <div class="title-page">
    <h1>${options.title}</h1>
    ${options.subtitle ? `<p class="subtitle">${options.subtitle}</p>` : ''}
    <p class="author">by ${options.author}</p>
  </div>
  
  <!-- Chapters -->
  ${options.chapters.map((chapter, index) => `
    <div class="chapter">
      <h2>${chapter.title}</h2>
      ${chapter.imageUrl ? `<img src="${chapter.imageUrl}" alt="${chapter.title}" />` : ''}
      ${formatContentForHTML(chapter.content, index === 0)}
    </div>
  `).join('\n')}
</body>
</html>`
}

// Helper: Convert markdown to HTML
function formatContentForHTML(content: string, isFirstChapter: boolean = false): string {
  const paragraphs = content
    .split('\n\n')
    .filter(p => p.trim())
    .map((p, index) => {
      let text = p.trim()
        .replace(/^#+\s+/, '') // Remove markdown headings
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
        .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
      
      const className = (isFirstChapter && index === 0) ? 'chapter-start' : ''
      return `<p class="${className}">${text}</p>`
    })
  
  return paragraphs.join('\n')
}

// Print route helper: Get ebook with populated chapters
export async function getEbookForExport(ebookId: string, userId: string) {
  // This will be implemented in the API route
  // Fetch ebook + all chapters from Supabase
  return null
}
