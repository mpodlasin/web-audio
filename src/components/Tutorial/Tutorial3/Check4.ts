import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that the Triangle Oscillator is detached from the Oscilloscope but the Oscilloscope still exists.
export default function (audioGraph: SerializedAudioElements) {
    const values = Object.values(audioGraph);
    const entries = Object.entries(audioGraph);

    const triangleOscillator = values.find((node) => node.type === 'triangle-oscillator');
    const oscilloscopeNode = values.find((node) => node.type === 'oscilloscope');
    const triangleOscillatorId = entries.find((entry) => entry[1] === triangleOscillator)?.[0];

    const triangleIsConnectedToOscilloscope =
        oscilloscopeNode?.inputs?.some((input) => input.id === triangleOscillatorId) ?? false;

    return triangleOscillator && oscilloscopeNode && !triangleIsConnectedToOscilloscope;
}
