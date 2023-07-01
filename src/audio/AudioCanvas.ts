import { globalContext } from './GlobalContext';
import { settings } from './settings';

/* SERIALIZED */

export type SerializedAudioElements = {
	[key: string]: AllowedSerializedAudioElements;
};

export type SerializedAudioElementsWithIds = {
	[key: string]: SerializedAudioElementWithId<string, string>;
};

export type SerializedAudioElement<T extends string, P extends string> = {
	type: T;
	inputs?: Inputs;
	parameters?: {
		[key in P]: SerializedAudioParameter;
	};
};

export type SerializedAudioElementWithId<
	T extends string,
	P extends string
> = SerializedAudioElement<T, P> & {
	id: string;
};

export type Inputs = string[] | { id: string, output: string }[];

export type SerializedAudioParameter = number | Inputs

export type SerializedOscillatorNode = SerializedAudioElement<'oscillator', 'frequency' | 'detune'> & {
	oscillatorType: OscillatorType;
}

export type SerializedGainNode = SerializedAudioElement<'gain', 'gain'>;

export type SerializedDestinationNode = SerializedAudioElement<'destination', never>;

export type SerializedTriggerNode = SerializedAudioElement<'trigger', never> & {
	tempoInBpm: number;
}

export type SerializedSequencerNode = SerializedAudioElement<'sequencer', never> & {
	tempoInBpm: number;
	notes: SerializedSequencerNote[];
	loopLength: number;
}

export type SerializedMidiNode = SerializedAudioElement<'midi', never>

export type SerializedSequencerNote = {
	note: string;
	time: number;
	duration: number;
}

export type SerializedEnvelopeNode = SerializedAudioElement<'envelope', never> & {
	attack: number;
	decay: number;
	sustain: number;
	release: number;
}

export type AllowedSerializedAudioElements =
	| SerializedOscillatorNode	
	| SerializedGainNode
	| SerializedDestinationNode
	| SerializedTriggerNode
	| SerializedEnvelopeNode
	| SerializedSequencerNode
	| SerializedMidiNode;


/* Initialized */

export interface CustomAudioNode {
	connect(destination: CustomAudioNode | AudioParam, output?: string): void;
	disconnect(desination: CustomAudioNode | AudioParam, output?: string): void;
}

export interface CustomAudioScheduledSourceNode extends CustomAudioNode {
	start(when?: number): void;
	stop(when?: number): void;
}

export function isCustomAudioScheduledSourceNode(
	customAudioNode: CustomAudioNode
): customAudioNode is CustomAudioScheduledSourceNode {
	return 'start' in customAudioNode && 'stop' in customAudioNode;
}

export interface CustomAudioNodeWithWebApiNode<T extends AudioNode = AudioNode> extends CustomAudioNode {
	readonly webApiNode: T;
}

export function isCustomAudioNodeWithWebApiNode(
	customAudioNode: CustomAudioNode
): customAudioNode is CustomAudioNodeWithWebApiNode {
	return 'webApiNode' in customAudioNode;
}

export class GenericCustomAudioNodeWithWebApiNode<T extends AudioNode> implements CustomAudioNodeWithWebApiNode<T> {
	readonly webApiNode: T;
	private desinations: CustomAudioNode[] = [];

	constructor(webApiNode: T) {
		this.webApiNode = webApiNode;
	}

	connect(destination: CustomAudioNode | AudioParam): void {
		if (destination instanceof AudioParam) {
			this.webApiNode.connect(destination);
			return;
		}

		if (isCustomAudioNodeWithWebApiNode(destination)) {
			this.webApiNode.connect(destination.webApiNode);
		}

		this.desinations.push(destination);
	}

	disconnect(destination: CustomAudioNode | AudioParam): void {
		if (destination instanceof AudioParam) {
			this.webApiNode.disconnect(destination);
			return;
		}

		if (isCustomAudioNodeWithWebApiNode(destination)) {
			this.webApiNode.disconnect(destination.webApiNode);
		}

		this.desinations = this.desinations.filter((d) => d !== destination);
	}
}

