/**
 * Frequency-domain mathematics: DFT/IDFT, Fourier series of standard
 * periodic waveforms, and window functions. SI base units; plain
 * complex.js values.
 */
import { Complex } from 'complex.js';
/** Standard periodic waveform for Fourier-series expansion. */
export declare enum WaveformKind {
    Square = "square",
    Triangle = "triangle",
    Sawtooth = "sawtooth"
}
/** Spectral window applied before a DFT. */
export declare enum WindowKind {
    None = "none",
    Hann = "hann",
    Hamming = "hamming",
    Blackman = "blackman"
}
/**
 * DFT: X[k] = Σₙ x[n]·e^{−j2πkn/N}. Power-of-two lengths use the radix-2
 * Cooley-Tukey FFT (O(N log N)); other lengths fall back to the direct
 * definition (O(N²)). Both are numerically identical to the definition.
 */
export declare function calcDiscreteFourierTransform(samples: Complex[]): Complex[];
/** IDFT: x[n] = (1/N)·Σₖ X[k]·e^{+j2πkn/N}. The inverse reuses the forward
 *  FFT through conjugation: x = conj(FFT(conj(X)))/N. */
export declare function calcInvDiscreteFourierTransform(spectrum: Complex[]): Complex[];
/**
 * Fourier coefficients of standard odd-symmetric periodic waveforms with
 * peak amplitude `amplitude` (default 1): DC 0, cosine 0, sine per the
 * standard series. Harmonics are 1..harmonics.
 */
export declare function calcFourierSeriesCoeffs(waveform: WaveformKind, harmonics: number, amplitude?: number): {
    dc: number;
    cosine: number[];
    sine: number[];
};
/** Window coefficients for a length-N sequence (N = 1 yields [1]). */
export declare function calcWindowSamples(kind: WindowKind, length: number): number[];
/** Apply window weights to a sample sequence (weight i multiplies sample i). */
export declare function applyWindow(samples: Complex[], weights: number[]): Complex[];
/**
 * Signal statistics: RMS (√mean|x|²), peak |x|, peak-to-peak of the real
 * part, and DC (mean of the real part).
 */
export declare function calcSignalStatistics(samples: Complex[]): {
    rms: number;
    peak: number;
    peakToPeak: number;
    dc: number;
};
/**
 * Signal analysis: statistics plus the windowed spectrum in one call.
 * Composes calcSignalStatistics, the window and the FFT (all existing
 * primitives).
 */
export declare function calcSignalAnalysis(samples: Complex[], window: WindowKind): {
    rms: number;
    peak: number;
    peakToPeak: number;
    dc: number;
    spectrum: Complex[];
};
