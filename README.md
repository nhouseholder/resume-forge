# ResumeForge

ResumeForge turns a PDF or DOCX resume into an editable, design-forward resume site. Users can upload a resume, let AI structure the content, refine it in a sectioned editor, customize the template, save a browser PDF, and share a read-only link.

## Current Product Surface

- AI parsing for PDF and DOCX uploads through Cloudflare Functions
- Structured editing for basics, work, education, skills, publications, projects, and extended resume sections
- Three resume templates: Meridian, Signal, and Canvas
- Theme controls for palette, typography, density, dark mode, and section visibility
- Browser PDF export from the preview surface
- Read-only share links using compressed client-side payloads

## Stack

- React 19 + TypeScript + Vite
- Zustand for persisted editor state
- Zod for runtime schema validation
- Cloudflare Pages + Functions for deployment and parsing
- `pdfjs-dist` and `mammoth` for client-side file extraction

## Local Development

```bash
npm install
npm run dev
```

Open the Vite app locally and upload a PDF or DOCX from the builder route.

## Commands

```bash
npm run lint
npm run test
npm run build
npm run deploy
```

## Deployment Notes

ResumeForge deploys to the Cloudflare Pages project `resume-forge`.

Required production secret:

- `OPENAI_API_KEY`

If the secret is missing, `/api/parse-resume` will return a configuration error and live AI parsing will fail.

## Share Links

Share links are browser-generated. They currently store the resume payload in the URL itself, which keeps the MVP simple and serverless but means extremely large resumes may need PDF export instead.

## Repository Priorities

1. Keep the parse flow reliable in production.
2. Keep homepage and metadata copy aligned with shipped features.
3. Reuse the existing template renderer instead of building parallel render paths.
