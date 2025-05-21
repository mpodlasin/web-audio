import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks for the existence of a Triangle Oscillator connected to the Spectrum node
export default function (audioGraph: SerializedAudioElements) {
    const nodes = Object.values(audioGraph);
    const entries = Object.entries(audioGraph);
    
    // Find required nodes
    const triangleOscillator = nodes.find(node => node.type === 'triangle-oscillator');
    const spectrumNode = nodes.find(node => node.type === 'spectrum');
    
    // Ensure both nodes exist
    if (!triangleOscillator || !spectrumNode) {
        return false;
    }
    
    // Get the triangle oscillator's ID
    const triangleOscillatorId = entries.find(entry => entry[1] === triangleOscillator)?.[0];
    
    // Check if triangle oscillator is connected to spectrum
    const isConnected = spectrumNode.inputs.some(input => input.id === triangleOscillatorId);
    
    return isConnected;
}
