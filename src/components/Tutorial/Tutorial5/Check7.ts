import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that Gain and Output nodes exist and are properly connected
// Switch -> Gain -> Output
export default function (audioGraph: SerializedAudioElements) {
    const nodes = Object.values(audioGraph);
    const entries = Object.entries(audioGraph);
    
    // Find required nodes
    const switchNode = nodes.find(node => node.type === 'switch');
    const gainNode = nodes.find(node => node.type === 'gain');
    const outputNode = nodes.find(node => node.type === 'destination');
    
    // Ensure all nodes exist
    if (!switchNode || !gainNode || !outputNode) {
        return false;
    }
    
    // Get node IDs
    const switchId = entries.find(entry => entry[1] === switchNode)?.[0];
    const gainId = entries.find(entry => entry[1] === gainNode)?.[0];
    
    // Check connections
    const switchConnectedToGain = gainNode.inputs.some(input => input.id === switchId);
    const gainConnectedToOutput = outputNode.inputs.some(input => input.id === gainId);
    
    return switchConnectedToGain && gainConnectedToOutput;
}
