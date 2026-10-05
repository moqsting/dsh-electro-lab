/**
 * Filter mathematics: Butterworth low-pass ladder design.
 *
 * Prototype (equal terminations R, cutoff ωc = 1):
 *   g_k = 2·sin((2k−1)·π/(2n))   for k = 1..n, with g₀ = g_{n+1} = 1
 * Denormalization (impedance R, frequency ωc = 2π·fc):
 *   series inductors:  L_k = R·g_k / ωc
 *   shunt capacitors:  C_k = g_k / (R·ωc)
 * Ladder starts with a series element; roles alternate.
 */
import { Connection, ElementKind } from './circuits.ts';
/** Butterworth low-pass ladder design (equal source/load terminations). */
export declare function designButterworthLowpass(order: number, cutoffFrequency: number, resistance: number): Array<{
    role: Connection;
    kind: ElementKind.Inductance | ElementKind.Capacitance;
    value: number;
}>;
/** Butterworth attenuation at a frequency: 10·log10(1 + (f/fc)^(2n)) dB. */
export declare function calcButterworthAttenuation(order: number, cutoffFrequency: number, frequency: number): number;
