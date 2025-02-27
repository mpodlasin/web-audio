import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that both Sine Oscillators and the Gain node have been removed,
// and that a single Triangle Oscillator has been created.
export default function (audioGraph: SerializedAudioElements) {
    const nodes = Object.values(audioGraph);

    const sineOscillators = nodes.filter(node => node.type === 'sine-oscillator');
    const gainNode = nodes.find(node => node.type === 'gain');
    const triangleOscillator = nodes.find(node => node.type === 'triangle-oscillator');

    const sineOscillatorsRemoved = sineOscillators.length === 0;
    const gainNodeRemoved = !gainNode;
    const triangleOscillatorCreated = !!triangleOscillator;

    return sineOscillatorsRemoved && gainNodeRemoved && triangleOscillatorCreated;
}
