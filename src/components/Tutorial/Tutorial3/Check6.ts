import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that a Gain node is inserted between the Triangle Oscillator and the Output node,
// and ensures there is no direct connection between the Triangle Oscillator and the Output node.
export default function (audioGraph: SerializedAudioElements) {
    const values = Object.values(audioGraph);
    const entries = Object.entries(audioGraph);

    const triangleOscillator = values.find((node) => node.type === 'triangle-oscillator');
    const gainNode = values.find((node) => node.type === 'gain');
    const outputNode = values.find((node) => node.type === 'destination');

    const triangleOscillatorId = entries.find((entry) => entry[1] === triangleOscillator)?.[0];
    const gainNodeId = entries.find((entry) => entry[1] === gainNode)?.[0];

    // Check if Gain is connected to Output
    const gainIsConnectedToOutput =
        outputNode?.inputs?.some((input) => input.id === gainNodeId) ?? false;

    // Check if Triangle Oscillator is connected to Gain
    const triangleIsConnectedToGain =
        gainNode?.inputs?.some((input) => input.id === triangleOscillatorId) ?? false;

    // Check if Triangle Oscillator is directly connected to Output
    const triangleIsConnectedToOutput =
        outputNode?.inputs?.some((input) => input.id === triangleOscillatorId) ?? false;

    return (
        triangleOscillator &&
        gainNode &&
        outputNode &&
        gainIsConnectedToOutput &&
        triangleIsConnectedToGain &&
        !triangleIsConnectedToOutput
    );
}