export class CustomAudioNodeWithWebApiAudioScheduledSourceNode<T extends AudioScheduledSourceNode> extends GenericCustomAudioNodeWithWebApiNode<T> implements CustomAudioScheduledSourceNode {
	start(when?: number): void {
		this.webApiNode.start(when);
	}

	stop(when?: number): void {
		this.webApiNode.stop(when);
	}
}

export class CustomOscillatorNode extends CustomAudioNodeWithWebApiAudioScheduledSourceNode<OscillatorNode> {
	constructor() {
		super(globalContext.createOscillator());
	}
}

export class CustomGainNode extends GenericCustomAudioNodeWithWebApiNode<GainNode> {
	constructor() {
		super(globalContext.createGain());
	}
}

export class DestinationNode extends GenericCustomAudioNodeWithWebApiNode<AudioDestinationNode> {
	constructor() {
		super(globalContext.destination);
	}
}

export type Destination = CustomAudioNode | AudioParam;

export class EnvelopeNode implements CustomAudioNode, CustomAudioScheduledSourceNode {
	private destinations: Destination[] = [];

	constructor(
		private readonly attack: number,
		private readonly decay: number,
		private readonly sustain: number,
		private readonly release: number
	) {}

	connect(destination: CustomAudioNode | AudioParam): void {
		if (!(destination instanceof AudioParam)) {
			throw new Error('EnvelopeNode can only connect to AudioParams');
		}
		
		this.destinations.push(destination);
	}

	disconnect(destination: CustomAudioNode | AudioParam): void {
		this.destinations = this.destinations.filter((d) => d !== destination);
	}

	start(when: number = globalContext.currentTime): void {
		this.destinations.forEach((destination) => {
			if (destination instanceof AudioParam) {
				destination.cancelScheduledValues(when);
				destination.setValueAtTime(0, when);
				destination.linearRampToValueAtTime(1, when + this.attack);
				destination.linearRampToValueAtTime(this.sustain, when + this.attack + this.decay);
			}
		});
	}

	stop(when: number = globalContext.currentTime): void {
		this.destinations.forEach((destination) => {
			if (destination instanceof AudioParam) {
				destination.cancelScheduledValues(when);
				destination.linearRampToValueAtTime(0, when + this.release);
			}
		});
	}
}

export class TriggerNode implements CustomAudioNode, CustomAudioScheduledSourceNode {
	private destinations: Destination[] = [];
	private setIntervalId: number | null = null;
	private playedTime = 0;

	constructor(
		private tempoInBPM: number,
	) {}

	connect(destination: CustomAudioNode | AudioParam): void {
		this.destinations.push(destination);
	}

	disconnect(destination: CustomAudioNode | AudioParam): void {
		this.destinations = this.destinations.filter((d) => d !== destination);
	}

	start(when: number = globalContext.currentTime): void {
		this.playedTime = when;
		const tempoInSeconds = 60 / this.tempoInBPM;
		const lookAheadInSeconds = settings.lookAheadInSeconds;
		const sampling = settings.sampling;
		const sampleLengthInSeconds = 1 / sampling;

		this.setIntervalId = window.setInterval(() => {
			this.destinations.forEach((destination) => {
				if (destination instanceof AudioParam) {
					return 
				}

				if (isCustomAudioScheduledSourceNode(destination)) {	
					while (this.playedTime < globalContext.currentTime + lookAheadInSeconds) {
						destination.start(this.playedTime);
						destination.stop(this.playedTime + sampleLengthInSeconds);
						this.playedTime += tempoInSeconds;
					}
				}
			});
		}, settings.updateIntervalInMiliseconds);
	}

	stop(when: number = globalContext.currentTime): void {
		if (this.setIntervalId !== null) {
			window.clearInterval(this.setIntervalId);
			this.setIntervalId = null;
		}
	}
}	


export type AudioNodeDatabase = {
	[key: string]: CustomAudioNode;
};

