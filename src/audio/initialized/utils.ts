function midiNoteToFrequency(midiNote: number): number {
	return Math.pow(2, (midiNote - 69) / 12) * 440;
}

function noteStringToFrequency(noteString: string): number {
	const note = noteString.split('');
	const octave = Number(note.pop());
	const noteName = note.join('');
	const frequency = noteFrequencies[noteName] ?? 0;

	return frequency * Math.pow(2, octave);
}

const noteFrequencies: Record<string, number> = {
	C: 16.35,
	'C#': 17.32,
	D: 18.35,
	'D#': 19.45,
	E: 20.6,
	F: 21.83,
	'F#': 23.12,
	G: 24.5,
	'G#': 25.96,
	A: 27.5,
	'A#': 29.14,
	B: 30.87
};
