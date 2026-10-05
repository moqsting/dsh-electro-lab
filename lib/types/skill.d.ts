import type { Context } from '@deepseek-ai/cordis';
interface SkillFile {
    name: string;
    description: string;
    whenToUse?: string;
    content: string;
}
/** Parse leading YAML frontmatter (--- delimited, simple `key: value` lines) plus the body. */
export declare function parseSkillFile(text: string): SkillFile;
/** Register every packaged skill; returns one disposer that unregisters all. */
export declare function registerSkills(ctx: Context): () => void;
export {};