export class SequencerNode {
	private frequencyDestinations: Destination[] = [];
	private triggerDestinations: Destination[] = [];
	private setIntervalId: number | null = null;
	private playedTime = 0;

	constructor(
		private tempoInBPM: number,
		private notes: SerializedSequencerNote[],
		private loopLength: number
	) {}

	connect(destination: CustomAudioNode | AudioParam, output: 'frequency' | 'trigger'): void {
		if (output === 'frequency') {
			this.frequencyDestinations.push(destination);
		} else {
			this.triggerDestinations.push(destination);
		}
	}

	disconnect(destination: CustomAudioNode | AudioParam, output: 'frequency' | 'trigger'): void {
		if (output === 'frequency') {
			this.frequencyDestinations = this.frequencyDestinations.filter((d) => d !== destination);
		} else {
			this.triggerDestinations = this.triggerDestinations.filter((d) => d !== destination);
		}
	}

	start(when: number = globalContext.currentTime): void {
		const lookAheadInSeconds = settings.lookAheadInSeconds;
		const updateIntervalInMiliseconds = settings.updateIntervalInMiliseconds;
		const startTime = when;
		this.playedTime = when;
		const tempoInSeconds = 60 / this.tempoInBPM;

		const notesWithPlayTimeRelativeToStartTime = this.notes.map((note) => {
			const noteLengthInBeats = note.duration;
			const noteLengthInSeconds = noteLengthInBeats * tempoInSeconds;

			const noteStartTimeInBeats = note.time;
			const noteStartTimeInSeconds = noteStartTimeInBeats * tempoInSeconds;

			const noteString = note.note;
			const frequency = noteStringToFrequency(noteString);

			return {
				playTimeInSecondsRelativeToStartTime: startTime + noteStartTimeInSeconds,
				durationInSeconds: noteLengthInSeconds,
				frequency,
			}
		});

		this.setIntervalId = window.setInterval(() => {
			const currentTime = globalContext.currentTime;

			const notesToPlay = notesWithPlayTimeRelativeToStartTime.filter((note) => {
				return this.playedTime <= note.playTimeInSecondsRelativeToStartTime && note.playTimeInSecondsRelativeToStartTime < currentTime + lookAheadInSeconds;
			});

			this.triggerDestinations.forEach((destination) => {
				if (destination instanceof AudioParam) {
					return 
				}

				if (isCustomAudioScheduledSourceNode(destination)) {
					notesToPlay.forEach((note) => {
						destination.start(note.playTimeInSecondsRelativeToStartTime);
						destination.stop(note.playTimeInSecondsRelativeToStartTime + note.durationInSeconds);
					});

					this.playedTime = currentTime + lookAheadInSeconds;
				}
			});

			this.frequencyDestinations.forEach((destination) => {
				if (destination instanceof AudioParam) {
					notesToPlay.forEach((note) => {
						destination.setValueAtTime(note.frequency, note.playTimeInSecondsRelativeToStartTime);
					});
				}
			});
		}, updateIntervalInMiliseconds);
	}

	stop(when: number = globalContext.currentTime): void {
		if (this.setIntervalId !== null) {
			window.clearInterval(this.setIntervalId);
			this.setIntervalId = null;
		}
	}
}

export class MidiNode {
	private frequencyDestinations: Destination[] = [];
	private triggerDestinations: Destination[] = [];
	private midiAccess: MIDIAccess | null = null;


	connect(destination: CustomAudioNode | AudioParam, output: 'frequency' | 'trigger'): void {
		if (output === 'frequency') {
			this.frequencyDestinations.push(destination);
		} else {
			this.triggerDestinations.push(destination);
		}
	}

	disconnect(destination: CustomAudioNode | AudioParam, output: 'frequency' | 'trigger'): void {
		if (output === 'frequency') {
			this.frequencyDestinations = this.frequencyDestinations.filter((d) => d !== destination);
		} else {
			this.triggerDestinations = this.triggerDestinations.filter((d) => d !== destination);
		}
	}

