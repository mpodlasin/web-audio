import type { SerializedAudioElements } from '../../../audio/serialized';

// Verifies that the output of the Times node is connected to the frequency parameter of the Sine Oscillator.
export default function (audioGraph: SerializedAudioElements) {
    const values = Object.values(audioGraph);
    const entries = Object.entries(audioGraph);

    const timesNode = values.find((node) => node.type === 'times');
    const sineOscillator = values.find((node) => node.type === 'sine-oscillator');
    const timesNodeId = entries.find((entry) => entry[1] === timesNode)?.[0];

    const timesIsConnectedToSineFreq =
        sineOscillator?.parameters?.frequency?.inputs?.some((input) => input.id === timesNodeId) ?? false;

    return timesNode && sineOscillator && timesIsConnectedToSineFreq;
}
