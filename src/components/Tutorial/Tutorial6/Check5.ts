import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that Sine Oscillator is connected to Gain, and Gain is connected to Spectrum
export default function (audioGraph: SerializedAudioElements) {
    const nodes = Object.values(audioGraph);
    const entries = Object.entries(audioGraph);
    
    // Find required nodes
    const sineOscillator = nodes.find(node => node.type === 'sine-oscillator');
    const gainNode = nodes.find(node => node.type === 'gain');
    const spectrumNode = nodes.find(node => node.type === 'spectrum');
    
    // Ensure all nodes exist
    if (!sineOscillator || !gainNode || !spectrumNode) {
        return false;
    }
    
    // Get node IDs
    const sineOscillatorId = entries.find(entry => entry[1] === sineOscillator)?.[0];
    const gainNodeId = entries.find(entry => entry[1] === gainNode)?.[0];
    
    // Check connections
    const sineConnectedToGain = gainNode.inputs.some(input => input.id === sineOscillatorId);
    const gainConnectedToSpectrum = spectrumNode.inputs.some(input => input.id === gainNodeId);
    
    return sineConnectedToGain && gainConnectedToSpectrum;
}
