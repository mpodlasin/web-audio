import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);
    const entries = Object.entries(audioGraph);

    // AD Envelope was connected to gain parameter of Gain node
    // and Clock was connected to AD Envelope

    const convolutionNode = values.find(node => node.type === 'convolution');
    const gainConnectedToConvolution = convolutionNode?.inputs?.map(input => typeof input === 'string' ? input : input.id).map(input => audioGraph[input]).find(node => node && node.type === 'gain');

    const adEnvelopeNode = values.find(node => node.type === 'ad-envelope');
    const adEnvelopeNodeId = entries.find(entry => entry[1] === adEnvelopeNode)?.[0];

    const adEnvelopeWasConnectedToGain = gainConnectedToConvolution?.parameters?.['gain'].inputs.some(input => input.id === adEnvelopeNodeId) ?? false;
    const clockWasConnectedToAdEnvelope = adEnvelopeNode?.inputs?.map(input => typeof input === 'string' ? input : input.id).map(input => audioGraph[input]).some(node => node && node.type === 'clock') ?? false;
    
    return adEnvelopeWasConnectedToGain && clockWasConnectedToAdEnvelope;
}
