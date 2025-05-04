import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that an AD Envelope node exists
export default function (audioGraph: SerializedAudioElements) {
    const nodes = Object.values(audioGraph);
    
    // Find the AD Envelope node
    const adEnvelopeNode = nodes.find(node => node.type === 'ad-envelope');
    
    // AD Envelope node must exist
    return !!adEnvelopeNode;
}
