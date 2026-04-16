import type { ResumeData, ResumeMeta, FieldCategory } from '../../types/resume'
import { buildPortfolioHtml } from '../../portfolio/buildPortfolioHtml'

/**
 * Generate a self-contained portfolio HTML file and trigger a download.
 */
export function downloadPortfolioHtml(opts: {
  resume: ResumeData
  meta: ResumeMeta
  fieldCategory: FieldCategory | null
}): void {
  const html = buildPortfolioHtml({
    resume: opts.resume,
    meta: opts.meta,
    fieldCategory: opts.fieldCategory,
  })

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const name = opts.resume.basics?.name?.replace(/\s+/g, '-').toLowerCase() || 'portfolio'

  const a = document.createElement('a')
  a.href = url
  a.download = `${name}-portfolio.html`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Open the portfolio in a new window for print-to-PDF.
 */
export function printPortfolioPdf(opts: {
  resume: ResumeData
  meta: ResumeMeta
  fieldCategory: FieldCategory | null
}): void {
  const html = buildPortfolioHtml({
    resume: opts.resume,
    meta: opts.meta,
    fieldCategory: opts.fieldCategory,
  })

  const win = window.open('', '_blank')
  if (!win) return

  win.document.write(html)
  win.document.close()

  // Wait for fonts to load before printing
  if (win.document.fonts?.ready) {
    win.document.fonts.ready.then(() => {
      setTimeout(() => win.print(), 300)
    })
  } else {
    setTimeout(() => win.print(), 800)
  }
}
