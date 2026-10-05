/**
 * Code-authored declaration manager tools — they live with the other tool
 * modules: `external_solver_add`, `external_solver_update` and
 * `external_solver_delete` edit the declaration archive (external-solvers.jsonl)
 * through src/tool.ts. Every write persists immediately but
 * only registers after a host restart, so each result carries
 * `restartRequired: true`. Reading/using declared tools needs no manager
 * call — registered tools are visible like any other tool.
 *
 * The tools are created per home directory (the plugin's records home),
 * because the archive lives there.
 */
import { defineJsonTool } from '../tool.ts';
/** The three manager tools, bound to one records home. */
export declare function createDeclarationTools(home: string): Array<ReturnType<typeof defineJsonTool>>;
