import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that a Sine Oscillator not connected to a Gain node has been removed,
// and that a Triangle Oscillator with its own Gain node has been created and connected.
export default function (audioGraph: SerializedAudioElements) {
    const nodes = Object.values(audioGraph);
    const entries = Object.entries(audioGraph);

    const sineOscillators = nodes.filter(node => node.type === 'sine-oscillator');
    const triangleOscillator = nodes.find(node => node.type === 'triangle-oscillator');
    const gainNodes = nodes.filter(node => node.type === 'gain');

    const sineOscillatorId = entries.find(entry => entry[1] === sineOscillators[0])?.[0];

    const thereIsOnlyOneSineOscillator = sineOscillators.length === 1;
    const sineOscillatorIsStillConnectedToGain = gainNodes.some(gainNode => gainNode.inputs.some(input => input.id === sineOscillatorId));

    const thereAreTwoGainNodes = gainNodes.length === 2 ;

    const triangleOscillatorWasCreated = triangleOscillator !== undefined;

    return (thereIsOnlyOneSineOscillator && sineOscillatorIsStillConnectedToGain && thereAreTwoGainNodes && triangleOscillatorWasCreated) ?? false;
}