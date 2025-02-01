import type { SerializedAudioElements } from '../../../audio/serialized';

// Verifies that a Lowpass Filter node is created.
export default function (audioGraph: SerializedAudioElements) {
    const lowpassFilter = Object.values(audioGraph).find((node) => node.type === 'lowpass-filter');
    return lowpassFilter !== undefined;
}
