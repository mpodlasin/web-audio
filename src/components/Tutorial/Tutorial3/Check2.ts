import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
    const values = Object.values(audioGraph);
    const entries = Object.entries(audioGraph);

    // Checks that a Triangle Oscillator is created and connected to the Output node.

    const triangleOscillator = values.find((node) => node.type === 'triangle-oscillator');
    const outputNode = values.find((node) => node.type === 'destination');
    const triangleOscillatorId = entries.find((entry) => entry[1] === triangleOscillator)?.[0];

    const triangleOscillatorIsConnectedToOutput =
        outputNode?.inputs?.some((input) => input.id === triangleOscillatorId) ?? false;

    return (
        triangleOscillator !== undefined &&
        outputNode !== undefined &&
        triangleOscillatorIsConnectedToOutput
    );
}
