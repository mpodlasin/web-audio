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
	ui?: UIInformation;
};

export type Position = {
	x: number;
	y: number;
};

export type UIInformation = {
	position: Position;
};

export type SerializedAudioElementWithId<
	T extends string,
	P extends string
> = SerializedAudioElement<T, P> & {
	id: string;
};

export type Inputs = (string | { id: string; output: string })[];

export type SerializedAudioParameter = number | Inputs;

export type SerializedOscillatorNode = SerializedAudioElement<
	'oscillator',
	'frequency' | 'detune'
> & {
	oscillatorType: OscillatorType;
};

export type SerializedGainNode = SerializedAudioElement<'gain', 'gain'>;

export type SerializedDestinationNode = SerializedAudioElement<'destination', never>;

export type SerializedTriggerNode = SerializedAudioElement<'trigger', never> & {
	tempoInBpm: number;
};

export type SerializedSequencerNode = SerializedAudioElement<'sequencer', never> & {
	tempoInBpm: number;
	notes: SerializedSequencerNote[];
	loopLength: number;
};

export type SerializedMidiNode = SerializedAudioElement<'midi', never>;

export type SerializedSequencerNote = {
	note: string;
	time: number;
	duration: number;
};

export type SerializedEnvelopeNode = SerializedAudioElement<'envelope', never> & {
	attack: number;
	decay: number;
	sustain: number;
	release: number;
};

export type AllowedSerializedAudioElements =
	| SerializedOscillatorNode
	| SerializedGainNode
	| SerializedDestinationNode
	| SerializedTriggerNode
	| SerializedEnvelopeNode
	| SerializedSequencerNode
	| SerializedMidiNode;

export const allowedSerializedAudioElementStaticDefinitions: {
	[key in AllowedSerializedAudioElements['type']]: {
		inputs: string[];
		outputs: string[];
		parameters: {
			[key: string]: {
				minValue: number;
				maxValue: number;
				unit?: string;
				defaultValue?: number;
			};
		};
	};
} = {
	sequencer: {
		inputs: [],
		outputs: ['frequency', 'trigger'],
		parameters: {}
	},
	oscillator: {
		inputs: [],
		outputs: ['audio'],
		parameters: {
			frequency: {
				minValue: 0,
				maxValue: 10000,
				unit: 'Hz',
				defaultValue: 440
			},
			detune: {
				minValue: -4800,
				maxValue: 4800,
				unit: 'cents',
				defaultValue: 0
			}
		}
	},
	gain: {
		inputs: ['audio'],
		outputs: ['audio'],
		parameters: {
			gain: {
				minValue: 0,
				maxValue: 1,
				defaultValue: 1
			}
		}
	},
	destination: {
		inputs: ['audio'],
		outputs: [],
		parameters: {}
	},
	trigger: {
		inputs: [],
		outputs: ['trigger'],
		parameters: {}
	},
	envelope: {
		inputs: ['trigger'],
		outputs: ['envelope'],
		parameters: {}
	},
	midi: {
		inputs: [],
		outputs: ['frequency', 'trigger'],
		parameters: {}
	}
};

export const addNode = <S extends SerializedAudioElements>(
	audioGraph: S,
	type: AllowedSerializedAudioElements['type']
): S => {
	const idsSoFar = Object.keys(audioGraph);

	const nextId = Math.max(...idsSoFar.map((id) => parseInt(id, 10))) + 1;

	const staticNodeDefinition = allowedSerializedAudioElementStaticDefinitions[type];

	return {
		...audioGraph,
		[nextId]: {
			type,
			inputs: [],
			parameters: Object.fromEntries(
				Object.entries(staticNodeDefinition.parameters).map(([key, value]) => [
					key,
					value.defaultValue
				])
			)
		}
	};
};

export type Plug = {
	type: 'input' | 'output';
	nodeId: string;
	id: string;
};

