/**
 * Series mathematics: arithmetic series, geometric series (finite and
 * convergent infinite), and natural-number power sums. SI base units;
 * terms are plain real numbers.
 */
/** Power-sum exponent: Σk, Σk² or Σk³ over the first n natural numbers. */
export declare enum PowerSumKind {
    Linear = "linear",
    Square = "square",
    Cube = "cube"
}
/**
 * Arithmetic series: a₁, a₁+d, …, a₁+(n−1)d.
 * Sum = n·(a₁ + aₙ)/2 with last term aₙ = a₁ + (n−1)d.
 */
export declare function calcArithmeticSeries(firstTerm: number, commonDifference: number, count: number): {
    sum: number;
    lastTerm: number;
};
/**
 * Geometric series: a₁, a₁·r, …, a₁·rⁿ⁻¹.
 * Finite: sum = a₁(1−rⁿ)/(1−r) (r = 1 handled separately) with last term
 * a₁·rⁿ⁻¹. Infinite (infinite = true): converges iff |r| < 1 to a₁/(1−r);
 * a diverging infinite series raises an error.
 */
export declare function calcGeometricSeries(firstTerm: number, commonRatio: number, count: number, infinite?: boolean): {
    sum: number;
    lastTerm?: number;
    converges?: boolean;
};
/**
 * Natural-number power sum: Σk = n(n+1)/2, Σk² = n(n+1)(2n+1)/6,
 * Σk³ = [n(n+1)/2]².
 */
export declare function calcPowerSum(power: PowerSumKind, count: number): {
    sum: number;
};
