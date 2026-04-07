import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string'
import { z } from 'zod'
import { ResumeDataSchema, ResumeMetaSchema } from '@/schemas/resumeSchema'
import type { ResumeData, ResumeMeta } from '@/types/resume'

export const SHARED_RESUME_VERSION = 1
export const MAX_SHARE_PAYLOAD_LENGTH = 4500

const SharedResumePayloadSchema = z.object({
	version: z.literal(SHARED_RESUME_VERSION),
	resume: ResumeDataSchema,
	meta: ResumeMetaSchema,
})

export type SharedResumePayload = z.infer<typeof SharedResumePayloadSchema>

type ShareBuildResult =
	| { ok: true; url: string; encoded: string }
	| { ok: false; error: string }

type ShareDecodeResult =
	| { ok: true; payload: SharedResumePayload }
	| { ok: false; error: string }

interface BuildSharedResumeUrlOptions {
	resume: ResumeData
	meta: ResumeMeta
	origin: string
}

function normalizeOrigin(origin: string): string {
	return origin.endsWith('/') ? origin.slice(0, -1) : origin
}

export function encodeSharedResumePayload(resume: ResumeData, meta: ResumeMeta): string {
	return compressToEncodedURIComponent(
		JSON.stringify({
			version: SHARED_RESUME_VERSION,
			resume,
			meta,
		}),
	)
}

export function buildSharedResumeUrl({ resume, meta, origin }: BuildSharedResumeUrlOptions): ShareBuildResult {
	const parsed = SharedResumePayloadSchema.safeParse({
		version: SHARED_RESUME_VERSION,
		resume,
		meta,
	})

	if (!parsed.success) {
		return {
			ok: false,
			error: 'This resume needs a few more valid details before it can be shared.',
		}
	}

	const encoded = encodeSharedResumePayload(parsed.data.resume, parsed.data.meta)

	if (!encoded || encoded.length > MAX_SHARE_PAYLOAD_LENGTH) {
		return {
			ok: false,
			error: 'This resume is too large for a browser-only share link. Save it as PDF instead.',
		}
	}

	return {
		ok: true,
		encoded,
		url: `${normalizeOrigin(origin)}/view/${encoded}`,
	}
}

export function decodeSharedResumePayload(encoded: string): ShareDecodeResult {
	if (!encoded) {
		return {
			ok: false,
			error: 'This share link is missing its resume payload.',
		}
	}

	const decompressed = decompressFromEncodedURIComponent(encoded)

	if (!decompressed) {
		return {
			ok: false,
			error: 'This share link is invalid or has been corrupted.',
		}
	}

	try {
		const parsed = SharedResumePayloadSchema.safeParse(JSON.parse(decompressed))

		if (!parsed.success) {
			return {
				ok: false,
				error: 'This share link is incomplete or no longer supported.',
			}
		}

		return {
			ok: true,
			payload: parsed.data,
		}
	} catch {
		return {
			ok: false,
			error: 'This share link could not be read.',
		}
	}
}
