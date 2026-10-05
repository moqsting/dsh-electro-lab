/**
 * Polynomial arithmetic center: shared coefficient operations used by the
 * expression engine, the transfer-function layer and the matching/root
 * tools. Coefficients are complex numbers in DESCENDING power order
 * [aₙ … a₁, a₀] everywhere on the API; long division reverses internally
 * to ascending order (index = power) for a clean elimination loop.
 */
import { Complex } from 'complex.js';
/** A polynomial: complex coefficients in DESCENDING power order [aₙ … a₁, a₀]. */
export type Polynomial = Complex[];
/** Trim leading zero coefficients, keeping at least one entry. */
export declare function trimPolynomial(coefficients: Polynomial): Polynomial;
/** A polynomial is zero when every coefficient vanishes. */
export declare function isZeroPolynomial(coefficients: Polynomial): boolean;
/** Align lengths, then add element-wise. */
export declare function addPolynomials(left: Polynomial, right: Polynomial): Polynomial;
/** Multiplication as coefficient convolution. */
export declare function convolvePolynomials(left: Polynomial, right: Polynomial): Polynomial;
/**
 * Polynomial long division, descending coefficient order (the standard
 * across this module): dividend = quotient · divisor + remainder. The
 * division itself runs in ascending order (index = power) so the highest
 * term is eliminated cleanly each round; both results are polynomials —
 * never empty, the zero polynomial is [0].
 */
export declare function dividePolynomials(dividend: Polynomial, divisor: Polynomial): {
    quotient: Polynomial;
    remainder: Polynomial;
};
/** Polynomial GCD by the Euclidean algorithm, made monic. */
export declare function findPolyGcd(left: Polynomial, right: Polynomial): Polynomial;
/** Horner evaluation of a descending coefficient array. */
export declare function evaluatePolynomial(coefficients: Polynomial, point: Complex): Complex;
/** Zeros (numerator roots) and poles (denominator roots) of a ratio. */
export declare function findPolesZeros(numerator: Polynomial, denominator: Polynomial): {
    zeros: Complex[];
    poles: Complex[];
};
/**
 * Power-series expansion of N(z)/D(z) about z⁻¹: the first `count` terms of
 * H(z) = Σ h[n]·z⁻ⁿ. In the z domain these coefficients ARE the impulse
 * response h[n]. With w = 1/z, H(1/w) = w^(degD−degN)·N(w)/D(w) where the
 * descending coefficient arrays double as ascending w polynomials (the
 * reversal cancels); the ratio is expanded by the coefficient recurrence
 * f[k] = (n[k] − Σᵢ₌₁ d[i]·f[k−i])/d[0], then shifted by degD−degN.
 */
export declare function expandPowerSeries(numerator: Polynomial, denominator: Polynomial, count: number): Complex[];
/**
 * Durand-Kerner (Weierstrass) iteration for all roots of a descending
 * coefficient array. Returns [] for constants; non-monic input is
 * normalized internally. Convergence is quadratic for simple roots; the
 * iteration stops after MAX_ITERATIONS and returns the best estimate.
 */
export declare function findPolyRoots(coefficients: Polynomial): Complex[];
