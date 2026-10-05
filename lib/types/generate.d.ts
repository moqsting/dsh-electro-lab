/**
 * Article generation for the records page: the model (host-side LLM call)
 * turns a settled record into a self-contained solution article in the
 * requested format, which the host then writes to disk. This module builds
 * the prompt and — for LaTeX — the document shell around the model's body;
 * the LLM call and file writing live in index.ts.
 *
 * The generation call has its own independent context — only this prompt is
 * visible to the model — so the record is presented as plain facts, WITHOUT
 * the bracketed record-section labels (question/analysis/tool calls/results/
 * answer), which would steer the model toward a sectioned five-part output.
 */
/** One successful call row of the trace, flattened for the prompt. */
export interface GenerationCall {
    callId: string;
    name: string;
    arguments: string;
}
/** One successful result row of the trace, flattened for the prompt. */
export interface GenerationResult {
    callId: string;
    content: string;
    error?: {
        name: string;
        code: string;
    };
}
/** The record facts the generation prompt is built from (engine trace → this shape). */
export interface Record {
    id: string;
    startedAt?: number;
    settledAt?: number;
    question: string;
    analyse: string;
    answer: string;
    calls: GenerationCall[];
    results: GenerationResult[];
}
/** System + user prompt pair for one record. */
export interface GeneratePrompt {
    system: string;
    user: string;
}
/** Output formats: Markdown (as before) and plain LaTeX source (.tex, never compiled by the host). */
export declare enum ArticleFormat {
    Markdown = "markdown",
    Latex = "latex"
}
/**
 * Explicit article languages: Auto keeps the current behavior (write in the
 * language of the question); anything else forces the article language.
 * Template-ready: ZhCN and En ship with LaTeX document shells today; further
 * scripts (ja/ko/cyrillic/…) only need a template row in latexDocumentShell
 * plus a probe in resolveTemplateLanguage.
 */
export declare enum ArticleLanguage {
    Auto = "auto",
    ZhCN = "zh-CN",
    En = "en"
}
/** The document-shell languages that ship a LaTeX template (resolved from ArticleLanguage). */
export declare enum TemplateLanguage {
    ZhCN = "zh-CN",
    En = "en"
}
/** Generation job phases, reported through /generate-progress (shared wire codes host ↔ client). */
export declare enum GenerationPhase {
    Prepare = "prepare",
    Generate = "generate",
    Write = "write",
    Compile = "compile"
}
/** The article-language face of a template language (same wire values, distinct enum types). */
export declare function templateLanguageToArticleLanguage(templateLanguage: TemplateLanguage): ArticleLanguage;
/** The article-language sentence pinned in the system prompt. */
export declare function articleLanguageInstruction(language: ArticleLanguage): string;
/**
 * Resolve the article language for a DOCUMENT SHELL (LaTeX preamble), which
 * must be fixed before generation: Auto probes the question text. Only
 * en/zh-CN ship templates today; the probe is the single extension point for
 * other scripts (hiragana → ja + jlreq, hangul → ko + kotex, cyrillic → ru…).
 */
export declare function resolveTemplateLanguage(language: ArticleLanguage, question: string): TemplateLanguage;
/** Force the file name to end with the format's extension (.md / .tex). */
export declare function normalizeFileName(fileName: string, format: ArticleFormat): string;
/**
 * The generation prompt: the article reads like a proper technical article —
 * section headings, formulas and calculations on their own formatted lines —
 * not a chat reply and not the record's own five-section layout. The two
 * formats get format-specific instructions (Markdown headings vs LaTeX body
 * with a host-provided shell); the shared rules above stay common.
 */
export declare function buildArticlePrompt(record: Record, language?: ArticleLanguage, format?: ArticleFormat): GeneratePrompt;
/** Result of the LaTeX body check. */
type SanitizeResult = {
    ok: true;
    body: string;
} | {
    ok: false;
    error: string;
};
/**
 * Make a model-generated LaTeX body safe to compile:
 * - reject preamble/restructuring commands (injection) and mismatched braces/dollars,
 * - escape bare % (a comment starter in EVERY TeX mode — "50 %" would swallow the rest of the line).
 */
export declare function sanitizeLatexBody(body: string): SanitizeResult;
/**
 * The document shell around a model body. Engine is XeLaTeX for every
 * language (Unicode-native; ctex needs it); template rows are the extension
 * point for further languages (jlreq, kotex, …). The H1-equivalent title and
 * author are fixed by the host — never by the model — and carry no date.
 *
 * unicode-math switches math to scalable OpenType fonts (Latin Modern Math),
 * which removes the fixed-size cmex font entirely — without it, ctexart's
 * zh-CN size ladder requests odd math sizes (e.g. 10.53937pt) and LaTeX emits
 * "Font shape OMX/cmex/m/n not available" substitution warnings.
 */
export declare function latexDocumentShell(templateLanguage: TemplateLanguage): string;
/**
 * Full, compilable LaTeX document from a model body: sanitize first, then wrap
 * in the shell for the resolved template language.
 */
export declare function buildLatexDocument(body: string, templateLanguage: TemplateLanguage): {
    ok: true;
    text: string;
} | {
    ok: false;
    error: string;
};
export {};
