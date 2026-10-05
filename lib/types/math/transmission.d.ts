/**
 * Transmission-line mathematics: wavelength, coaxial-line characterization,
 * and rise-time/bandwidth conversion. SI base units.
 */
/** Wavelength in meters: λ = c·velocityFactor / f. */
export declare function calcWavelength(frequency: number, velocityFactor?: number): number;
/**
 * Coaxial-line characterization from geometry:
 *   Z₀ = (138/√εr)·log₁₀(D/d)
 *   velocityFactor = 1/√εr
 *   C′ = 1/(vf·c·Z₀), L′ = Z₀/(vf·c)
 */
export declare function calcCoaxialParameters(innerDiameter: number, outerDiameter: number, relativePermittivity: number): {
    impedance: number;
    velocityFactor: number;
    capacitancePerMeter: number;
    inductancePerMeter: number;
};
/** Rise time in seconds from bandwidth: tr ≈ 0.35/BW. */
export declare function calcRiseTimeFromBandwidth(bandwidth: number): number;
/** Bandwidth in Hz from rise time: BW ≈ 0.35/tr. */
export declare function calcBandwidthFromRiseTime(riseTime: number): number;
