/**
 * JSON IO contract for tool values: every quantity crossing the tool
 * boundary is a complex number in SI base units, and a quantity and its SI
 * unit are one-to-one, so the kind IS the unit category — the single term
 * "kind" is used throughout the contract. Kinds are pinned by the static
 * tool definitions (parameter schemas, outputs); an input payload does not
 * need to repeat its kind and no kind check is applied on unwrap.
 *
 * INPUT — a value parameter accepts a bare number (a real value), a compact
 * complex object ({re, im} for rect, or {mag, ang} for polar — angles are
 * radians, SI), or the legacy full forms:
 *   rect  { form: Form.Rect,  re, im }     (kind optional)
 *   polar { form: Form.Polar, mag, ang }   (kind optional, angles radians)
 *
 * OUTPUT — a complete snapshot, both projections always present:
 *   { re, im, kind, mag, ang }
 * The output feeds straight back into any input (re/im match the rect
 * branch even with the extra mag/ang/kind keys).
 */
import { Complex } from 'complex.js';
import { QuantityKind } from './quantity-kind.ts';
/**
 * What a decibel ratio is taken over. The 10 vs 20 factor comes from the
 * nature of the quantity: a linear quantity (power, energy, intensity) has
 * its energy in the quantity itself → 10·log10; a quadratic quantity
 * (voltage, current, pressure — any amplitude whose energy is the square)
 * → 20·log10. Named generically so it applies outside electronics too.
 */
export declare enum RatioKind {
    Linear = "linear",
    Quadratic = "quadratic"
}
/** Complex form discriminator (wire value = lowercase string). */
export declare enum Form {
    Rect = "rect",
    Polar = "polar"
}
/** Rectangular input form. */
export type RectValue = {
    form: Form.Rect;
    re: number;
    im: number;
    kind: QuantityKind;
};
/** Polar input form with the phase angle in radians (SI). */
export type PolarRadiansValue = {
    form: Form.Polar;
    mag: number;
    ang: number;
    kind: QuantityKind;
};
/** Any accepted input value on the tool boundary. */
export type ComplexInput = RectValue | PolarRadiansValue;
/** A value that can be unwrapped: LLM input forms, or a tool output
 *  snapshot (which carries re/im and no discriminator — it IS a rect value). */
export type ComplexValue = ComplexInput | ComplexOutput;
/** Tool output: the complete snapshot. A plain object type alias so it
 *  stays assignable to JsonValue in tool outputs (interfaces and
 *  intersections lose the implicit index signature). */
export type ComplexOutput = {
    re: number;
    im: number;
    kind: QuantityKind;
    mag: number;
    ang: number;
};
/**
 * Any payload shape a validated value parameter can carry: a bare number
 * (real value) or the compact complex forms {re, im} / {mag, ang} with ang in
 * radians. Output snapshots and legacy {form,…} objects match structurally
 * (they contain re/im or mag/ang); their extra keys are ignored — the payload
 * never carries a semantic kind, the schema pins it per parameter.
 */
export type ValuePayload = number | {
    re: number;
    im: number;
} | {
    mag: number;
    ang: number;
};
/** Unwrap to a complex.js value from any accepted payload shape. */
export declare function toComplex(value: ValuePayload): Complex;
/** Unwrap to a real number: the imaginary part must be negligible. */
export declare function toScalar(value: ValuePayload): number;
/** Tool output for a complex result: the complete snapshot. */
export declare function serializeComplex(value: Complex, kind: QuantityKind): ComplexOutput;
/** Convenience: tool output for a real result. */
export declare function serializeReal(value: number, kind: QuantityKind): ComplexOutput;
/** Every supported unit, grouped by family. */
export declare enum ConvertUnit {
    Celsius = "celsius",
    Fahrenheit = "fahrenheit",
    Kelvin = "kelvin",
    Bar = "bar",
    Psi = "psi",
    Atm = "atm",
    Pascal = "pascal",
    Calorie = "calorie",
    Kilocalorie = "kilocalorie",
    WattHour = "watthour",
    KilowattHour = "kilowatthour",
    Joule = "joule",
    Horsepower = "horsepower",
    Watt = "watt",
    Inch = "inch",
    Foot = "foot",
    Yard = "yard",
    Mile = "mile",
    Metre = "metre",
    Pound = "pound",
    Ounce = "ounce",
    Kilogram = "kilogram",
    Degree = "degree",
    Radian = "radian",
    Ratio = "ratio",
    Db = "db"
}
export type TemperatureUnit = ConvertUnit.Celsius | ConvertUnit.Fahrenheit | ConvertUnit.Kelvin;
export type PressureUnit = ConvertUnit.Bar | ConvertUnit.Psi | ConvertUnit.Atm | ConvertUnit.Pascal;
export type EnergyUnit = ConvertUnit.Calorie | ConvertUnit.Kilocalorie | ConvertUnit.WattHour | ConvertUnit.KilowattHour | ConvertUnit.Joule;
export type PowerUnit = ConvertUnit.Horsepower | ConvertUnit.Watt;
export type LengthUnit = ConvertUnit.Inch | ConvertUnit.Foot | ConvertUnit.Yard | ConvertUnit.Mile | ConvertUnit.Metre;
export type MassUnit = ConvertUnit.Pound | ConvertUnit.Ounce | ConvertUnit.Kilogram;
export type LogUnit = ConvertUnit.Ratio | ConvertUnit.Db;
/** Temperature is affine: convert via kelvin; requires a real value. */
export declare function convertTemperature(value: number | Complex, from: TemperatureUnit, to: TemperatureUnit): Complex;
/** Pressure: linear, complex values scale both components. */
export declare function convertPressure(value: number | Complex, from: PressureUnit, to: PressureUnit): Complex;
/** Energy: linear, complex values scale both components. */
export declare function convertEnergy(value: number | Complex, from: EnergyUnit, to: EnergyUnit): Complex;
/** Power: linear, complex values scale both components. */
export declare function convertPower(value: number | Complex, from: PowerUnit, to: PowerUnit): Complex;
/** Length: linear, complex values scale both components. */
export declare function convertLength(value: number | Complex, from: LengthUnit, to: LengthUnit): Complex;
/** Mass: linear, complex values scale both components. */
export declare function convertMass(value: number | Complex, from: MassUnit, to: MassUnit): Complex;
/**
 * Angle: degrees → radians. Angles are radians everywhere on the tool
 * boundary, so this is the only angle conversion that exists — a radian
 * value needs no conversion (identity), and the target is always radians.
 * Linear, so complex values scale both components.
 */
export declare function convertAngle(value: number | Complex): Complex;
/**
 * Log scale: ratio ↔ dB. Power ratios use 10·log10, voltage ratios
 * 20·log10; requires a real value and a kind.
 */
export declare function convertLogValue(value: number | Complex, from: LogUnit, to: LogUnit, kind: RatioKind): Complex;
