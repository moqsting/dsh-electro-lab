/**
 * Total harmonic distortion of a sampled signal: the ratio of the summed
 * harmonic energy (bins 2f₀..harmonics·f₀ of the dominant non-DC bin) to the
 * fundamental. The DFT bin magnitudes are used directly — the 2/N factor of
 * the single-sided convention cancels in the ratio. Harmonics alias back
 * (spectral folding): bin index = (order·f₀) mod N, which also makes the
 * result invariant to which of the two mirror peaks is picked as the
 * fundamental. thdDb is 20·log10(thd) (−Infinity when there are no harmonics).
 */
export declare function calcThd(samples: readonly number[], harmonics: number): {
    thd: number;
    thdDb: number;
    fundamental: number;
    harmonicAmplitudes: number[];
};
/**
 * SNR ceiling set by sampling-clock jitter:
 *   SNR = −20·log10(2π·f·tⱼ) dB
 * with signal frequency f and RMS jitter tⱼ. Higher frequency or jitter
 * lowers the ceiling; independent of the quantizer.
 */
export declare function calcJitterSnr(signalFrequency: number, jitter: number): number;
/**
 * ADC noise budget: quantization SNR (6.02·N + 1.76 dB), jitter SNR
 * (−20·log10(2π·f·tⱼ)), and an optional thermal SNR (signal-dependent; the
 * caller supplies it, e.g. from thermal_noise against the signal level).
 * Noise powers add linearly, then the total is converted back to dB and to
 * ENOB: (SNR_total − 1.76)/6.02.
 */
export declare function calcAdcBudget(bits: number, signalFrequency: number, jitter: number, thermalSnrDb?: number): {
    snrQuantizationDb: number;
    snrJitterDb: number;
    snrThermalDb?: number;
    snrTotalDb: number;
    enob: number;
};
