/**
 * String-expression engine: one recursive-descent parser shared by two
 * consumers — evaluate (arithmetic, complex-aware) and collectCoefficients
 * (polynomial expansion about one variable).
 *
 * Grammar (precedence low → high):
 *   expression  := addSub
 *   addSub      := mulDiv (('+' | '-') mulDiv)*
 *   mulDiv      := unary (('*' | '/') unary)*
 *   unary       := ('-' | '+')* power
 *   power       := primary ('^' unary)?        (right-associative)
 *   primary     := number | identifier (call | '(' expr ')')?
 *
 * Numbers: decimal with optional scientific exponent (1e6, 2.5e-3) and an
 * optional imaginary suffix (3+4j, 2i). 'j'/'i' alone is the imaginary unit.
 * Constants: pi, e. Functions: sin cos tan asin acos atan atan2 exp ln log10
 * sqrt abs arg conjugate real imag (atan2(y, x) = angle of x + j·y; real
 * inputs give the standard two-argument arctangent). Everything else is a
 * variable; unbound variables error on evaluation.
 */
import { Complex } from 'complex.js';
import { type Polynomial } from './polynomial.ts';
/**
 * Reduce an expression built from + - * / and integer powers in one variable
 * to a single rational function and return its numerator/denominator
 * coefficients in descending power order, [aₙ … a₁, a₀]. Pure polynomials
 * come back with denominator [1]; negative powers (s^-1), nested divisions
 * and sums of rationals are normalized automatically. Common factors are
 * canceled unless reduce is false. Functions of the variable (sin(x)) and
 * non-integer powers are rejected.
 */
export declare function reduceRational(source: string, variable?: string, reduce?: boolean, parameters?: Record<string, Complex>): {
    numerator: Polynomial;
    denominator: Polynomial;
};
/** Evaluate a string expression; every value is complex (real = im 0). */
export declare function calcExpression(source: string, variables?: Record<string, Complex>): Complex;
