import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that the Triangle Oscillator's frequency is set to 55 Hz.
export default function (audioGraph: SerializedAudioElements) {
    const triangleOscillator = Object.values(audioGraph).find(
        (node) => node.type === 'triangle-oscillator'
    );

    const triangleFrequency = triangleOscillator?.parameters?.frequency?.base ?? 0;

    return triangleOscillator && Math.abs(triangleFrequency - 55) < 0.01;
}
