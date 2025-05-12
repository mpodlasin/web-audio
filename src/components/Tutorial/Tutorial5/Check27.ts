import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that:
// 1. A Convolution node exists
// 2. It is connected between the Gain node and the Output node
// 3. The direct connection between Gain and Output has been removed
export default function (audioGraph: SerializedAudioElements) {
    const nodes = Object.values(audioGraph);
    const entries = Object.entries(audioGraph);
    
    // Find all required nodes
    const gainNode = nodes.find(node => node.type === 'gain');
    const convolutionNode = nodes.find(node => node.type === 'convolution');
    const outputNode = nodes.find(node => node.type === 'destination');
    
    // Ensure all nodes exist
    if (!gainNode || !convolutionNode || !outputNode) {
        return false;
    }
    
    // Get node IDs
    const gainId = entries.find(entry => entry[1] === gainNode)?.[0];
    const convolutionId = entries.find(entry => entry[1] === convolutionNode)?.[0];
    
    // Check connections
    const gainConnectedToConvolution = convolutionNode.inputs.some(input => input.id === gainId);
    const convolutionConnectedToOutput = outputNode.inputs.some(input => input.id === convolutionId);
    
    // Check that there is no direct connection from Gain to Output
    const gainDirectlyConnectedToOutput = outputNode.inputs.some(input => input.id === gainId);
    
    return gainConnectedToConvolution && convolutionConnectedToOutput && !gainDirectlyConnectedToOutput;
}
