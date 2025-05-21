import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that Square Oscillator is removed and a Saw Oscillator is connected to the Spectrum node
export default function (audioGraph: SerializedAudioElements) {
    const nodes = Object.values(audioGraph);
    const entries = Object.entries(audioGraph);
    
    // Check that square oscillator is removed
    const hasSquareOscillator = nodes.some(node => node.type === 'square-oscillator');
    
    // Find required nodes
    const sawOscillator = nodes.find(node => node.type === 'saw-oscillator');
    const spectrumNode = nodes.find(node => node.type === 'spectrum');
    
    // Ensure saw oscillator exists and square oscillator is removed
    if (hasSquareOscillator || !sawOscillator || !spectrumNode) {
        return false;
    }
    
    // Get the saw oscillator's ID
    const sawOscillatorId = entries.find(entry => entry[1] === sawOscillator)?.[0];
    
    // Check if saw oscillator is connected to spectrum
    const isConnected = spectrumNode.inputs.some(input => input.id === sawOscillatorId);
    
    return isConnected;
}
