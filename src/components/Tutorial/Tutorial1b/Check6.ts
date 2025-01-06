import { globalContext } from '../../../audio/GlobalContext';
import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);

	// Check that volume on the Output was set above zero and global audio context was enabled.
    const output = values.find((node) => node.type === 'destination');

    return (output?.parameters.volume?.base ?? 0) > 0 && globalContext.state === 'running';
}
