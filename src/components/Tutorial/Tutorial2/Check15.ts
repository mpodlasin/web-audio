import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);

	// Sine, Number and Mult nodes where removed.
	const sineNode = values.find((node) => node.type === 'sine-oscillator');
    const numberNode = values.find((node) => node.type === 'number');
    const multNode = values.find((node) => node.type === 'multiply');

    return sineNode === undefined && numberNode === undefined && multNode === undefined;
}
