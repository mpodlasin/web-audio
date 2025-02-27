import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that the Triangle Oscillator is connected to the Spectrum node.
export default function (audioGraph: SerializedAudioElements) {
    const nodes = Object.values(audioGraph);
    const entries = Object.entries(audioGraph);

    const triangleOscillator = nodes.find(node => node.type === 'triangle-oscillator');
    const spectrumNode = nodes.find(node => node.type === 'spectrum');

    const triangleOscillatorId = entries.find(entry => entry[1] === triangleOscillator)?.[0];

    const triangleOscillatorConnectedToSpectrum = spectrumNode?.inputs.some(input => input.id === triangleOscillatorId);

    return triangleOscillatorConnectedToSpectrum ?? false;
}
