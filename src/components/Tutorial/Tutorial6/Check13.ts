import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
    const nodes = Object.values(audioGraph);
    
    // Find the Gain node
    const gainNode = nodes.find(node => node.type === 'gain');
    if (!gainNode) return false;
    
    // Check that the gain parameter has been lowered below 0.1 as instructed
    const gainValue = gainNode.parameters?.gain?.base ?? 1;
    return gainValue < 0.1;
}