	start(): void {
		navigator.requestMIDIAccess().then((midiAccess) => {
			this.midiAccess = midiAccess;

			this.midiAccess.inputs.forEach((input) => {
				input.addEventListener('midimessage', (event: any) => {
					const [status, note, velocity] = event.data;
	
					if (status === 144) {
						this.triggerDestinations.forEach((destination) => {
							if (destination instanceof AudioParam) {
								destination.setValueAtTime(velocity / 127, globalContext.currentTime);
								return 
							}
	
							if (isCustomAudioScheduledSourceNode(destination)) {
								destination.start(globalContext.currentTime);
							}
						});
					}
	
					if (status === 128) {
						this.triggerDestinations.forEach((destination) => {
							if (destination instanceof AudioParam) {
								return 
							}
	
							if (isCustomAudioScheduledSourceNode(destination)) {
								destination.stop(globalContext.currentTime);
							}
						});
					}
	
					this.frequencyDestinations.forEach((destination) => {
						if (destination instanceof AudioParam) {
							destination.setValueAtTime(midiNoteToFrequency(note), globalContext.currentTime);
						}
					});
				});
			});
		});
	}

	stop(): void {}
}

/* FUNCTIONS */

export function createAudioCanvas(
	audioElements: SerializedAudioElements,
	audioNodeDatabase: AudioNodeDatabase
): void {
	const audioElementsWithIds = addIdsToAudioElements(audioElements);

	Object.entries(audioElementsWithIds).forEach(([id, audioElement]) => {
		const createdAudioNode = createCustomAudioNode(audioElement);

		if (createdAudioNode !== null) {
			audioNodeDatabase[id] = createdAudioNode;
		}
	});

	Object.values(audioElementsWithIds).forEach((audioElementA) => {

		if (audioElementA.inputs) {
			for (const input of audioElementA.inputs) {
				const inputId = typeof input === 'string' ? input : input.id;
				const output = typeof input === 'string' ? undefined : input.output;

				const audioElementB = audioElementsWithIds[inputId];

				if (audioElementB === undefined) {
					throw new Error(`Audio element with id ${inputId} not found`);
				}

				connectAudioElements(audioElementB, audioElementA, audioNodeDatabase, output);
			}
		}
	});

	Object.values(audioElementsWithIds).forEach((audioElement) => {
		if (audioElement.parameters) {
			for (const parameterName in audioElement.parameters) {
				connectAudioElementsToParameter(
					audioElement,
					audioElementsWithIds,
					parameterName,
					audioNodeDatabase
				);
			}
		}
	})

	Object.entries(audioElementsWithIds).forEach(([id, audioElement]) => {
		if (isSerializedOscillatorNode(audioElement)) {
			const audioNode = audioNodeDatabase[id] as CustomOscillatorNode;

			if (audioNode !== undefined) {
				audioNode.webApiNode.type = audioElement.oscillatorType;
			}
		}
	});
}

function connectAudioElementsToParameter(
	audioElementA: SerializedAudioElementWithId<string, string>,
	audioElementsWithIds: SerializedAudioElementsWithIds,
	parameterName: string,
	audioNodeDatabase: AudioNodeDatabase
): void {
	const audioNodeA = audioNodeDatabase[audioElementA.id];
	const parameterValue = audioElementA.parameters?.[parameterName];

	if (Array.isArray(parameterValue)) {
		for (const input of parameterValue) {
			const inputId = typeof input === 'string' ? input : input.id;
			const output = typeof input === 'string' ? undefined : input.output;
			const audioElementB = audioElementsWithIds[inputId];

			if (audioElementB === undefined) {
				throw new Error(`Audio element with id ${inputId} not found`);
			}

			const audioNodeB = audioNodeDatabase[audioElementB.id];

			if (audioNodeA !== undefined && audioNodeB !== undefined) {
				audioNodeB.connect(accessParameter(audioNodeA, parameterName), output);
			}
		}
	} else if (typeof parameterValue === 'number' && audioNodeA !== undefined) {
		accessParameter(audioNodeA, parameterName).value = parameterValue;
	}
}

