import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that the Triangle Oscillator is connected to a new Gain node,
// and that this new Gain node is connected to the Oscilloscope.
// Also ensures the old Gain node remains connected to the Sine Oscillator.
export default function (audioGraph: SerializedAudioElements) {
    const nodes = Object.values(audioGraph);
    const entries = Object.entries(audioGraph);

    const sineOscillator = nodes.find(node => node.type === 'sine-oscillator');
    const triangleOscillator = nodes.find(node => node.type === 'triangle-oscillator');
    const gainNodes = nodes.filter(node => node.type === 'gain'); // There should be 2
    const oscilloscope = nodes.find(node => node.type === 'oscilloscope');

    if (!sineOscillator || !triangleOscillator || gainNodes.length !== 2 || !oscilloscope) {
        return false;
    }

    // Identify the Gain node connected to the Sine Oscillator
    const sineOscillatorId = entries.find(entry => entry[1] === sineOscillator)?.[0];
    const gainForSine = gainNodes.find(gain => gain.inputs.some(input => input.id === sineOscillatorId));

    // The other Gain node must be for the Triangle Oscillator
    const triangleOscillatorId = entries.find(entry => entry[1] === triangleOscillator)?.[0];
    const gainForTriangle = gainNodes.find(gain => gain !== gainForSine && gain.inputs.some(input => input.id === triangleOscillatorId));

    // Ensure the Triangle Oscillator's Gain node is connected to the Oscilloscope
    const gainForTriangleId = entries.find(entry => entry[1] === gainForTriangle)?.[0];
    const triangleGainConnectedToOscilloscope = oscilloscope.inputs.some(input => input.id === gainForTriangleId);

    return gainForSine !== undefined && gainForTriangle !== undefined && triangleGainConnectedToOscilloscope;
}
