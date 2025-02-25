import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that the Gain node is connected to the Spectrum node, disconnected from the Oscilloscope,
// and that the gain is set to 1.
export default function (audioGraph: SerializedAudioElements) {
    const nodes = Object.values(audioGraph);
    const entries = Object.entries(audioGraph);

    const gainNode = nodes.find((node) => node.type === 'gain');
    const oscilloscopeNode = nodes.find((node) => node.type === 'oscilloscope');
    const spectrumNode = nodes.find((node) => node.type === 'spectrum');

    const gainNodeId = entries.find(entry => entry[1] === gainNode)?.[0];

    const gainWasDisconnectedFromTheOscilloscope = oscilloscopeNode?.inputs.every(input => input.id !== gainNodeId);
    const gainWasConnectedToSpectrum = spectrumNode?.inputs.some(input => input.id === gainNodeId);

    const gainWasSetToOne = gainNode?.parameters.gain?.base === 1;

    return (gainWasDisconnectedFromTheOscilloscope && gainWasConnectedToSpectrum && gainWasSetToOne) ?? false;
}