export const addConnection = <S extends SerializedAudioElements>(
	audioGraph: S,
	startingPlug: Plug,
	endingPlug: Plug
): S => {
	if (startingPlug.type === endingPlug.type) {
		throw new Error(`You tried connecting two ${startingPlug.type}s together`);
	}

	if (startingPlug.nodeId === endingPlug.nodeId) {
		throw new Error(`You tried connecting a node to itself`);
	}

	let newAudioGraph: S;

	if (endingPlug.type === 'input' && startingPlug.type === 'output') {
		const startingNode = audioGraph[startingPlug.nodeId];
		const endingNode = audioGraph[endingPlug.nodeId];

		if (startingNode === undefined) {
			throw new Error(`Audio element with id ${startingPlug.nodeId} not found`);
		}

		if (endingNode === undefined) {
			throw new Error(`Audio element with id ${endingPlug.nodeId} not found`);
		}

		const startingNodeStaticDefinition =
			allowedSerializedAudioElementStaticDefinitions[startingNode.type];

		newAudioGraph = {
			...audioGraph,
			[endingPlug.nodeId]: {
				...endingNode,
				inputs: [
					...(endingNode.inputs ?? []),
					startingNodeStaticDefinition.outputs[0] === startingPlug.id
						? startingPlug.nodeId
						: { id: startingPlug.nodeId, output: startingPlug.id }
				]
			}
		};
	} else if (endingPlug.type === 'output' && startingPlug.type === 'input') {
		const startingNode = audioGraph[startingPlug.nodeId];
		const endingNode = audioGraph[endingPlug.nodeId];

		if (startingNode === undefined) {
			throw new Error(`Audio element with id ${startingPlug.nodeId} not found`);
		}

		if (endingNode === undefined) {
			throw new Error(`Audio element with id ${endingPlug.nodeId} not found`);
		}

		const endingNodeStaticDefinition =
			allowedSerializedAudioElementStaticDefinitions[endingNode.type];

		newAudioGraph = {
			...audioGraph,
			[startingPlug.nodeId]: {
				...startingNode,
				inputs: [
					...(startingNode.inputs ?? []),
					endingNodeStaticDefinition.outputs[0] === endingPlug.id
						? endingPlug.nodeId
						: { id: endingPlug.nodeId, output: endingPlug.id }
				]
			}
		};
	} else {
		newAudioGraph = { ...audioGraph };
	}

	return newAudioGraph;
};

export const removeConnection = <S extends SerializedAudioElements>(
	audioGraph: S,
	startingPlug: Plug,
	endingPlug: Plug
): S => {
	if (startingPlug.type === endingPlug.type) {
		throw new Error(`You tried unconnecting two ${startingPlug.type}s together`);
	}

	if (startingPlug.nodeId === endingPlug.nodeId) {
		throw new Error(`You tried unconnecting a node from itself`);
	}

	let newAudioGraph: S;

	if (endingPlug.type === 'input' && startingPlug.type === 'output') {
		const endingNode = audioGraph[endingPlug.nodeId];

		if (endingNode === undefined) {
			throw new Error(`Audio element with id ${endingPlug.nodeId} not found`);
		}

		newAudioGraph = {
			...audioGraph,
			[endingPlug.nodeId]: {
				...endingNode,
				inputs: (endingNode.inputs ?? []).filter((input) => {
					if (typeof input === 'string') {
						return input !== startingPlug.nodeId;
					} else {
						return false;
					}
				})
			}
		};
	} else {
		newAudioGraph = { ...audioGraph };
	}

	return newAudioGraph;
};

export const changeParameter = <S extends SerializedAudioElements>(
	audioGraph: S,
	nodeId: string,
	parameterName: string,
	value: number
): S => {
	const node = audioGraph[nodeId];

	if (node === undefined) {
		throw new Error(`Audio element with id ${nodeId} not found`);
	}

	return {
		...audioGraph,
		[nodeId]: {
			...node,
			parameters: {
				...node.parameters,
				[parameterName]: value
			} as any /* TODO: Fix this */
		}
	};
};

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

