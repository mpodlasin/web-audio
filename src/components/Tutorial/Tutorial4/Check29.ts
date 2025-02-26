import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that the Triangle Oscillator's frequency parameter is set to exactly 1 Hz.
export default function (audioGraph: SerializedAudioElements) {
    const triangleOscillator = Object.values(audioGraph).find(node => node.type === 'triangle-oscillator');

    return triangleOscillator?.parameters?.frequency?.base === 1;
}
