import type { SerializedAudioElements } from '../../../audio/serialized';

// Verifies that the Sine Oscillator is connected to the frequency parameter of the Triangle Oscillator.
export default function (audioGraph: SerializedAudioElements) {
    const values = Object.values(audioGraph);
    const entries = Object.entries(audioGraph);

    const sineOscillator = values.find((node) => node.type === 'sine-oscillator');
    const triangleOscillator = values.find((node) => node.type === 'triangle-oscillator');
    const sineOscillatorId = entries.find((entry) => entry[1] === sineOscillator)?.[0];

    const sineIsConnectedToTriangleFreq =
        triangleOscillator?.parameters?.frequency?.inputs?.some((input) => input.id === sineOscillatorId) ?? false;

    return sineOscillator && triangleOscillator && sineIsConnectedToTriangleFreq;
}
