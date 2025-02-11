import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that both the Times and Number nodes have been deleted from the audio graph.
export default function (audioGraph: SerializedAudioElements) {
    const values = Object.values(audioGraph);

    const timesNodeExists = values.some((node) => node.type === 'times');
    const numberNodeExists = values.some((node) => node.type === 'number');

    return !timesNodeExists && !numberNodeExists;
}
