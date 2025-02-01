import type { SerializedAudioElements } from '../../../audio/serialized';

// Verifies that the Lowpass Filter's frequency parameter is set to 100 Hz.
export default function (audioGraph: SerializedAudioElements) {
    const lowpassFilter = Object.values(audioGraph).find((node) => node.type === 'lowpass-filter');
    return lowpassFilter?.parameters?.frequency?.base === 100;
}
