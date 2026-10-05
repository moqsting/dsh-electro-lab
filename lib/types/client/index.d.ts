/**
 * Client half of DSH ElectroLab: the ElectroLab records panel.
 *
 * Registers two pieces of UI:
 * - a nav entry in the sidebar rail (DOM-mounted beside the SSH, task-board
 *   and skills entries — the product has no slot for that rail) that toggles
 * - the panel mounted over the center column (see panel.tsx).
 *
 * The UI dictionaries are registered into the DSH locale service, so the
 * panel follows the user's chosen language (see locales.ts).
 */
import type { Context } from '@deepseek-ai/cordis';
/** The locale service the UI copy and language subscriptions ride on. */
interface LocaleLike {
    register(namespace: string, dicts: unknown): () => void;
    getSnapshot(): {
        active: string;
        revision: number;
    };
    subscribe(solver: () => void): () => void;
}
declare module '@deepseek-ai/cordis' {
    interface Context {
        locale: LocaleLike;
    }
}
/** Required services: the locale registry for the dual-language UI copy. */
export declare const inject: string[];
export declare function apply(ctx: Context): void;
export {};
