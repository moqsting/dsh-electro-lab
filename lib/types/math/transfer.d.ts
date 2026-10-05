/**
 * System analysis mathematics: transfer functions in ratio form
 * ({ numerator, denominator } descending coefficient arrays, the single
 * storage form), partial-fraction expansion, frequency response, step
 * response, and difference-equation recursion.
 */
import { Complex } from 'complex.js';
import { type Polynomial } from './polynomial.ts';
/** Transform variable of a transfer function. */
export declare enum Variable {
    S = "s",
    Z = "z"
}
/** H(σ) for each point: N(σ)/D(σ) by Horner evaluation. */
export declare function calcTransferResponse(numerator: Polynomial, denominator: Polynomial, points: Complex[]): Complex[];
/**
 * Evaluation points for a frequency sweep: σ = jω in the s domain,
 * σ = e^(jωT) in the z domain (sampleTime required, seconds).
 */
export declare function calcFreqPoints(variable: Variable, frequencies: number[], sampleTime?: number): Complex[];
/**
 * Logarithmically spaced frequency grid from start to end (Hz): the
 * `pointsPerDecade` count is rounded to whole points per decade.
 */
export declare function calcLogarithmicFrequencyGrid(start: number, end: number, pointsPerDecade: number): number[];
/**
 * Bode response: the transfer function sampled on a logarithmic frequency
 * grid, with magnitude in dB and phase in degrees. Composes the grid, the
 * evaluation points and the response (all existing primitives).
 */
export declare function calcBodeResponse(numerator: Polynomial, denominator: Polynomial, variable: Variable, frequencyStart: number, frequencyEnd: number, pointsPerDecade: number, sampleTime?: number): {
    frequencies: number[];
    magnitudesDb: number[];
    phasesDeg: number[];
};
/**
 * Partial-fraction expansion of N(s)/D(s) over the complex plane.
 * Steps: long-divide off any polynomial part (deg N ≥ deg D), find and
 * group the denominator roots, then solve the linear system
 *   N(s) = Σ c·D(s)/(s−p)ᵒʳᵈᵉʳ
 * for the residues — no numerical differentiation, exact for polynomial
 * arithmetic.
 */
export declare function expandPartialFraction(numerator: Polynomial, denominator: Polynomial): {
    polynomial: Polynomial;
    terms: {
        pole: Complex;
        order: number;
        residue: Complex;
    }[];
};
/**
 * Step response values y(t) of H(s) = N(s)/D(s): Y(s) = H(s)/s, expanded
 * by partial fractions, each term c/(s−p)^k inverts to
 * c·t^(k−1)/(k−1)!·e^(pt). Requires deg N ≤ deg D (physically realizable).
 */
export declare function calcStepResponse(numerator: Polynomial, denominator: Polynomial, times: number[]): Complex[];
/**
 * Difference-equation recursion (Laurent a/b convention, the natural
 * form of a digital filter):
 *   y[n] = (Σᵢ bᵢ·x[n−i] − Σⱼ aⱼ·y[n−j]) / a₀
 * Output length equals the input length; past samples are zero.
 */
export declare function solveDifferenceEquation(a: Polynomial, b: Polynomial, input: Complex[]): Complex[];
