import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that a Value node exists and the Count node is connected to it
export default function (audioGraph: SerializedAudioElements) {
    const nodes = Object.values(audioGraph);
    const entries = Object.entries(audioGraph);
    
    // Find the Count and Value nodes
    const countNode = nodes.find(node => node.type === 'count');
    const valueNode = nodes.find(node => node.type === 'value');
    
    // Ensure both nodes exist
    if (!countNode || !valueNode) {
        return false;
    }
    
    // Get the Count node ID
    const countId = entries.find(entry => entry[1] === countNode)?.[0];
    
    // Check if the Count node is connected to the Value node
    const countConnectedToValue = valueNode.inputs.some(input => input.id === countId);
    
    return countConnectedToValue;
}
