import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that the Saw Oscillator is connected to the Oscilloscope and its frequency is set to 1 Hz.
export default function (audioGraph: SerializedAudioElements) {
    const nodes = Object.values(audioGraph);
    const entries = Object.entries(audioGraph);

    const sawOscillator = nodes.find(node => node.type === 'saw-oscillator');
    const oscilloscope = nodes.find(node => node.type === 'oscilloscope');

    if (!sawOscillator || !oscilloscope) {
        return false;
    }

    // Ensure the Saw Oscillator's frequency is set to 1 Hz
    const frequencyIsOneHz = sawOscillator.parameters?.frequency?.base === 1;

    // Check if the Saw Oscillator is connected to the Oscilloscope
    const sawOscillatorId = entries.find(entry => entry[1] === sawOscillator)?.[0];
    const isConnectedToOscilloscope = oscilloscope.inputs.some(input => input.id === sawOscillatorId);

    return frequencyIsOneHz && isConnectedToOscilloscope;
}
