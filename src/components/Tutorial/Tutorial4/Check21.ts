import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that a Destination (Output) node exists and the Triangle Oscillator is connected to it.
export default function (audioGraph: SerializedAudioElements) {
    const nodes = Object.values(audioGraph);
    const entries = Object.entries(audioGraph);

    const triangleOscillator = nodes.find(node => node.type === 'triangle-oscillator');
    const outputNode = nodes.find(node => node.type === 'destination');

    if (!triangleOscillator || !outputNode) {
        return false;
    }

    // Check if the Triangle Oscillator is connected to the Output node
    const triangleOscillatorId = entries.find(entry => entry[1] === triangleOscillator)?.[0];
    const isConnectedToOutput = outputNode.inputs.some(input => input.id === triangleOscillatorId);

    return isConnectedToOutput;
}
