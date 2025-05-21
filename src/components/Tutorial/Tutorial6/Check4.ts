import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks for the existence of a Sine Oscillator and a Gain node
export default function (audioGraph: SerializedAudioElements) {
    const nodes = Object.values(audioGraph);
    
    // Check for sine oscillator
    const hasSineOscillator = nodes.some(node => node.type === 'sine-oscillator');
    
    // Check for gain node
    const hasGainNode = nodes.some(node => node.type === 'gain');
    
    return hasSineOscillator && hasGainNode;
}
