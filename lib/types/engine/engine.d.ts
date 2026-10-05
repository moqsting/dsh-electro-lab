/**
 * Engine.
 * Global singleton: variable table + solver registry + record storage + a single open lifecycle.
 * Primitives (set/get/call) and markers execute through it; every step appends one trace row (with inputs and outputs).
 */
import { ToolErrorCode } from '../errors.ts';
import { VariableTable } from './table.ts';
import { SolverRegistry } from './registry.ts';
import { RecordStore, type IndexRow } from './storage.ts';
export type Receipt = {
    ok: true;
    [key: string]: unknown;
} | {
    ok: false;
    code: ToolErrorCode;
    error: string;
};
export declare class Engine {
    readonly table: VariableTable;
    readonly registry: SolverRegistry;
    readonly store: RecordStore;
    private open;
    constructor(home: string);
    /** Start: clear orphans; if a record with sealedAt null and a body exists, recover it (continue the same file, rebuild the table). */
    start(): void;
    indexRows(): IndexRow[];
    isOpen(): boolean;
    openId(): string | null;
    /** Rebuild engine state: set/call/set-null are applied per row; markers are skipped. */
    private replayInto;
    private nextSeq;
    private requireOpen;
    private trace;
    /** record_question: if open exists, seal it (duplicate-start) then open a new one; the variable table is cleared. */
    markerQuestion(text: string): Receipt;
    markerAnalyse(text: string): Receipt;
    /** record_answer: submit the text and settle; no open record → duplicate-end error record. */
    markerAnswer(text: string): Receipt;
    private sealDuplicateStart;
    opSet(name: string, value: unknown): Receipt;
    opGet(name: string): Receipt;
    /** Inspect one solver: its exact signature from the registry, traced as its own row. */
    opInfo(solverId: string): Receipt;
    opCall(solverId: string, rawArgs: Record<string, unknown> | undefined, target: string | null): Promise<Receipt>;
    private runVoid;
    /** Resolve args: expand slot references + validate typed values + kind/shape checks + conversion (resolved = SI rect endpoint). */
    private resolveArgs;
    /** One argument value: a slot reference ({type: 'slot', value: full path}) or a typed-value literal
     *  whose array items / object fields may themselves be slot references (expanded recursively). */
    private resolveValue;
    /**
     * Expand every slot reference in a value bound for the table or a call: a
     * reference at the top level, or nested as an array item / object field,
     * resolves to the stored typed value (or the field path inside it).
     * References never survive into the table, the trace or kernel arguments.
     * `ctx` labels the receiver in errors ("argument \"times\"" or "set \"B\"").
     */
    private expandSlots;
    /** Run a non-void solver (local run or external transport); shape the result per its returns spec. */
    private execute;
    private validateName;
    private failure;
}