export interface CustomAudioNodeWithWebApiNode<T extends AudioNode = AudioNode>
	extends CustomAudioNode {
	readonly webApiNode: T;
}

export function isCustomAudioNodeWithWebApiNode(
	customAudioNode: CustomAudioNode
): customAudioNode is CustomAudioNodeWithWebApiNode {
	return 'webApiNode' in customAudioNode;
}

export class GenericCustomAudioNodeWithWebApiNode<T extends AudioNode>
	implements CustomAudioNodeWithWebApiNode<T>
{
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

export class CustomAudioNodeWithWebApiAudioScheduledSourceNode<T extends AudioScheduledSourceNode>
	extends GenericCustomAudioNodeWithWebApiNode<T>
	implements CustomAudioScheduledSourceNode
{
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

	constructor(private tempoInBPM: number) {}

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
					return;
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

export class SequencerNode {
	private frequencyDestinations: Destination[] = [];
	private triggerDestinations: Destination[] = [];
	private setIntervalId: number | null = null;

	constructor(
		private tempoInBPM: number,
		private notes: SerializedSequencerNote[],
		private loopLengthInSeconds: number
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
		let scheduledTime = startTime;

		const notesToPlay = this.notes
			.map((note) => {
				return {
					time: startTime + note.time,
					duration: note.duration,
					frequency: noteStringToFrequency(note.note)
				};
			})
			.filter((note) => note.time < lookAheadInSeconds);

		notesToPlay.forEach((note) => {
			this.scheduleNote(note.time, note.duration, note.frequency);
		});

		scheduledTime = startTime + lookAheadInSeconds;

		this.setIntervalId = window.setInterval(() => {
			const currentTime = globalContext.currentTime;
			const numberOfFullyScheduledLoops = Math.floor(
				(scheduledTime - startTime) / this.loopLengthInSeconds
			);

			const mappedNotes = [
				...this.notes.map((note) => {
					return {
						time: startTime + note.time + numberOfFullyScheduledLoops * this.loopLengthInSeconds,
						duration: note.duration,
						frequency: noteStringToFrequency(note.note)
					};
				}),
				...this.notes.map((note) => {
					return {
						time:
							startTime + note.time + (numberOfFullyScheduledLoops + 1) * this.loopLengthInSeconds,
						duration: note.duration,
						frequency: noteStringToFrequency(note.note)
					};
				})
			];

			const notesToPlay = mappedNotes.filter(
				(note) => scheduledTime <= note.time && note.time < scheduledTime + lookAheadInSeconds
			);

			notesToPlay.forEach((note) => {
				this.scheduleNote(note.time, note.duration, note.frequency);
			});

			scheduledTime = currentTime + lookAheadInSeconds;
		}, updateIntervalInMiliseconds);
	}

	stop(when: number = globalContext.currentTime): void {
		if (this.setIntervalId !== null) {
			window.clearInterval(this.setIntervalId);
			this.setIntervalId = null;
		}
	}

	private scheduleNote(time: number, duration: number, frequency: number): void {
		this.triggerDestinations.forEach((destination) => {
			if (destination instanceof AudioParam) {
				return;
			}

			if (isCustomAudioScheduledSourceNode(destination)) {
				destination.start(time);
				destination.stop(time + duration);
			}
		});

		this.frequencyDestinations.forEach((destination) => {
			if (destination instanceof AudioParam) {
				destination.setValueAtTime(frequency, time);
			}
		});
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
				input.addEventListener('midimessage', this.handleMidiMessage.bind(this) as any);
			});
		});
	}

	stop(): void {
		if (this.midiAccess !== null) {
			this.midiAccess.inputs.forEach((input) => {
				input.removeEventListener('midimessage', this.handleMidiMessage.bind(this) as any);
			});
		}
	}

	private handleMidiMessage(event: MIDIMessageEvent) {
		const [status, note] = event.data;

		if (status === 144) {
			this.triggerDestinations.forEach((destination) => {
				if (destination instanceof AudioParam) {
					return;
				}

				if (isCustomAudioScheduledSourceNode(destination)) {
					destination.start(globalContext.currentTime);
				}
			});
		}

		if (status === 128) {
			this.triggerDestinations.forEach((destination) => {
				if (destination instanceof AudioParam) {
					return;
				}

				if (isCustomAudioScheduledSourceNode(destination)) {
					destination.stop(globalContext.currentTime);
				}
			});
		}

		if (note) {
			this.frequencyDestinations.forEach((destination) => {
				if (destination instanceof AudioParam) {
					destination.setValueAtTime(midiNoteToFrequency(note), globalContext.currentTime);
				}
			});
		}
	}
}

