import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that a Triangle Oscillator has been created and connected to the Oscilloscope
export default function (audioGraph: SerializedAudioElements) {
    const nodes = Object.values(audioGraph);
    const entries = Object.entries(audioGraph);

    const triangleOscillator = nodes.find(node => node.type === 'triangle-oscillator');
    const oscilloscope = nodes.find(node => node.type === 'oscilloscope');

    if (!triangleOscillator || !oscilloscope) {
        return false;
    }

    const triangleOscillatorId = entries.find(entry => entry[1] === triangleOscillator)?.[0];
    const isConnectedToOscilloscope = oscilloscope.inputs.some(input => input.id === triangleOscillatorId);

    return isConnectedToOscilloscope;
}
