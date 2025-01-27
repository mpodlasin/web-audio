import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that the Number node's value is set to 250.
export default function (audioGraph: SerializedAudioElements) {
    const numberNode = Object.values(audioGraph).find((node) => node.type === 'number');

    const isNumberValue250 = numberNode?.parameters?.value?.base === 250;

    return numberNode && isNumberValue250;
}
