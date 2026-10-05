import { GenerationPhase, type ArticleFormat, type ArticleLanguage } from '../generate.ts';
/** One generation job snapshot, mirroring the host's /generate-progress body. */
export interface GenProgress {
    percent: number;
    phase: GenerationPhase;
    status: 'running' | 'done' | 'error';
    path?: string;
    pdfPath?: string;
    compileError?: string;
    error?: string;
}
/** What a generation setup submits to the host. */
export interface GenerateRequest {
    recordId: string;
    format: ArticleFormat;
    language: ArticleLanguage;
    directory: string;
    fileName: string;
    /** LaTeX only: ask the host to compile the source to PDF after writing it. */
    compile: boolean;
}
interface GenState {
    progress: GenProgress | null;
    minimized: boolean;
    elapsed: number;
}
/** Subscribe a component to the generation state (useSyncExternalStore). */
export declare function useGenState(): GenState;
/** Start a generation job and poll it to completion; safe to call from any page. */
export declare function startGenerate(request: GenerateRequest): void;
/** Collapse the progress dialog into the corner pill; the job keeps running. */
export declare function setMinimized(minimized: boolean): void;
/** Abort a running job and close the progress UI. */
export declare function cancelGenerate(): void;
/** Dismiss a settled progress (done or error) and reset the UI. */
export declare function clearProgress(): void;
export {};
