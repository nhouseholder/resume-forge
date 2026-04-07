import * as pdfjsLib from 'pdfjs-dist'

// Configure worker — use CDN for the worker file (avoids bundling issues)
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`

export interface ExtractedText {
  text: string
  pageCount: number
  fileName: string
}

/**
 * Extract plain text from a PDF file.
 * Runs entirely client-side — no data leaves the browser.
 */
export async function extractPdfText(file: File): Promise<ExtractedText> {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  const pages: string[] = []

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const strings = content.items
      .map((item) => {
        if ('str' in item) return item.str
        return ''
      })
      .filter(Boolean)
    pages.push(strings.join(' '))
  }

  return {
    text: pages.join('\n\n'),
    pageCount: pdf.numPages,
    fileName: file.name,
  }
}
