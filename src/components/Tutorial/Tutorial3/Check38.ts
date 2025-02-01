import type { SerializedAudioElements } from '../../../audio/serialized';

// Verifies that the multiplication value on the connection between the Sine and Triangle Oscillators is set to 250.
export default function (audioGraph: SerializedAudioElements) {
    const values = Object.values(audioGraph);
    const entries = Object.entries(audioGraph);

    const sineOscillator = values.find((node) => node.type === 'sine-oscillator');
    const triangleOscillator = values.find((node) => node.type === 'triangle-oscillator');
    const sineOscillatorId = entries.find((entry) => entry[1] === sineOscillator)?.[0];

    // Check if Sine Oscillator is connected to Triangle Oscillator with multiplication set to 250
    const sineIsConnectedWithMult250 =
        triangleOscillator?.parameters?.frequency?.inputs?.some(
            (input) => input.id === sineOscillatorId && input.multiply === 100
        ) ?? false;

    return sineOscillator && triangleOscillator && sineIsConnectedWithMult250;
}
