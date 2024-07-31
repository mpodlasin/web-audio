import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);

	// Value on gain knob was set to 0.5
    const gainNode = values.find((node) => node.type === 'gain');

    const gain = gainNode?.parameters?.gain.base ?? 0;
    const epsilon = 0.005;
    const expected = 0.5;

    return expected - epsilon < gain && gain < expected + epsilon;
}
