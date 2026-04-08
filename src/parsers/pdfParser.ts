import * as pdfjsLib from 'pdfjs-dist'

// Bundle the PDF.js worker with the app so uploads do not depend on an external CDN.
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()

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
