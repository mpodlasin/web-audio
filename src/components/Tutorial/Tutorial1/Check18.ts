import type { SerializedAudioElements } from '../../../audio/serialized';

export default function (audioGraph: SerializedAudioElements) {
	const values = Object.values(audioGraph);

	// At least 3 notes where chosen on Pitch Quantizer
	const pitchQuantizerNode = values.find((node) => node.type === 'pitch-quantizer');

	const a = pitchQuantizerNode?.parameters?.['A']?.base ?? 0;
	const aSharp = pitchQuantizerNode?.parameters?.['A#']?.base ?? 0;
	const b = pitchQuantizerNode?.parameters?.['B']?.base ?? 0;
	const c = pitchQuantizerNode?.parameters?.['C']?.base ?? 0;
	const cSharp = pitchQuantizerNode?.parameters?.['C#']?.base ?? 0;
	const d = pitchQuantizerNode?.parameters?.['D']?.base ?? 0;
	const dSharp = pitchQuantizerNode?.parameters?.['D#']?.base ?? 0;
	const e = pitchQuantizerNode?.parameters?.['E']?.base ?? 0;
	const f = pitchQuantizerNode?.parameters?.['F']?.base ?? 0;
	const fSharp = pitchQuantizerNode?.parameters?.['F#']?.base ?? 0;
	const g = pitchQuantizerNode?.parameters?.['G']?.base ?? 0;
	const gSharp = pitchQuantizerNode?.parameters?.['G#']?.base ?? 0;

	return (
		[a, aSharp, b, c, cSharp, d, dSharp, e, f, fSharp, g, gSharp].reduce((a, b) => a + b, 0) >= 3
	);
}
