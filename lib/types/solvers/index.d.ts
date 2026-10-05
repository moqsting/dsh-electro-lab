/**
 * Kernel solver collection: all math/* kernels are registered via register.
 * The per-domain files were migrated from the legacy tool modules; once aggregated, the host registers them into the engine registry.
 */
import type { SolverDef } from '../engine/registry.ts';
export declare function registerKernelSolvers(): SolverDef[];
