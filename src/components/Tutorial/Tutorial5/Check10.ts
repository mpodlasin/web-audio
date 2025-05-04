import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that a Clock node exists and is connected to the Count node
export default function (audioGraph: SerializedAudioElements) {
    const nodes = Object.values(audioGraph);
    const entries = Object.entries(audioGraph);
    
    // Find the Clock and Count nodes
    const clockNode = nodes.find(node => node.type === 'clock');
    const countNode = nodes.find(node => node.type === 'count');
    
    // Ensure both nodes exist
    if (!clockNode || !countNode) {
        return false;
    }
    
    // Get the Clock node ID
    const clockId = entries.find(entry => entry[1] === clockNode)?.[0];
    
    // Check if the Clock is connected to the Count node
    const clockConnectedToCount = countNode.inputs.some(input => input.id === clockId);
    
    return clockConnectedToCount;
}
