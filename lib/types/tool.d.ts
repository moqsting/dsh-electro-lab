import { type DefineToolOptions, type InferArgs, type ParameterSchemaSpec } from '@deepseek-ai/dsh-tools';
import type { JsonValue, ToolRunContext } from '@deepseek-ai/dsh-tools';
import { QuantityKind, QUANTITY_KIND_NAMES } from './math/quantity-kind.ts';
import { ToolError, ToolErrorCode } from './errors.ts';
/** Re-exported so every caller imports the failure types from one place. */
export { ToolError, ToolErrorCode };
/**
 * Declared result shape of a declared tool (the engine solver's `returns` spec
 * is mapped from this at registration — engine/external-solvers.ts).
 */
export type ToolReturns = 
/** Any JSON (cannot be mapped to a typed spec — an external solver needs an explicit shape). */
{
    type: 'any';
}
/** A plain string passthrough. */
 | {
    type: 'string';
}
/** A plain boolean passthrough. */
 | {
    type: 'boolean';
}
/** A real with its kind: a complex result is refused rather than narrowed. */
 | {
    type: 'number';
    kind: QuantityKind;
}
/** A complex with its kind, either payload form (a real is a legal complex). */
 | {
    type: 'complex';
    kind: QuantityKind;
}
/** A named-fields object; every field declared recursively. */
 | {
    type: 'object';
    fields: Record<string, ToolReturns>;
}
/** A homogeneous array; elements declared recursively. */
 | {
    type: 'array';
    items: ToolReturns;
};
/** Pretty JSON text rendering for the model-facing presentation. */
export declare function renderText(value: JsonValue): Array<{
    type: 'text';
    text: string;
}>;
/**
 * Define a tool whose output is an unconstrained JSON value rendered as
 * pretty text. `execute` may be synchronous; it is wrapped into the async
 * contract the registry expects. The execution context is passed through
 * so orchestrator tools can propagate cancellation and parent tokens.
 */
export declare function defineJsonTool<S extends ParameterSchemaSpec>(options: Omit<DefineToolOptions<S, {
    type: 'json';
}>, 'output' | 'execute'> & {
    execute: (args: InferArgs<S>, exec: ToolRunContext) => JsonValue | Promise<JsonValue>;
}): import("@deepseek-ai/dsh-tools").ToolDefinition;
/** Re-exported for callers that only need the kind list (the pure source is math/quantity-kind). */
export { QUANTITY_KIND_NAMES };
/** Transports a declared solver can be reached over. */
export declare enum DeclarationTransport {
    Http = "http"
}
/**
 * A parameter's settled semantic type, spelled exactly like the returns leaves. A quantity leaf names the
 * set a value must belong to: `complex` takes a real too (ℝ ⊂ ℂ), `number` takes reals only — widening is
 * implicit, narrowing never is.
 */
export declare enum DeclarationParamType {
    /** Reals only: a complex payload is rejected instead of quietly losing its imaginary part. */
    Number = "number",
    /** A real or a complex (bare number, {re,im} or {mag,ang} payloads); kind is a lowercase QuantityKind name. */
    Complex = "complex",
    String = "string",
    Boolean = "boolean",
    Array = "array"
}
/** A parameter of a declaration: one settled semantic type; kind is the semantic payload of a quantity. */
export type DeclarationParamSpec = 
/** A quantity; kind is a lowercase QuantityKind name. */
{
    type: DeclarationParamType.Number | DeclarationParamType.Complex;
    kind: string;
    description?: string;
    required?: boolean;
}
/** A plain string (optionally enum-constrained). */
 | {
    type: DeclarationParamType.String;
    enum?: string[];
    description?: string;
    required?: boolean;
}
/** A plain boolean. */
 | {
    type: DeclarationParamType.Boolean;
    description?: string;
    required?: boolean;
}
/** A homogeneous array of arbitrary length; every element matches the same recursive item spec. */
 | {
    type: DeclarationParamType.Array;
    items: DeclarationParamSpec;
    description?: string;
    required?: boolean;
};
export type DeclarationParameters = Record<string, DeclarationParamSpec>;
/** Shared transport-agnostic declaration fields. */
interface DeclarationBase {
    name: string;
    description: string;
    /** Registers at plugin start when not false (a declaration without the flag defaults to enabled). */
    enabled: boolean;
    parameters: DeclarationParameters;
    /** Explicit result shape — required for registration as an engine solver:
     *  a spec, or null = void. A declaration without it (or with the
     *  unmappable "any" leaf) is kept in the archive but skipped at start. */
    returns?: ToolReturns | null;
    timeoutMs?: number;
}
/**
 * http transport options: the endpoint the host POSTs the typed envelope to.
 * The verb is not a declaration field — typed args travel as a JSON body, so
 * POST is the only verb and the host never negotiates it.
 */
export interface DeclarationHttpOptions {
    url: string;
    headers?: Record<string, string>;
}
/** One declaration. */
export type ToolDeclaration = DeclarationBase & {
    transport: DeclarationTransport.Http;
    transportOptions: DeclarationHttpOptions;
};
/** The external-solver declaration archive (one JSON declaration per line). */
export declare const DECLARATIONS_FILE = "external-solvers.jsonl";
export declare function declarationsPath(home: string): string;
/** All declarations currently stored (enabled or not), in file order. */
export declare function readDeclarations(home: string): ToolDeclaration[];
/** True when a restart is pending for declaration changes to take effect. */
export declare function restartRequired(home: string): boolean;
/** Clear the dirty bit; the host calls this once the solvers are (re)registered at start. */
export declare function clearRestartRequired(home: string): void;
/** Append or update (by name) one declaration; sets the dirty bit. */
export declare function upsertDeclaration(home: string, declaration: ToolDeclaration): void;
/** Delete one declaration by name; sets the dirty bit when something was removed. */
export declare function deleteDeclaration(home: string, name: string): boolean;
/** Validation errors as a list of human-readable messages (empty = valid). */
export declare function validateDeclaration(config: unknown): string[];
