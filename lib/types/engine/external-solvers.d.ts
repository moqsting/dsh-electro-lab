/**
 * External solver direct registration: declaration archive row → SolverDef (external block), with no compile/translation layer.
 * parameters/returns use the same spec language; returns is explicit (a spec or null = void);
 * a missing one or an unmappable any → report and skip.
 */
import type { SolverDef } from './registry.ts';
import type { ToolDeclaration } from '../tool.ts';
/** Archive row → SolverDef. Unmappable cases (missing/any returns, bad parameters) return null or throw; the caller warns and skips. */
export declare function compileExternalSolver(declaration: ToolDeclaration): SolverDef | null;