export type AudioNodeDatabase = {
	[key: string]: CustomAudioNode;
};

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

	Object.values(audioElementsWithIds).forEach((audioElement) => {
		findInputsAndConnectAudioElements(audioElement, audioElementsWithIds, audioNodeDatabase);
	});

	Object.values(audioElementsWithIds).forEach((audioElement) => {
		connectAudioElementsToParameters(audioElement, audioElementsWithIds, audioNodeDatabase);
	});

	Object.entries(audioElementsWithIds).forEach(([id, audioElement]) => {
		if (isSerializedOscillatorNode(audioElement)) {
			const audioNode = audioNodeDatabase[id] as CustomOscillatorNode;

			if (audioNode !== undefined) {
				audioNode.webApiNode.type = audioElement.oscillatorType;
			}
		}
	});
}

function connectAudioElementsToParameters(
	audioElementA: SerializedAudioElementWithId<string, string>,
	audioElementsWithIds: SerializedAudioElementsWithIds,
	audioNodeDatabase: AudioNodeDatabase
): void {
	if (audioElementA.parameters) {
		for (const parameterName in audioElementA.parameters) {
			connectAudioElementsToParameter(
				audioElementA,
				audioElementsWithIds,
				parameterName,
				audioNodeDatabase
			);
		}
	}
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
			if (!(audioNode instanceof EnvelopeNode)) {
				audioNode.start();
			}
		}
	}
}

