import type { Parameters } from './values.ts';
import type { DeclarationTransport, DeclarationHttpOptions } from '../tool.ts';
/** An external solver's wiring block: when the engine sees one, it automatically wraps the http executor as its run. */
export interface ExternalBlock {
    transport: DeclarationTransport;
    transportOptions: DeclarationHttpOptions;
    timeoutMs?: number;
}
export interface SolverDef {
    id: string;
    summary: string;
    parameters: Parameters;
    /** null = void (explicit). */
    returns: SpecOrVoid;
    run: (args: Record<string, unknown>) => unknown | Promise<unknown>;
    external?: ExternalBlock;
}
import type { Spec } from './values.ts';
type SpecOrVoid = Spec | null;
export declare class SolverRegistry {
    private solvers;
    register(solver: SolverDef): void;
    get(id: string): SolverDef | undefined;
    require(id: string): SolverDef;
    ids(): string[];
    clear(): void;
}
export type { SpecOrVoid };
