import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that Triangle Oscillator is removed and a Square Oscillator is connected to the Spectrum node
export default function (audioGraph: SerializedAudioElements) {
    const nodes = Object.values(audioGraph);
    const entries = Object.entries(audioGraph);
    
    // Check that triangle oscillator is removed
    const hasTriangleOscillator = nodes.some(node => node.type === 'triangle-oscillator');
    
    // Find required nodes
    const squareOscillator = nodes.find(node => node.type === 'square-oscillator');
    const spectrumNode = nodes.find(node => node.type === 'spectrum');
    
    // Ensure square oscillator exists and triangle oscillator is removed
    if (hasTriangleOscillator || !squareOscillator || !spectrumNode) {
        return false;
    }
    
    // Get the square oscillator's ID
    const squareOscillatorId = entries.find(entry => entry[1] === squareOscillator)?.[0];
    
    // Check if square oscillator is connected to spectrum
    const isConnected = spectrumNode.inputs.some(input => input.id === squareOscillatorId);
    
    return isConnected;
}
