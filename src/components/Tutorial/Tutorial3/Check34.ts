import type { SerializedAudioElements } from '../../../audio/serialized';

// Verifies that a Sine Oscillator node is created.
export default function (audioGraph: SerializedAudioElements) {
    const sineOscillator = Object.values(audioGraph).find((node) => node.type === 'sine-oscillator');
    return sineOscillator !== undefined;
}
