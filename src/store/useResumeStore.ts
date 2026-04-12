import { create } from 'zustand';
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware';
import { get, set, del } from 'idb-keyval';
import type {
  ResumeData,
  ResumeMeta,
  FieldCategory,
} from '../types/resume';

// ── Storage adapter ──

const indexedDBStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await get(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await set(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name);
  },
};

// ── Default meta ──

const DEFAULT_META: ResumeMeta = {
  templateId: 'archive',
  palette: 'vellum-rose',
  fontPairing: 'portfolio-editorial',
  layoutDensity: 'balanced',
  darkMode: false,
  sectionVisibility: {
    work: true,
    education: true,
    skills: true,
    publications: true,
    presentations: true,
    projects: true,
    researchThreads: true,
    leadership: true,
    volunteer: true,
    awards: true,
    interests: true,
    references: true,
  },
};

// ── Store types ──

type PreviewMode = 'desktop' | 'tablet' | 'mobile';

interface ResumeState {
  resume: ResumeData | null;
  rawText: string | null;
  isParsing: boolean;
  parseError: string | null;
  activeSection: string;
  previewMode: PreviewMode;
  templateId: string;
  meta: ResumeMeta;
  detectedField: FieldCategory | null;
}

interface ResumeActions {
  setResume: (resume: ResumeData | null) => void;
  setRawText: (text: string | null) => void;
  setParsing: (isParsing: boolean) => void;
  setParseError: (error: string | null) => void;
  setActiveSection: (section: string) => void;
  setPreviewMode: (mode: PreviewMode) => void;
  setTemplateId: (id: string) => void;
  updateMeta: (partial: Partial<ResumeMeta>) => void;
  updateSection: <K extends keyof ResumeData>(section: K, data: ResumeData[K]) => void;
  addSectionItem: <K extends keyof ResumeData>(section: K, item: unknown) => void;
  removeSectionItem: <K extends keyof ResumeData>(section: K, index: number) => void;
  reorderSectionItems: <K extends keyof ResumeData>(
    section: K,
    fromIndex: number,
    toIndex: number,
  ) => void;
  detectField: (field: FieldCategory | null) => void;
  reset: () => void;
}

type ResumeStore = ResumeState & ResumeActions;

// ── Initial state ──

const initialState: ResumeState = {
  resume: null,
  rawText: null,
  isParsing: false,
  parseError: null,
  activeSection: 'basics',
  previewMode: 'desktop',
  templateId: 'archive',
  meta: DEFAULT_META,
  detectedField: null,
};

// ── Store ──

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set) => ({
      ...initialState,

      setResume: (resume) =>
        set((state) => {
          const nextMeta = resume?.meta ?? state.meta
          return {
            resume,
            parseError: null,
            meta: nextMeta,
            templateId: nextMeta.templateId,
          }
        }),

      setRawText: (rawText) => set({ rawText }),

      setParsing: (isParsing) => set({ isParsing }),

      setParseError: (parseError) => set({ parseError, isParsing: false }),

      setActiveSection: (activeSection) => set({ activeSection }),

      setPreviewMode: (previewMode) => set({ previewMode }),

      setTemplateId: (templateId) =>
        set((state) => ({
          templateId,
          meta: { ...state.meta, templateId },
        })),

      updateMeta: (partial) =>
        set((state) => ({
          templateId: partial.templateId ?? state.templateId,
          meta: { ...state.meta, ...partial },
        })),

      updateSection: (section, data) =>
        set((state) => ({
          resume: state.resume
            ? { ...state.resume, [section]: data }
            : state.resume,
        })),

      addSectionItem: (section, item) =>
        set((state) => {
          if (!state.resume) return state;
          const current = state.resume[section];
          if (Array.isArray(current)) {
            return {
              resume: { ...state.resume, [section]: [...current, item] },
            };
          }
          return state;
        }),

      removeSectionItem: (section, index) =>
        set((state) => {
          if (!state.resume) return state;
          const current = state.resume[section];
          if (Array.isArray(current)) {
            return {
              resume: {
                ...state.resume,
                [section]: current.filter((_, i) => i !== index),
              },
            };
          }
          return state;
        }),

      reorderSectionItems: (section, fromIndex, toIndex) =>
        set((state) => {
          if (!state.resume) return state;
          const current = state.resume[section];
          if (!Array.isArray(current)) return state;
          const updated = [...current];
          const [moved] = updated.splice(fromIndex, 1);
          updated.splice(toIndex, 0, moved);
          return {
            resume: { ...state.resume, [section]: updated },
          };
        }),

      detectField: (detectedField) => set({ detectedField }),

      reset: () => set(initialState),
    }),
    {
      name: 'resume-builder-store',
      storage: createJSONStorage(() => indexedDBStorage),
      partialize: (state) => ({
        resume: state.resume,
        meta: state.meta,
        templateId: state.templateId,
        detectedField: state.detectedField,
      }),
    }
  )
);

// ── Individual hooks ──

export const useResume = () => useResumeStore((s) => s.resume);
export const useRawText = () => useResumeStore((s) => s.rawText);
export const useParsing = () => useResumeStore((s) => s.isParsing);
export const useParseError = () => useResumeStore((s) => s.parseError);
export const useActiveSection = () => useResumeStore((s) => s.activeSection);
export const usePreviewMode = () => useResumeStore((s) => s.previewMode);
export const useTemplateId = () => useResumeStore((s) => s.templateId);
export const useResumeMeta = () => useResumeStore((s) => s.meta);
export const useDetectedField = () => useResumeStore((s) => s.detectedField);
