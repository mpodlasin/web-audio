import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that a Sine Oscillator and Gain node have been created
export default function (audioGraph: SerializedAudioElements) {
    const nodes = Object.values(audioGraph);
    
    // Find required nodes
    const sineOscillator = nodes.find(node => node.type === 'sine-oscillator');
    const gainNode = nodes.find(node => node.type === 'gain');
    
    return !!sineOscillator && !!gainNode;
}
