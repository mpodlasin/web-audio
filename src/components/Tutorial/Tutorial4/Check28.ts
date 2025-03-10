import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that the Square Oscillator has been removed and a Saw Oscillator has been created.
export default function (audioGraph: SerializedAudioElements) {
    const nodes = Object.values(audioGraph);

    const squareOscillator = nodes.find(node => node.type === 'square-oscillator');
    const sawOscillator = nodes.find(node => node.type === 'saw-oscillator');

    const squareOscillatorRemoved = !squareOscillator;
    const sawOscillatorCreated = !!sawOscillator;

    return squareOscillatorRemoved && sawOscillatorCreated;
}
