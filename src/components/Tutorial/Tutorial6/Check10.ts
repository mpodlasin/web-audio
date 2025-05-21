import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks for the existence of two Sine Oscillators
export default function (audioGraph: SerializedAudioElements) {
    const nodes = Object.values(audioGraph);
    
    // Count sine oscillators
    const sineOscillatorCount = nodes.filter(node => node.type === 'sine-oscillator').length;
    
    // Verify there are exactly 2 sine oscillators
    return sineOscillatorCount === 2;
}
