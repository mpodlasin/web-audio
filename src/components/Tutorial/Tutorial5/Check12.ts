import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that the Clock node's tempo is set to below 30 BPM
export default function (audioGraph: SerializedAudioElements) {
    const nodes = Object.values(audioGraph);
    
    // Find the Clock node
    const clockNode = nodes.find(node => node.type === 'clock');
    
    // Ensure the Clock node exists
    if (!clockNode) {
        return false;
    }
    
    // Check if the tempo parameter is set to below 30 BPM
    const tempo = clockNode.parameters?.tempo?.base ?? 120; // Default is usually 120
    
    return tempo < 30;
}
