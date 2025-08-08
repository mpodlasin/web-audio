import type { SerializedAudioElements } from '../../../audio/serialized';
import { globalContext } from '../../../audio/GlobalContext';

// Checks that the audio context is running and the output volume has been raised
export default function (audioGraph: SerializedAudioElements) {
	const nodes = Object.values(audioGraph);

	// Find the output node
	const outputNode = nodes.find((node) => node.type === 'destination');
	if (!outputNode) {
		return false;
	}

	// Check if audio context is running
	const isPlaying = globalContext.state === 'running';

	// Check if volume parameter has been raised from default (0)
	const volumeValue = outputNode.parameters?.volume?.base ?? 0;
	const volumeRaised = volumeValue > 0;

	return isPlaying && volumeRaised;
}
