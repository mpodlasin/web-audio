import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);
	const entries = Object.entries(audioGraph);

	// Mult was created and connected between Sine and Value nodes.
	const multNode = values.find((node) => node.type === 'multiply');
	const sineNode = values.find((node) => node.type === 'sine-oscillator');
	const valueNode = values.find((node) => node.type === 'value');

	const multNodeId = entries.find((entry) => entry[1] === multNode)?.[0];
	const sineNodeId = entries.find((entry) => entry[1] === sineNode)?.[0];

	const multNodeWasCreated = multNode !== undefined;
	const multWasConnectedToValue =
		valueNode?.inputs?.some((input) => input.id === multNodeId) ?? false;
	const sineWasConnectedToMult =
		multNode?.inputs?.some((input) => input.id === sineNodeId) ?? false;

	return multNodeWasCreated && sineWasConnectedToMult && multWasConnectedToValue;
}
