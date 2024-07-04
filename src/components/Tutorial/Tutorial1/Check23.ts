import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);

    // Gain knob on Gain connected to Convolution was set to 0
    const convolutionNode = values.find(node => node.type === 'convolution');
    const gainConnectedToConvolution = convolutionNode?.inputs?.map(input => typeof input === 'string' ? input : input.id).map(input => audioGraph[input]).find(node => node && node.type === 'gain');

    const gainParameter = gainConnectedToConvolution?.parameters?.['gain'].base ?? 0;

    return gainParameter === 0;
}
