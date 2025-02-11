import type { SerializedAudioElements } from '../../../audio/serialized';

// Checks that the unipolar option is enabled on the Saw LFO node.
export default function (audioGraph: SerializedAudioElements) {
	const sawLFO = Object.values(audioGraph).find((node) => node.type === 'saw-lfo');

	const isUnipolarEnabled = sawLFO?.parameters?.unipolar?.base === 1;

	return (sawLFO && isUnipolarEnabled) ?? false;
}
