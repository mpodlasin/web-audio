import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that the Triangle Oscillator has been removed and a Saw Oscillator has been created.
export default function (audioGraph: SerializedAudioElements) {
    const nodes = Object.values(audioGraph);

    const triangleOscillator = nodes.find(node => node.type === 'triangle-oscillator');
    const sawOscillator = nodes.find(node => node.type === 'saw-oscillator');

    const triangleOscillatorRemoved = !triangleOscillator;
    const sawOscillatorCreated = !!sawOscillator;

    return triangleOscillatorRemoved && sawOscillatorCreated;
}
