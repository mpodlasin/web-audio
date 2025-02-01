import type { SerializedAudioElements } from '../../../audio/serialized';

// Verifies that the Lowpass Filter is inserted between the Triangle Oscillator and the Gain node,
// and that the Triangle Oscillator is no longer directly connected to the Gain node.
export default function (audioGraph: SerializedAudioElements) {
    const values = Object.values(audioGraph);
    const entries = Object.entries(audioGraph);

    const triangleOscillator = values.find((node) => node.type === 'triangle-oscillator');
    const lowpassFilter = values.find((node) => node.type === 'lowpass-filter');
    const gainNode = values.find((node) => node.type === 'gain');

    const triangleOscillatorId = entries.find((entry) => entry[1] === triangleOscillator)?.[0];
    const lowpassFilterId = entries.find((entry) => entry[1] === lowpassFilter)?.[0];

    // Check if Triangle Oscillator is connected to Lowpass Filter
    const triangleIsConnectedToFilter =
        lowpassFilter?.inputs?.some((input) => input.id === triangleOscillatorId) ?? false;

    // Check if Lowpass Filter is connected to Gain
    const filterIsConnectedToGain =
        gainNode?.inputs?.some((input) => input.id === lowpassFilterId) ?? false;

    // Check if Triangle Oscillator is NOT directly connected to Gain
    const triangleIsNotConnectedToGain =
        !(gainNode?.inputs?.some((input) => input.id === triangleOscillatorId) ?? false);

    return (
        triangleOscillator &&
        lowpassFilter &&
        gainNode &&
        triangleIsConnectedToFilter &&
        filterIsConnectedToGain &&
        triangleIsNotConnectedToGain
    );
}
