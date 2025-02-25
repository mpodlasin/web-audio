import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that a second Sine Oscillator is connected directly to the Spectrum node.
export default function (audioGraph: SerializedAudioElements) {
    const nodes = Object.values(audioGraph);
    const entries = Object.entries(audioGraph);

    const spectrumNode = nodes.find((node) => node.type === 'spectrum');
    const sineOscillators = nodes.filter((node) => node.type === 'sine-oscillator');
    const gainNode = nodes.find((node) => node.type === 'gain');

    const gainNodeId = entries.find(entry => entry[1] === gainNode)?.[0];
    const sineOscilllatorIds = sineOscillators.map(sineOscillator => entries.find(entry => entry[1] === sineOscillator)?.[0]);

    const thereAreTwoSineOscillators = sineOscillators.length === 2;

    const gainIsStillConnectedToSpectrum = spectrumNode?.inputs.some(input => input.id === gainNodeId);

    const someSineIsConnectedToSpectrum = spectrumNode?.inputs.some(input => sineOscilllatorIds.some(sineOscillatorId => sineOscillatorId === input.id));

    return (thereAreTwoSineOscillators && gainIsStillConnectedToSpectrum && someSineIsConnectedToSpectrum) ?? false;
}
