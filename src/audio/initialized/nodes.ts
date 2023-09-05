import { globalContext } from '../GlobalContext';
import type { SerializedSequencerNote } from '../serialized';
import { settings } from '../settings';
import { createEnvelopeNode, createTriggerNode } from '../web-audio/utils';
import {
	isCustomAudioNodeWithWebApiNode,
	type CustomAudioNode,
	type CustomAudioNodeWithWebApiNode,
	type CustomAudioScheduledSourceNode,
	isCustomAudioScheduledSourceNode
} from './types';

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
	constructor(oscillatorType: OscillatorType) {
		const oscillator = globalContext.createOscillator();
		oscillator.type = oscillatorType;
		super(oscillator);
	}
}

export class CustomGainNode extends GenericCustomAudioNodeWithWebApiNode<GainNode> {
	constructor() {
		super(globalContext.createGain());
	}
}

export class CustomOscilloscopeNode extends GenericCustomAudioNodeWithWebApiNode<AnalyserNode> {
	constructor() {
		super(globalContext.createAnalyser());
	}
}

export class EnvelopeNode extends GenericCustomAudioNodeWithWebApiNode<AudioWorkletNode> {
	constructor() {
		super(createEnvelopeNode());
	}
}

export class TriggerNode extends GenericCustomAudioNodeWithWebApiNode<AudioWorkletNode> {
	constructor() {
		super(createTriggerNode());
	}
}

export class DestinationNode extends GenericCustomAudioNodeWithWebApiNode<AudioDestinationNode> {
	constructor() {
		super(globalContext.destination);
	}
}

export type Destination = CustomAudioNode | AudioParam;
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

	/* for testing purposes       */
	/* -------------------------- */

	getFrequencyDestinations() {
		return [...this.frequencyDestinations];
	}

	getTriggerDestinations() {
		return [...this.triggerDestinations];
	}

	/* -------------------------- */

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
