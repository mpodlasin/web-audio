import type { SerializedAudioElements } from '../../../audio/serialized';

// Verifies that the Sine Oscillator's frequency is set to 110 Hz.
export default function (audioGraph: SerializedAudioElements) {
    const sineOscillator = Object.values(audioGraph).find((node) => node.type === 'sine-oscillator');
    return sineOscillator?.parameters?.frequency?.base === 110;
}
