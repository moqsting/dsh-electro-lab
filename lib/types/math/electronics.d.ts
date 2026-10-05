/**
 * Electronics mathematics: op-amp configurations, time constants, voltage
 * dividers and LED series resistors. SI base units; op-amp frequency-domain
 * gains are complex.
 */
import { Complex } from 'complex.js';
/** Inverting amplifier: gain = −Rf/Rin; output = gain·Vin. */
export declare function calcInvertingOpamp(inputVoltage: number, feedbackResistance: number, inputResistance: number): {
    gain: Complex;
    outputVoltage: Complex;
};
/** Non-inverting amplifier: gain = 1 + Rf/Rin; output = gain·Vin. */
export declare function calcNonInvertingOpamp(inputVoltage: number, feedbackResistance: number, inputResistance: number): {
    gain: Complex;
    outputVoltage: Complex;
};
/** Voltage follower: gain = 1; output = input. */
export declare function calcVoltageFollowerOpamp(inputVoltage: number): {
    gain: Complex;
    outputVoltage: Complex;
};
/** Summing amplifier: Vout = −Rf(V₁/R₁ + V₂/R₂). */
export declare function calcSummingOpamp(inputVoltage1: number, inputVoltage2: number, feedbackResistance: number, inputResistance1: number, inputResistance2: number): {
    outputVoltage: Complex;
};
/** Difference amplifier: Vout = (Rf/R1)(V₂−V₁). */
export declare function calcDifferenceOpamp(inputVoltage1: number, inputVoltage2: number, feedbackResistance: number, inputResistance: number): {
    gain: Complex;
    outputVoltage: Complex;
};
/** Integrator: H(jω) = −1/(jωRC); output = gain·Vin. */
export declare function calcIntegratorOpamp(inputVoltage: number, inputResistance: number, capacitance: number, frequency: number): {
    gain: Complex;
    outputVoltage: Complex;
};
/** Differentiator: H(jω) = −jωRC; output = gain·Vin. */
export declare function calcDifferentiatorOpamp(inputVoltage: number, feedbackResistance: number, capacitance: number, frequency: number): {
    gain: Complex;
    outputVoltage: Complex;
};
/**
 * Time constant and cutoff frequency: τ = RC (capacitance given) or
 * τ = L/R (inductance given); exactly one of the two must be provided.
 */
export declare function calcTimeConstant(resistance: number, capacitance?: number, inductance?: number): {
    timeConstant: number;
    cutoffFrequency: number;
};
/**
 * Resistive divider: outputVoltage = Vs·R2/(R1+R2); with a load resistance
 * the divider ratio uses R2∥RL. outputResistance is the Thévenin source
 * resistance R1∥R2.
 */
export declare function calcVoltageDivider(sourceVoltage: number, resistance1: number, resistance2: number, loadResistance?: number): {
    outputVoltage: number;
    unloadedOutputVoltage?: number;
    loadCurrent?: number;
    outputResistance: number;
};
/** LED series resistor: R = (Vs − Vf)/I, with dissipated power P = I²·R. */
export declare function calcLedResistor(sourceVoltage: number, forwardVoltage: number, current: number): {
    resistance: number;
    power: number;
};
