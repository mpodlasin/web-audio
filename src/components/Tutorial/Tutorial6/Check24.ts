import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that the Gain node's value is set below 0.05 but not equal to 0.
export default function (audioGraph: SerializedAudioElements) {
    const nodes = Object.values(audioGraph);

    const gainNode = nodes.find((node) => node.type === 'gain');

    const gainValue = gainNode?.parameters.gain?.base ?? 0;
    const isGainBelow0_05 = 0 < gainValue && gainValue < 0.05;

    return isGainBelow0_05;
}
