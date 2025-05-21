import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that Sine Oscillators and Gain node are removed, but Spectrum and Output nodes still exist
export default function (audioGraph: SerializedAudioElements) {
    const nodes = Object.values(audioGraph);
    
    // Check that sine oscillators and gain node are removed
    const hasSineOscillator = nodes.some(node => node.type === 'sine-oscillator');
    const hasGainNode = nodes.some(node => node.type === 'gain');
    
    // Check that spectrum and output nodes still exist
    const hasSpectrumNode = nodes.some(node => node.type === 'spectrum');
    const hasOutputNode = nodes.some(node => node.type === 'destination');
    
    return !hasSineOscillator && !hasGainNode && hasSpectrumNode && hasOutputNode;
}
