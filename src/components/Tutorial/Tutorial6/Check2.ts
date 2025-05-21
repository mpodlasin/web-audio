import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks for the existence of a Spectrum node
export default function (audioGraph: SerializedAudioElements) {
    return !!Object.values(audioGraph).find(node => node.type === 'spectrum');
}
