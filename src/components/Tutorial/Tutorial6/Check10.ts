import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that a second Sine Oscillator has been created (total of 2 sine oscillators)
export default function (audioGraph: SerializedAudioElements) {
    const nodes = Object.values(audioGraph);
    
    // Count Sine Oscillators
    const sineOscillators = nodes.filter(node => node.type === 'sine-oscillator');
    
    return sineOscillators.length >= 2;
}
