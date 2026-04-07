import type { ResumeData } from '@/types/resume'
import { ResumeDataSchema } from '@/schemas/resumeSchema'
import { extractPdfText } from './pdfParser'
import { extractDocxText } from './docxParser'

export interface ParseResult {
  success: boolean
  data?: ResumeData
  rawText?: string
  error?: string
}

const API_URL = '/api/parse-resume'

/**
 * Full resume parsing pipeline:
 * 1. Client-side text extraction (PDF/DOCX)
 * 2. Server-side AI structured parsing (OpenAI)
 */
export async function parseResume(file: File): Promise<ParseResult> {
  let rawText: string
  const ext = file.name.split('.').pop()?.toLowerCase()

  if (ext === 'pdf') {
    const result = await extractPdfText(file)
    rawText = result.text
  } else if (ext === 'docx' || ext === 'doc') {
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
  } catch {
    return {
      success: false,
      rawText,
      error: 'AI parsing unavailable. Raw text extracted — you can edit manually.',
    }
  }
}
