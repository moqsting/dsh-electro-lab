/**
 * Noise mathematics: thermal noise, quantization SNR, and cascaded
 * noise-figure (Friis). SI base units; dB values are plain numbers.
 */
/** Thermal noise power in watts: P = k·T·B. */
export declare function calcThermalNoisePower(temperatureKelvin: number, bandwidth: number): number;
/** Ideal quantization SNR in dB: SNR = 6.02·N + 1.76. */
export declare function calcQuantizationSnr(bits: number): number;
/**
 * Cascaded noise figure (Friis) in dB:
 *   F = F₁ + (F₂−1)/G₁ + (F₃−1)/(G₁G₂) + …
 * Inputs are dB; gains are linear-power stage gains.
 */
export declare function calcCascadeNoiseFigure(noiseFigureDb: number[], gainDb: number[]): number;
