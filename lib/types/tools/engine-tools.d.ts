/**
 * Engine tool surface: the set / get / call primitives, solver_info
 * introspection and the record markers.
 * Thin wrapper: arguments pass schema validation then go to the engine shell; a uniform receipt (ok) is returned.
 */
import type { ToolRuntime } from '@deepseek-ai/dsh-tools';
import { defineJsonTool } from '../tool.ts';
import type { Engine } from '../engine/engine.ts';
declare module '@deepseek-ai/cordis' {
    interface Context {
        tools: ToolRuntime;
    }
}
/** Factory: binds the global single-engine instance and produces LLM-visible tool definitions. */
export declare function createEngineTools(engine: Engine): Array<ReturnType<typeof defineJsonTool>>;
