/**
 * Quantity-kind system: the semantic-category enum (QuantityKind), plus
 * comparison helpers.
 *
 * IO is JSON-and-complex-only by contract: every value on the tool boundary
 * is a self-describing object { re, im, kind } where `kind` is the value of
 * a QuantityKind enum member — the quantity name (frequency, resistance).
 * Under the SI base system a quantity and its unit are one-to-one
 * (frequency ↔ hertz), and this codebase always speaks in quantity names:
 * the code uses `QuantityKind` (TS), the JSON contract uses `kind` as the
 * field with the quantity name as its value; the two always match.
 *
 * All base quantities are always in scope; derived quantities are added
 * when a tool uses them. No strings, no symbols, no prefixes.
 */
/** The semantic category a value belongs to (drives semantics and checks). */
export declare enum QuantityKind {
    Time = "time",
    Length = "length",
    Mass = "mass",
    Current = "current",
    Temperature = "temperature",
    AmountOfSubstance = "amount-of-substance",
    LuminousIntensity = "luminous-intensity",
    Frequency = "frequency",
    Resistance = "resistance",
    Capacitance = "capacitance",
    Inductance = "inductance",
    Voltage = "voltage",
    Power = "power",
    Angle = "angle",
    Pressure = "pressure",
    Energy = "energy",
    Log = "log",
    None = "none"
}
/** The lowercase kind names (derived from the enum, no drift). Pure — usable from the browser. */
export declare const QUANTITY_KIND_NAMES: readonly string[];
/** Pure relative tolerance comparison (no absolute floor). Zero matches zero exactly. */
export declare function isNearlyEqual(a: number, b: number, tol?: number): boolean;
/** Quantity-kind-aware zero check: absolute threshold per kind (engineering floors). */
export declare function isNegligible(value: number, kind: QuantityKind): boolean;
