import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that a Count node exists
export default function (audioGraph: SerializedAudioElements) {
    const nodes = Object.values(audioGraph);
    
    // Find the Count node
    const countNode = nodes.find(node => node.type === 'count');
    
    // Count node must exist
    return !!countNode;
}
