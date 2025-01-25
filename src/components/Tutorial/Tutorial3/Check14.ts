import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that the Saw LFO is connected to the Gain node's gain parameter and the gain knob is set to 0.
export default function (audioGraph: SerializedAudioElements) {
    const values = Object.values(audioGraph);
    const entries = Object.entries(audioGraph);

    const sawLFO = values.find((node) => node.type === 'saw-lfo');
    const gainNode = values.find((node) => node.type === 'gain');
    const sawLFOId = entries.find((entry) => entry[1] === sawLFO)?.[0];

    // Check if Saw LFO is connected to Gain node's gain parameter
    const sawLFOIsConnectedToGain =
        gainNode?.parameters?.gain?.inputs?.some((input) => input.id === sawLFOId) ?? false;

    // Check if the gain knob is set to 0
    const isGainKnobZero = gainNode?.parameters?.gain?.base === 0;

    return sawLFO && gainNode && sawLFOIsConnectedToGain && isGainKnobZero;
}
