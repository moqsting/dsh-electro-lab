/**
 * Circuit mathematics. All functions operate on SI base units (Hz, Ω, F, H,
 * V, A, s) and return plain numbers / complex.js values; engineering
 * presentation is the tools' job.
 *
 * Declaration order: enums, then types, then module-private helpers, then
 * public functions grouped by concept.
 */
import { Complex } from "complex.js";
/** Circuit topology mode. */
export declare enum CircuitMode {
    Series = "series",
    Parallel = "parallel"
}
/** Switching state mode. */
export declare enum SwitchingMode {
    Charge = "charge",
    Discharge = "discharge"
}
/** Lumped element kind. */
export declare enum ElementKind {
    Resistance = "resistance",
    Inductance = "inductance",
    Capacitance = "capacitance"
}
/** How an element connects into a path. */
export declare enum Connection {
    Series = "series",
    Shunt = "shunt"
}
/** Second-order damping regime. */
export declare enum TransientDamping {
    Underdamped = "underdamped",
    Critical = "critical",
    Overdamped = "overdamped"
}
/** A network node: one lumped element, or a nested series/parallel group. */
export type NetworkElement = {
    kind: ElementKind;
    value: number;
} | {
    topology: CircuitMode;
    elements: NetworkElement[];
};
/** Series combination: Z = Σ Zi. */
export declare function combineSeriesImpedances(impedances: readonly Complex[]): Complex;
/** Parallel combination: 1/Z = Σ 1/Zi. */
export declare function combineParallelImpedances(impedances: readonly Complex[]): Complex;
/** Total impedance of a (possibly nested) network at a frequency. */
export declare function calcNetworkImpedance(node: NetworkElement, frequency: number): Complex;
/** Series resonance: resonantFrequency = 1/(2π√(LC)). Q and bandwidth need R (mode-aware). */
export declare function calcResonance(inductance: number, capacitance: number, resistance?: number, mode?: CircuitMode): {
    resonantFrequency: number;
    qualityFactor?: number;
    bandwidth?: number;
};
/** AC power from RMS values: S = V·I, P = S·cosφ, Q = S·sinφ, pf = cosφ.
 *  The phase angle is in radians (SI). */
export declare function calcAcPower(rmsVoltage: number, rmsCurrent: number, phaseAngle?: number): {
    apparent: number;
    real: number;
    reactive: number;
    powerFactor: number;
};
/**
 * RC transient at time points (first order): capacitor voltage (state) and
 * loop current. mode charge: v(t) = Vs(1−e^(−t/τ)); discharge: v(t) = V0·e^(−t/τ).
 * Current: charge = (Vs − v)/R, discharge = v/R. τ = RC.
 */
export declare function calcRcTransientSeries(mode: SwitchingMode, sourceVoltage: number, initialVoltage: number, resistance: number, capacitance: number, times: readonly number[]): {
    points: Array<{
        time: number;
        voltage: number;
        current: number;
        timeConstant: number;
    }>;
    timeConstant: number;
};
/**
 * RL transient at time points (first order): inductor current (state) and
 * inductor voltage. mode charge: i(t) = (Vs/R)(1−e^(−t/τ)); discharge:
 * i(t) = I0·e^(−t/τ). Inductor voltage: charge = Vs·e^(−t/τ),
 * discharge = I0·R·e^(−t/τ). τ = L/R.
 */
export declare function calcRlTransientSeries(mode: SwitchingMode, sourceVoltage: number, initialCurrent: number, resistance: number, inductance: number, times: readonly number[]): {
    points: Array<{
        time: number;
        current: number;
        voltage: number;
        timeConstant: number;
    }>;
    timeConstant: number;
};
/**
 * Series-RLC transient at time points (second order): capacitor voltage and
 * loop current, closed form by damping regime (α = R/2L, ω₀ = 1/√(LC),
 * ζ = α/ω₀). mode charge drives toward sourceVoltage, discharge toward zero;
 * both initial conditions (capacitor voltage, inductor current) apply.
 */
export declare function calcRlcTransientSeries(mode: SwitchingMode, sourceVoltage: number, initialVoltage: number, initialCurrent: number, resistance: number, capacitance: number, inductance: number, times: readonly number[]): {
    points: Array<{
        time: number;
        voltage: number;
        current: number;
    }>;
    alpha: number;
    omega0: number;
    dampingRatio: number;
    damping: TransientDamping;
};
