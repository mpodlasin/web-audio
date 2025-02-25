import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that the frequency of the Sine Oscillator is set to exactly 10,000 Hz at the end.
export default function (audioGraph: SerializedAudioElements) {
    const sineOscillatorNode = Object.values(audioGraph).find((node) => node.type === 'sine-oscillator');
    
    const frequencyParam = sineOscillatorNode?.parameters?.frequency?.base ?? 0;

    return frequencyParam === 10000;
}
