import type { TypedValue } from './values.ts';
export interface Slot {
    value: TypedValue;
    rev: number;
}
export declare class VariableTable {
    private slots;
    /** A slot's semantic identity: number/complex use kind; other types use type (string/boolean/array/object). */
    static identity(value: TypedValue): string;
    get(name: string): Slot | undefined;
    has(name: string): boolean;
    /** Write a slot: new slot rev 1; same-identity overwrite rev+1; a different identity is rejected and does not advance. */
    set(name: string, value: TypedValue): Slot;
    /** Delete a slot: idempotent when absent (returns false); returns true when present. */
    delete(name: string): boolean;
    /** All current slots (in insertion order). */
    entries(): Array<[string, Slot]>;
    clear(): void;
}
