import { type TypedValue } from './values.ts';
import type { ExternalBlock } from './registry.ts';
/** Run one external call; return the result from the response (may be null; the engine validates it against the solver signature). */
export declare function callExternal(solverId: string, block: ExternalBlock, args: Record<string, TypedValue>): Promise<TypedValue | null>;
