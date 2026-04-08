import type { ResumeData } from '@/types/resume'
import { ResumeDataSchema } from '@/schemas/resumeSchema'

export interface ParseResult {
  success: boolean
  data?: ResumeData
  rawText?: string
  error?: string
}

const API_URL = '/api/parse-resume'

/**
 * Full resume parsing pipeline:
 * 1. Client-side text extraction (PDF/DOCX) — lazy-loaded to keep initial bundle small
 * 2. Server-side AI structured parsing (Cloudflare Workers AI)
 */
export async function parseResume(file: File): Promise<ParseResult> {
  let rawText: string
  const ext = file.name.split('.').pop()?.toLowerCase()

  if (ext === 'pdf') {
    const { extractPdfText } = await import('./pdfParser')
    const result = await extractPdfText(file)
    rawText = result.text
  } else if (ext === 'docx' || ext === 'doc') {
    const { extractDocxText } = await import('./docxParser')
    const result = await extractDocxText(file)
    rawText = result.text
  } else {
    return {
      success: false,
      error: `Unsupported file type: .${ext}. Please upload a PDF or DOCX file.`,
    }
  }

  if (!rawText.trim()) {
    return {
      success: false,
      error: 'Could not extract any text from the file. It may be image-based or empty.',
    }
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: rawText }),
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({ error: 'Unknown server error' }))
      console.error('parseResume API request failed', {
        status: response.status,
        error: err.error,
      })
      return { success: false, error: err.error || `Server error: ${response.status}` }
    }

    const { data } = await response.json()

    // Validate AI response against schema before storing
    const result = ResumeDataSchema.safeParse(data)
    if (!result.success) {
      console.warn('AI response validation warnings:', result.error.issues)
      // Don't fail — still return the data but log issues
      // The editor can handle partial/malformed data
    }

    return {
      success: true,
      data: (result.success ? result.data : data) as ResumeData,
      rawText,
    }
  } catch (error) {
    console.error('parseResume request failed before completion', {
      fileName: file.name,
      error: error instanceof Error ? error.message : String(error),
    })
    return {
      success: false,
      rawText,
      error: 'AI parsing unavailable. Raw text extracted — you can edit manually.',
    }
  }
}
