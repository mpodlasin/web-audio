import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const nodes = Object.values(audioGraph);
	const sineOscillator = nodes.find((node) => node.type === 'sine-oscillator');

	if (!sineOscillator) return false;

	const frequency = sineOscillator.parameters?.frequency?.base ?? 440;
	return frequency === 10000;
}
