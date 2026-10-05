/**
 * Smith-chart mathematics. SI base units; plain complex.js values.
 *
 * Declaration order: enums, then types and pure mappings, then public
 * functions grouped by concept (reflection trio, transformer, matching).
 */
import { Complex } from 'complex.js';
/** Which side of a match the network element sits on. */
export declare enum MatchSide {
    Source = "source",
    Load = "load"
}
/** Matching topology. */
export declare enum MatchTopology {
    L = "l",
    Pi = "pi",
    T = "t"
}
/** Role of one element inside a matching network. */
export declare enum ElementRole {
    ShuntSource = "shunt-source",
    Series = "series",
    ShuntLoad = "shunt-load",
    SeriesSource = "series-source",
    SeriesLoad = "series-load"
}
/** Which conjugate solution a matching design represents. */
export declare enum MatchVariant {
    LowPass = "low-pass",
    HighPass = "high-pass"
}
/** One signed reactance in a matching network (positive = inductive). */
export interface MatchElement {
    role: ElementRole;
    reactance: number;
}
/** Reflection coefficient: Γ = (Z − Z0) / (Z + Z0). */
export declare function convertImpedanceToReflection(impedance: Complex, referenceImpedance: number): Complex;
/** VSWR = (1 + |Γ|) / (1 − |Γ|); |Γ| = 1 (open/short) yields Infinity. */
export declare function convertReflectionToVswr(reflectionCoefficient: Complex): number;
/** Return loss in dB: −20·log10(|Γ|). |Γ| = 0 yields +Infinity (no reflection). */
export declare function calcReturnLossDb(reflectionCoefficient: Complex): number;
/** Quarter-wave transformer: Z1 = √(Z0·ZL). ZL must be real and positive. */
export declare function calcQuarterWaveImpedance(lineImpedance: number, loadImpedance: number): number;
/** Inductance (H) for a positive reactance at ω; undefined for a negative one. */
export declare function calcInductanceFromReactance(reactance: number, angularFrequency: number): number | undefined;
/** Capacitance (F) for a negative reactance at ω; undefined for a positive one. */
export declare function calcCapacitanceFromReactance(reactance: number, angularFrequency: number): number | undefined;
/** Design any supported matching topology; 'l' uses the implied Q, 'pi'/'t' need a specified Q. */
export declare function designMatch(topology: MatchTopology, sourceImpedance: number, loadImpedance: number, frequency: number, qualityFactor?: number): {
    topology: MatchTopology;
    qualityFactor: number;
    solutions: Record<MatchVariant, MatchElement[]>;
};
