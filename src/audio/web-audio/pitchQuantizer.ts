export class PitchQuantizer extends AudioWorkletProcessor {
	static parameterDescriptors = [
		{ name: 'A', defaultValue: 0, minValue: 0, maxValue: 1 },
		{ name: 'A#', defaultValue: 0, minValue: 0, maxValue: 1 },
		{ name: 'B', defaultValue: 0, minValue: 0, maxValue: 1 },
		{ name: 'C', defaultValue: 0, minValue: 0, maxValue: 1 },
		{ name: 'C#', defaultValue: 0, minValue: 0, maxValue: 1 },
		{ name: 'D', defaultValue: 0, minValue: 0, maxValue: 1 },
		{ name: 'D#', defaultValue: 0, minValue: 0, maxValue: 1 },
		{ name: 'E', defaultValue: 0, minValue: 0, maxValue: 1 },
		{ name: 'F', defaultValue: 0, minValue: 0, maxValue: 1 },
		{ name: 'F#', defaultValue: 0, minValue: 0, maxValue: 1 },
		{ name: 'G', defaultValue: 0, minValue: 0, maxValue: 1 },
		{ name: 'G#', defaultValue: 0, minValue: 0, maxValue: 1 }
	];

	constructor() {
		super();
	}

	process(
		inputs: Float32Array[][],
		outputs: Float32Array[][],
		parameters: Record<string, Float32Array>
	) {
		inputs.forEach((input, firstIndex) => {
			input.forEach((inp, secondIndex) => {
				for (let i = 0; i < inp.length; i++) {
					const output = outputs[firstIndex];

					if (output) {
						const out = output[secondIndex];

						if (out) {
							out[i] = findClosestNoteFrequency(inp[i] ?? 0, parameters) ?? 0;
						}
					}
				}
			});
		});

		return true;
	}
}

registerProcessor('pitch-quantizer', PitchQuantizer);

interface AudioWorkletProcessor {
	readonly port: MessagePort;
	process(
		inputs: Float32Array[][],
		outputs: Float32Array[][],
		parameters: Record<string, Float32Array>
	): void;
}

function frequencyToOctave(frequency: number): number {
	const midiNoteNumber: number = 12 * Math.log2(frequency / 440) + 69;
	const octave: number = Math.floor((midiNoteNumber - 12) / 12);

	return octave;
}

function findClosestNoteFrequency(
	frequency: number,
	parameters: Record<string, Float32Array>
): number {
	const scaleFrequencies: number[] = [];
	for (const note of PitchQuantizer.parameterDescriptors) {
		const midiNote = `${note.name}${frequencyToOctave(frequency)}`;

		if (parameters[note.name]?.[0] === 1) {
			scaleFrequencies.push(midiNoteToFrequency(midiNote));
		}
	}

	return closestNumber(scaleFrequencies, frequency);
}

function closestNumber(numbers: number[], target: number): number {
	const numbersCopy = [...numbers];

	numbersCopy.sort((x, y) => Math.abs(x - target) - Math.abs(y - target));

	return numbersCopy[0] ?? target;
}

function midiNoteToFrequency(note: string): number {
	const midiNoteNumbers: { [note: string]: number } = {
		C: 0,
		'C#': 1,
		Db: 1,
		D: 2,
		'D#': 3,
		Eb: 3,
		E: 4,
		F: 5,
		'F#': 6,
		Gb: 6,
		G: 7,
		'G#': 8,
		Ab: 8,
		A: 9,
		'A#': 10,
		Bb: 10,
		B: 11
	};

	const noteName: string = note.slice(0, -1);
	const octave: number = parseInt(note.slice(-1));

	const midiNoteNumber: number = (octave + 1) * 12 + (midiNoteNumbers[noteName] || 0);

	const frequency: number = 440 * Math.pow(2, (midiNoteNumber - 69) / 12);

	return frequency;
}

declare const AudioWorkletProcessor: {
	prototype: AudioWorkletProcessor;
	new (options?: AudioWorkletNodeOptions): AudioWorkletProcessor;
};

declare const registerProcessor: (name: string, value: object) => void;

declare const currentTime: number;
declare const sampleRate: number;