function findInputsAndConnectAudioElements(
	audioElementA: SerializedAudioElementWithId<string, string>,
	audioElementsWithIds: SerializedAudioElementsWithIds,
	audioNodeDatabase: AudioNodeDatabase
): void {
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

function disconnectAudioElements(
	audioElementA: SerializedAudioElementWithId<string, string>,
	audioElementB: SerializedAudioElementWithId<string, string>,
	audioNodeDatabase: AudioNodeDatabase,
	output?: string
): void {
	const audioNodeA = audioNodeDatabase[audioElementA.id];
	const audioNodeB = audioNodeDatabase[audioElementB.id];

	if (audioNodeA !== undefined && audioNodeB !== undefined) {
		audioNodeA.disconnect(audioNodeB, output);
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
			return new EnvelopeNode(
				envelopeNode.attack,
				envelopeNode.decay,
				envelopeNode.sustain,
				envelopeNode.release
			);
		}
		case 'sequencer': {
			const sequencerNode = audioElement as SerializedSequencerNode;
			return new SequencerNode(
				sequencerNode.tempoInBpm,
				sequencerNode.notes,
				sequencerNode.loopLength
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

function accessParameter(audioNode: CustomAudioNode, parameterName: string): AudioParam {
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

export const updateAudioCanvas = (
	newAudioElements: SerializedAudioElements,
	oldAudioElements: SerializedAudioElements,
	audioNodeDatabase: AudioNodeDatabase
) => {
	Object.entries(newAudioElements).forEach(([id, newAudioElement]) => {
		const oldAudioElement = oldAudioElements[id];

		if (oldAudioElement === undefined) {
			const createdAudioNode = createCustomAudioNode(newAudioElement);

			if (createdAudioNode !== null) {
				audioNodeDatabase[id] = createdAudioNode;

				connectAudioElementsToParameters(
					{
						...newAudioElement,
						id
					},
					addIdsToAudioElements(newAudioElements),
					audioNodeDatabase
				);

				findInputsAndConnectAudioElements(
					{
						...newAudioElement,
						id
					},
					addIdsToAudioElements(newAudioElements),
					audioNodeDatabase
				);
			}

			return;
		}

		const audioNode = audioNodeDatabase[id];

		if (!audioNode) {
			throw new Error(`Audio node with id ${id} not found`);
		}

		const changedParametersWithValues = getChangedParameters(newAudioElement, oldAudioElement);

		changedParametersWithValues.forEach(([parameterName, parameterValue]) => {
			accessParameter(audioNode, parameterName).value = parameterValue;
		});

		const addedInputs = getAddedInputs(newAudioElement, oldAudioElement);

		addedInputs.forEach((input) => {
			const inputId = typeof input === 'string' ? input : input.id;
			const output = typeof input === 'string' ? undefined : input.output;

			const audioElementB = newAudioElements[inputId];

			if (audioElementB === undefined) {
				throw new Error(`Audio element with id ${inputId} not found`);
			}

			connectAudioElements(
				{
					...audioElementB,
					id: inputId
				},
				{
					...newAudioElement,
					id
				},
				audioNodeDatabase,
				output
			);
		});

		const removedInputs = getRemovedInputs(newAudioElement, oldAudioElement);

		removedInputs.forEach((input) => {
			const inputId = typeof input === 'string' ? input : input.id;
			const output = typeof input === 'string' ? undefined : input.output;

			const audioElementB = newAudioElements[inputId];

			if (audioElementB === undefined) {
				throw new Error(`Audio element with id ${inputId} not found`);
			}

			disconnectAudioElements(
				{
					...audioElementB,
					id: inputId
				},
				{
					...newAudioElement,
					id
				},
				audioNodeDatabase,
				output
			);
		});
	});
};

function getAddedInputs(
	newAudioElement: SerializedAudioElement<string, string>,
	oldAudioElement: SerializedAudioElement<string, string>
) {
	const addedInputs: Inputs = [];

	if (newAudioElement.inputs && oldAudioElement.inputs) {
		for (const input of newAudioElement.inputs) {
			if (typeof input === 'string' && !oldAudioElement.inputs.includes(input)) {
				addedInputs.push(input);
			}

			if (
				typeof input !== 'string' &&
				!oldAudioElement.inputs.some((i) => typeof i !== 'string' && i.id === input.id)
			) {
				addedInputs.push(input);
			}
		}
	}

	return addedInputs;
}

function getRemovedInputs(
	newAudioElement: SerializedAudioElement<string, string>,
	oldAudioElement: SerializedAudioElement<string, string>
) {
	const removedInputs: Inputs = [];

	if (newAudioElement.inputs && oldAudioElement.inputs) {
		for (const input of oldAudioElement.inputs) {
			if (typeof input === 'string' && !newAudioElement.inputs.includes(input)) {
				removedInputs.push(input);
			}

			if (
				typeof input !== 'string' &&
				!newAudioElement.inputs.some((i) => typeof i !== 'string' && i.id === input.id)
			) {
				removedInputs.push(input);
			}
		}
	}

	return removedInputs;
}

function getChangedParameters(
	newAudioElement: SerializedAudioElement<string, string>,
	oldAudioElement: SerializedAudioElement<string, string>
): [string, number][] {
	const changedParameters: [string, number][] = [];

	if (newAudioElement.parameters && oldAudioElement.parameters) {
		for (const parameterName in newAudioElement.parameters) {
			const newParameterValue = newAudioElement.parameters[parameterName];
			const oldParameterValue = oldAudioElement.parameters[parameterName];

			if (
				typeof newParameterValue === 'number' &&
				typeof oldParameterValue === 'number' &&
				newParameterValue !== oldParameterValue
			) {
				changedParameters.push([parameterName, newParameterValue]);
			}
		}
	}

	return changedParameters;
}
