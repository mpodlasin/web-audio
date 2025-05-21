import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that the second Sine Oscillator is connected to the Spectrum node
export default function (audioGraph: SerializedAudioElements) {
    const nodes = Object.values(audioGraph);
    const entries = Object.entries(audioGraph);
    
    // Find required nodes
    const sineOscillators = nodes.filter(node => node.type === 'sine-oscillator');
    const spectrumNode = nodes.find(node => node.type === 'spectrum');
    const gainNode = nodes.find(node => node.type === 'gain');
    
    // Ensure we have all required nodes
    if (sineOscillators.length < 2 || !spectrumNode || !gainNode) {
        return false;
    }
    
    // Get node IDs
    const sineOscillatorIds = sineOscillators.map(osc => 
        entries.find(entry => entry[1] === osc)?.[0]
    ).filter(Boolean);
    
    const gainNodeId = entries.find(entry => entry[1] === gainNode)?.[0];
    
    // Check if one sine oscillator is connected to gain and the other directly to spectrum
    const sineConnectedToGain = gainNode.inputs.some(input => 
        sineOscillatorIds.includes(input.id)
    );
    
    // Find the sine oscillator that's not connected to gain
    const sineConnectedToSpectrum = spectrumNode.inputs.some(input => 
        sineOscillatorIds.includes(input.id) && input.id !== gainNodeId
    );
    
    return sineConnectedToGain && sineConnectedToSpectrum;
}
