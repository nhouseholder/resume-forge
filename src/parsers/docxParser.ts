import mammoth from 'mammoth'

export interface ExtractedText {
  text: string
  pageCount: number
  fileName: string
}

/**
 * Extract plain text from a DOCX file.
 * Runs entirely client-side — no data leaves the browser.
 */
export async function extractDocxText(file: File): Promise<ExtractedText> {
  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer })

  // Estimate page count (~500 words per page)
  const wordCount = result.value.split(/\s+/).length
  const pageCount = Math.max(1, Math.ceil(wordCount / 500))

  return {
    text: result.value,
    pageCount,
    fileName: file.name,
  }
}
