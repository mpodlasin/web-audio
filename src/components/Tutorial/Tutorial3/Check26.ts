import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that a Times node is created.
export default function (audioGraph: SerializedAudioElements) {
    const timesNode = Object.values(audioGraph).find((node) => node.type === 'times');

    return timesNode !== undefined;
}
