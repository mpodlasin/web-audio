import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks for the existence of an Output node and that the Spectrum node is connected to it
export default function (audioGraph: SerializedAudioElements) {
    const nodes = Object.values(audioGraph);
    const entries = Object.entries(audioGraph);
    
    // Find required nodes
    const spectrumNode = nodes.find(node => node.type === 'spectrum');
    const outputNode = nodes.find(node => node.type === 'destination');
    
    // Ensure both nodes exist
    if (!spectrumNode || !outputNode) {
        return false;
    }
    
    // Get the spectrum node's ID
    const spectrumNodeId = entries.find(entry => entry[1] === spectrumNode)?.[0];
    
    // Check if spectrum node is connected to output
    const isConnected = outputNode.inputs.some(input => input.id === spectrumNodeId);
    
    return isConnected;
}
