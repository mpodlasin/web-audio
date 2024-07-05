import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);

    // Mix on convolution was brought down below 0.25

    const convolutionNode = values.find(node => node.type === 'convolution');

    const convolutionMix = convolutionNode?.parameters?.['mix']?.base ?? 0;

    return convolutionMix < 0.25;

}
