import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that both Sine Oscillators and the Gain node have been removed, but Spectrum and Output remain
export default function (audioGraph: SerializedAudioElements) {
    const nodes = Object.values(audioGraph);
    
    // Check that sine oscillators and gain node are removed
    const sineOscillators = nodes.filter(node => node.type === 'sine-oscillator');
    const gainNode = nodes.find(node => node.type === 'gain');
    
    // Check that spectrum and output nodes still exist
    const spectrumNode = nodes.find(node => node.type === 'spectrum');
    const outputNode = nodes.find(node => node.type === 'destination');
    
    return sineOscillators.length === 0 && 
           !gainNode && 
           !!spectrumNode && 
           !!outputNode;
}
