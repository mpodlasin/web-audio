import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that the Saw Oscillator is connected to the Output node and its frequency remains at 1 Hz.
export default function (audioGraph: SerializedAudioElements) {
    const nodes = Object.values(audioGraph);
    const entries = Object.entries(audioGraph);

    const sawOscillator = nodes.find(node => node.type === 'saw-oscillator');
    const outputNode = nodes.find(node => node.type === 'destination');

    if (!sawOscillator || !outputNode) {
        return false;
    }

    // Check if the Saw Oscillator's frequency is still 1 Hz
    const frequency = sawOscillator.parameters?.frequency?.base ?? 1;
    const frequencyIsStillOneHz = frequency === 1;

    // Check if the Saw Oscillator is connected to the Output node
    const sawOscillatorId = entries.find(entry => entry[1] === sawOscillator)?.[0];
    const isConnectedToOutput = outputNode.inputs.some(input => input.id === sawOscillatorId);

    return frequencyIsStillOneHz && isConnectedToOutput;
}
