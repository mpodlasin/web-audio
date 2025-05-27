import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
    const nodes = Object.values(audioGraph);
    
    // Check that we have at least 2 sine oscillators
    const sineOscillators = nodes.filter(node => node.type === 'sine-oscillator');
    if (sineOscillators.length < 2) return false;
    
    // Check that at least one sine oscillator has a frequency different from the default (440 Hz)
    let hasChangedFrequency = false;
    
    for (const sineOsc of sineOscillators) {
        const frequency = sineOsc.parameters?.frequency?.base ?? 440;
        if (frequency !== 440) {
            hasChangedFrequency = true;
            break;
        }
    }
    
    return hasChangedFrequency;
}
