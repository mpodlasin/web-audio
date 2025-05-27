import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that the Triangle Oscillator has been removed and a Square Oscillator has been created and connected to the Spectrum node
export default function (audioGraph: SerializedAudioElements) {
    const nodes = Object.values(audioGraph);
    const entries = Object.entries(audioGraph);
    
    // Check that triangle oscillator is removed
    const triangleOscillator = nodes.find(node => node.type === 'triangle-oscillator');
    
    // Find required nodes
    const squareOscillator = nodes.find(node => node.type === 'square-oscillator');
    const spectrumNode = nodes.find(node => node.type === 'spectrum');
    
    // Ensure triangle is removed, square and spectrum exist
    if (triangleOscillator || !squareOscillator || !spectrumNode) {
        return false;
    }
    
    // Get the Square Oscillator's ID
    const squareOscillatorId = entries.find(entry => entry[1] === squareOscillator)?.[0];
    
    // Check if Square Oscillator is connected to Spectrum
    const isConnected = spectrumNode.inputs.some(input => input.id === squareOscillatorId);
    
    return isConnected;
}
