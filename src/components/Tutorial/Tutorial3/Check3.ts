import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that an Oscilloscope is created, connected to the Triangle Oscillator, and the frequency is set below 1 Hz.
export default function (audioGraph: SerializedAudioElements) {
    const values = Object.values(audioGraph);
    const entries = Object.entries(audioGraph);

    const triangleOscillator = values.find((node) => node.type === 'triangle-oscillator');
    const oscilloscopeNode = values.find((node) => node.type === 'oscilloscope');
    const triangleOscillatorId = entries.find((entry) => entry[1] === triangleOscillator)?.[0];

    const triangleIsConnectedToOscilloscope =
        oscilloscopeNode?.inputs?.some((input) => input.id === triangleOscillatorId) ?? false;

    const triangleFrequency = triangleOscillator?.parameters?.frequency?.base ?? Infinity;

    return (
        triangleOscillator &&
        oscilloscopeNode &&
        triangleIsConnectedToOscilloscope &&
        triangleFrequency < 1
    ) ?? false;
}