export function playAudioCanvas(audioNodeDatabase: AudioNodeDatabase): void {
	for (const id in audioNodeDatabase) {
		const audioNode = audioNodeDatabase[id];

		if (audioNode === undefined) {
			throw new Error(`Audio node with id ${id} not found`);
		}

		if (isCustomAudioScheduledSourceNode(audioNode)) {
			audioNode.start();
		}
	}
}

function connectAudioElements(
	audioElementA: SerializedAudioElementWithId<string, string>,
	audioElementB: SerializedAudioElementWithId<string, string>,
	audioNodeDatabase: AudioNodeDatabase,
	output?: string
): void {
	const audioNodeA = audioNodeDatabase[audioElementA.id];
	const audioNodeB = audioNodeDatabase[audioElementB.id];

	if (audioNodeA !== undefined && audioNodeB !== undefined) {
		audioNodeA.connect(audioNodeB, output);
	}
}

function createCustomAudioNode(
	audioElement: SerializedAudioElement<string, string>
): CustomAudioNode | null {
	switch (audioElement.type) {
		case 'oscillator':
			return new CustomOscillatorNode();
		case 'gain':
			return new CustomGainNode();
		case 'destination':
			return new DestinationNode();
		case 'trigger':
			return new TriggerNode((audioElement as SerializedTriggerNode).tempoInBpm);
		case 'envelope': {
			const envelopeNode = audioElement as SerializedEnvelopeNode;
			return new EnvelopeNode(envelopeNode.attack, envelopeNode.decay, envelopeNode.sustain, envelopeNode.release);
		}
		case 'sequencer': {
			const sequencerNode = audioElement as SerializedSequencerNode;
			return new SequencerNode(
				sequencerNode.tempoInBpm,
				sequencerNode.notes,
				sequencerNode.loopLength,
			);
		}
		case 'midi':
			return new MidiNode();
		default:
			return null;
	}
}

function addIdsToAudioElements(
	audioElements: SerializedAudioElements
): SerializedAudioElementsWithIds {
	const audioElementsWithIds: SerializedAudioElementsWithIds = {};

	Object.entries(audioElements).forEach(([id, audioElement]) => {
		audioElementsWithIds[id] = { ...audioElement, id };
	});

	return audioElementsWithIds;
}

function accessParameter(
	audioNode: CustomAudioNode,
	parameterName: string
): AudioParam {
	if (audioNode instanceof CustomOscillatorNode) {
		switch (parameterName) {
			case 'frequency':
				return audioNode.webApiNode.frequency;
			case 'detune':
				return audioNode.webApiNode.detune;
		}
	}

	if (audioNode instanceof CustomGainNode) {
		switch (parameterName) {
			case 'gain':
				return audioNode.webApiNode.gain;
		}
	}

	throw new Error(`Parameter ${parameterName} not found`);
}

function isSerializedOscillatorNode(
	serializedAudioElement: SerializedAudioElement<string, string>
): serializedAudioElement is SerializedOscillatorNode {
	return serializedAudioElement.type === 'oscillator';
}

function midiNoteToFrequency(midiNote: number): number {
	return Math.pow(2, (midiNote - 69) / 12) * 440;
}

function noteStringToFrequency(noteString: string): number {
	const note = noteString.split('');
	const octave = Number(note.pop());
	const noteName = note.join('');
	const frequency = noteFrequencies[noteName] ?? 0

	return frequency * Math.pow(2, octave);
}

const noteFrequencies: Record<string, number> = {
	C: 16.35,
	'C#': 17.32,
	D: 18.35,
	'D#': 19.45,
	E: 20.60,
	F: 21.83,
	'F#': 23.12,
	G: 24.50,
	'G#': 25.96,
	A: 27.50,
	'A#': 29.14,
	B: 30.87,
}
