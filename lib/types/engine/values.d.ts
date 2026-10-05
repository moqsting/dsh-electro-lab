/**
 * Value universe (engine value universe).
 *
 * Typed values: {type, value, kind, variant?, prefix?}. kind is part of a
 * quantity type; a missing variant/prefix field means the base representation / multiplier of 1;
 * vocabularies are always ASCII short words; symbols serve display mapping only. Declaration specs
 * (parameters/returns isomorphic, closed) and typed values share the validation
 * and conversion here.
 */
import { QuantityKind } from '../math/quantity-kind.ts';
export type Kind = QuantityKind;
/** Writable typed value (number/complex carry a kind; string/boolean/array/object carry none). */
export type TypedValue = {
    type: 'number';
    value: number;
    kind: Kind;
    variant?: string;
    prefix?: string;
} | {
    type: 'complex';
    value: {
        re: number;
        im: number;
    } | {
        mag: number;
        ang: number;
    };
    kind: Kind;
    variant?: string;
    prefix?: string;
} | {
    type: 'string';
    value: string;
} | {
    type: 'boolean';
    value: boolean;
} | {
    type: 'array';
    value: TypedValue[];
} | {
    type: 'object';
    value: Record<string, TypedValue>;
};
/**
 * A slot reference: a first-class call-argument value that names a slot by
 * its full path ("R" or "res.points.0"). It is NOT part of TypedValue — it
 * never enters the variable table, storage or external results; the engine
 * expands it at the call boundary before spec validation.
 */
export interface SlotValue {
    type: 'slot';
    value: string;
}
/** Shape guard for slot references (call arguments and set values). */
export declare function isSlotValue(raw: unknown): raw is SlotValue;
/**
 * Declaration spec: a quantity leaf names the set a value must belong to. `complex` accepts a real too —
 * ℝ ⊂ ℂ is a one-way inclusion, so widening is implicit and narrowing never is: a `number` leaf rejects a
 * complex payload instead of quietly taking its real part.
 */
export type Spec = {
    type: 'number';
    kind: Kind;
} | {
    type: 'complex';
    kind: Kind;
} | {
    type: 'string';
    enum?: readonly string[];
} | {
    type: 'boolean';
} | {
    type: 'array';
    items: Spec;
} | {
    type: 'object';
    fields: Record<string, Spec>;
};
/** Solver parameter entry: spec + optional flag (returns object fields use plain Spec). */
export type ParamSpec = Spec & {
    optional?: boolean;
};
export type Parameters = Record<string, ParamSpec>;
export declare const PREFIX_SCALES: Readonly<Record<string, number>>;
/** Display symbol mapping (not part of the value universe; display only). */
export declare const PREFIX_SYMBOLS: Readonly<Record<string, string>>;
/** A variant: value conversion relative to the SI base (factor multiply + offset add). */
export interface VariantInfo {
    factor: number;
    offset: number;
}
/** kind → variant word → conversion. No table = base representation only (variant keys must not appear). */
export declare const VARIANT_TABLE: Readonly<Partial<Record<Kind, Readonly<Record<string, VariantInfo>>>>>;
/** Check whether a kind word is valid. */
export declare function isKind(value: string): value is Kind;
/**
 * Validate a typed value (shape/word-table checks at set-input time). Pass returns void;
 * failure returns a human-readable error message. Values are validated by shape and word table only, with no cross-kind judgement.
 */
export declare function validateValue(value: unknown): string | undefined;
/**
 * Convert number/complex values to the SI base + rect normalization (call boundary).
 * Arrays and objects recurse: a quantity nested in one is converted like a top-level one, so
 * `resolved` describes what the run really used and a kernel never sees a prefix or a variant word.
 */
export declare function toCanonical(value: TypedValue): TypedValue;
/** Validate that a typed value matches a declaration spec (quantity kinds must match; objects are closed). */
export declare function validateAgainstSpec(spec: Spec, value: TypedValue, path: string): string | undefined;
/**
 * Convert kernel-native output (number / {re,im} / {mag,ang} / string / boolean / array / object)
 * into a typed value per its returns spec (result shaping). Structural mismatch throws.
 */
export declare function fromNative(spec: Spec, raw: unknown, path: string): TypedValue;
/** Read a value out of a slot by dot path (path only walks object fields). */
export declare function refPath(value: TypedValue, path: string | undefined): TypedValue;
