import { globalContext } from '../../../audio/GlobalContext';
import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	return globalContext.state === 'running';
}
