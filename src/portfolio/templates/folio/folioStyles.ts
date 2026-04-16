import type { PortfolioTheme } from '../../types'

export function generateFolioCss(theme: PortfolioTheme): string {
  const { colors: c, fonts: f } = theme

  return `
/* ── Reset + base ── */
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%;text-size-adjust:100%}
body{
  font-family:${f.body},system-ui,sans-serif;
  font-weight:${f.bodyWeight};
  color:${c.text};
  background:${c.bg};
  line-height:1.65;
  -webkit-font-smoothing:antialiased;
}
a{color:${c.accent};text-decoration:none;transition:color .2s}
a:hover{color:${c.accentHover}}
img{max-width:100%;display:block}

/* ── Layout ── */
.page-shell{
  max-width:72rem;
  margin:0 auto;
  padding:0 1.5rem;
}

/* ── Header ── */
.site-header{
  position:sticky;top:0;z-index:40;
  background:${c.bg};
  border-bottom:1px solid ${c.border};
  backdrop-filter:blur(12px);
}
.header-inner{
  max-width:72rem;margin:0 auto;
  display:flex;align-items:center;justify-content:space-between;
  padding:0 1.5rem;height:4rem;
}
.wordmark{
  font-family:${f.heading},serif;
  font-weight:${f.headingWeight};
  font-size:1.25rem;
  color:${c.heading};
  letter-spacing:-0.01em;
  text-decoration:none;
}
.site-nav{display:flex;gap:1.5rem;align-items:center}
.site-nav a{
  font-size:0.82rem;font-weight:500;
  color:${c.textMuted};
  letter-spacing:0.03em;
  text-transform:uppercase;
  transition:color .2s;
}
.site-nav a:hover,.site-nav a.active{color:${c.heading}}
.nav-pill{
  background:${c.primary};color:${c.bg}!important;
  padding:0.35rem 0.9rem;border-radius:2rem;
  font-size:0.78rem;font-weight:600;
}
.nav-pill:hover{background:${c.primaryDark}}

/* ── Hero ── */
.hero{
  padding:5rem 0 4rem;
  border-bottom:1px solid ${c.border};
}
.hero-grid{
  display:grid;gap:3rem;
  grid-template-columns:1fr;
}
.eyebrow{
  font-family:${f.mono},monospace;
  font-size:0.72rem;font-weight:500;
  letter-spacing:0.14em;text-transform:uppercase;
  color:${c.accent};
}
.hero h1{
  font-family:${f.heading},serif;
  font-weight:${f.headingWeight};
  font-size:clamp(2.4rem,5vw,3.8rem);
  line-height:1.1;letter-spacing:-0.02em;
  color:${c.heading};
  margin-top:1rem;
}
.hero-lead{
  font-size:1.15rem;line-height:1.7;
  color:${c.text};
  margin-top:1.5rem;max-width:42rem;
}
.hero-body{
  font-size:0.95rem;line-height:1.7;
  color:${c.textMuted};
  margin-top:1rem;max-width:42rem;
}
.hero-actions{
  display:flex;gap:0.75rem;flex-wrap:wrap;
  margin-top:2rem;
}

/* ── Buttons ── */
.btn{
  display:inline-flex;align-items:center;gap:0.5rem;
  padding:0.65rem 1.4rem;
  font-size:0.85rem;font-weight:600;
  border-radius:0.375rem;
  border:1px solid transparent;
  cursor:pointer;transition:all .2s;
  text-decoration:none;
}
.btn-primary{
  background:${c.primary};color:${c.bg};
  border-color:${c.primary};
}
.btn-primary:hover{background:${c.primaryDark};border-color:${c.primaryDark}}
.btn-secondary{
  background:transparent;color:${c.text};
  border-color:${c.border};
}
.btn-secondary:hover{border-color:${c.textMuted}}

/* ── Section ── */
.portfolio-section{
  padding:4rem 0;
  border-bottom:1px solid ${c.border};
}
.section-header{margin-bottom:2.5rem}
.section-eyebrow{
  font-family:${f.mono},monospace;
  font-size:0.7rem;font-weight:500;
  letter-spacing:0.14em;text-transform:uppercase;
  color:${c.accent};
}
.section-title{
  font-family:${f.heading},serif;
  font-weight:${f.headingWeight};
  font-size:clamp(1.6rem,3vw,2.2rem);
  line-height:1.2;letter-spacing:-0.01em;
  color:${c.heading};
  margin-top:0.5rem;
}
.section-desc{
  font-size:0.92rem;line-height:1.7;
  color:${c.textMuted};
  margin-top:0.75rem;max-width:40rem;
}

/* ── Project cards ── */
.project-grid{display:grid;gap:1.5rem}
.project-card{
  display:grid;
  grid-template-columns:3.5rem 1fr;
  gap:1.25rem;
  padding:1.75rem;
  border:1px solid ${c.border};
  border-radius:0.5rem;
  background:${c.surface};
  transition:border-color .2s,box-shadow .2s;
}
.project-card:hover{
  border-color:${c.accent};
  box-shadow:0 4px 24px -8px color-mix(in oklch,${c.accent} 15%,transparent);
}
.project-number{
  font-family:${f.heading},serif;
  font-weight:${f.headingWeight};
  font-size:1.8rem;line-height:1;
  color:${c.border};
}
.project-name{
  font-family:${f.heading},serif;
  font-weight:${f.headingWeight};
  font-size:1.15rem;line-height:1.3;
  color:${c.heading};
}
.project-desc{
  font-size:0.88rem;line-height:1.7;
  color:${c.textMuted};
  margin-top:0.4rem;
}
.project-meta{
  display:flex;flex-wrap:wrap;gap:0.5rem;
  margin-top:0.75rem;
}
.tech-pill{
  font-family:${f.mono},monospace;
  font-size:0.68rem;font-weight:500;
  letter-spacing:0.04em;
  padding:0.2rem 0.55rem;
  border-radius:2rem;
  background:${c.surfaceElevated};
  color:${c.textMuted};
  border:1px solid ${c.border};
}
.project-links{
  display:flex;gap:0.75rem;
  margin-top:0.75rem;
}
.project-link{
  font-size:0.78rem;font-weight:600;
  color:${c.accent};
  display:inline-flex;align-items:center;gap:0.3rem;
}
.project-link:hover{color:${c.accentHover}}

/* ── Experience entries ── */
.entry-list{display:grid;gap:1.25rem}
.entry{
  padding:1.25rem 0;
  border-top:1px solid ${c.border};
}
.entry:first-child{border-top:none;padding-top:0}
.entry-header{
  display:flex;justify-content:space-between;align-items:baseline;
  flex-wrap:wrap;gap:0.5rem;
}
.entry-title{
  font-family:${f.heading},serif;
  font-weight:${f.headingWeight};
  font-size:1.05rem;color:${c.heading};
}
.entry-subtitle{
  font-size:0.85rem;color:${c.textMuted};
  margin-top:0.15rem;
}
.entry-date{
  font-family:${f.mono},monospace;
  font-size:0.72rem;font-weight:500;
  color:${c.textMuted};
  letter-spacing:0.06em;
  white-space:nowrap;
}
.entry-summary{
  font-size:0.88rem;line-height:1.7;
  color:${c.textMuted};
  margin-top:0.5rem;
}
.entry-highlights{
  list-style:none;padding:0;
  margin-top:0.5rem;
}
.entry-highlights li{
  position:relative;
  padding-left:1rem;
  font-size:0.85rem;line-height:1.65;
  color:${c.textMuted};
  margin-top:0.25rem;
}
.entry-highlights li::before{
  content:"";position:absolute;left:0;top:0.55rem;
  width:4px;height:4px;border-radius:50%;
  background:${c.accent};
}

/* ── Skills ── */
.skill-groups{display:grid;gap:1.25rem;grid-template-columns:repeat(auto-fill,minmax(14rem,1fr))}
.skill-group-name{
  font-family:${f.heading},serif;
  font-weight:${f.headingWeight};
  font-size:0.95rem;color:${c.heading};
}
.skill-keywords{display:flex;flex-wrap:wrap;gap:0.4rem;margin-top:0.5rem}
.skill-keyword{
  font-size:0.75rem;
  padding:0.2rem 0.55rem;
  border-radius:2rem;
  background:${c.surfaceElevated};
  color:${c.textMuted};
  border:1px solid ${c.border};
}

/* ── Publications ── */
.pub-list{display:grid;gap:0.75rem}
.pub{
  padding:0.75rem 0;
  border-top:1px solid ${c.border};
}
.pub:first-child{border-top:none;padding-top:0}
.pub-title{
  font-weight:600;font-size:0.9rem;
  color:${c.heading};
}
.pub-journal{
  font-size:0.82rem;color:${c.textMuted};
  font-style:italic;margin-top:0.15rem;
}
.pub-link{font-size:0.78rem;margin-top:0.25rem}

/* ── Footer ── */
.site-footer{
  padding:3rem 0;
  text-align:center;
  border-top:1px solid ${c.border};
}
.footer-tagline{
  font-family:${f.heading},serif;
  font-size:1rem;color:${c.textMuted};
  font-style:italic;
}
.footer-links{
  display:flex;justify-content:center;gap:1.25rem;
  margin-top:1rem;
}
.footer-link{
  font-size:0.8rem;font-weight:500;
  color:${c.textMuted};
  text-transform:uppercase;letter-spacing:0.06em;
}
.footer-link:hover{color:${c.accent}}

/* ── Scroll reveal ── */
[data-reveal]{opacity:0;transform:translateY(20px);transition:opacity .6s cubic-bezier(.22,1,.36,1),transform .6s cubic-bezier(.22,1,.36,1)}
[data-reveal].revealed{opacity:1;transform:translateY(0)}

/* ── Responsive ── */
@media(min-width:48rem){
  .hero-grid{grid-template-columns:1fr}
  .project-grid{grid-template-columns:repeat(auto-fill,minmax(28rem,1fr))}
}
@media(max-width:48rem){
  .site-nav{display:none}
  .hero{padding:3rem 0 2.5rem}
  .hero h1{font-size:2rem}
  .portfolio-section{padding:2.5rem 0}
  .project-card{grid-template-columns:2.5rem 1fr;padding:1.25rem}
  .project-number{font-size:1.4rem}
}

/* ── Print ── */
@media print{
  .site-header{position:static;border-bottom:none}
  .site-nav{display:none}
  [data-reveal]{opacity:1!important;transform:none!important}
  .portfolio-section{page-break-inside:avoid;break-inside:avoid}
  .hero{page-break-after:always;break-after:page}
  .portfolio-section:nth-child(n+2){page-break-before:always;break-before:page}
  @page{size:letter;margin:0.6in}
  body{print-color-adjust:exact;-webkit-print-color-adjust:exact}
  .project-card{break-inside:avoid;page-break-inside:avoid}
  .entry{break-inside:avoid;page-break-inside:avoid}
}
`.trim()
}
