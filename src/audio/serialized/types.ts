export type SerializedAudioElements = {
	[key: string]: AllowedSerializedAudioElements;
};

export type SerializedAudioElementsWithIds = {
	[key: string]: SerializedAudioElementWithId<AllowedSerializedAudioElements['type'], string>;
};

export type SerializedAudioElement<
	T extends AllowedSerializedAudioElements['type'],
	P extends string
> = {
	type: T;
	inputs?: Inputs;
	parameters?: {
		[key in P]: SerializedAudioParameter;
	} & {
		[key: string]: SerializedAudioParameter;
	};
	ui?: UIInformation;
};

export type Position = {
	x: number;
	y: number;
};

export type UIInformation = {
	position: Position;
	primmaryColor?: string;
};

export type SerializedAudioElementWithId<
	T extends AllowedSerializedAudioElements['type'],
	P extends string
> = SerializedAudioElement<T, P> & {
	id: string;
};

export type Inputs = { id: string; output: string; input: string }[];

export type SerializedAudioParameter = {
	base: number;
	inputs: { id: string; output: string; multiply?: number }[];
};

export type SerializedSineOscillatorNode = SerializedAudioElement<
	'sine-oscillator',
	'frequency' | 'detune'
>;

export type SerializedSawOscillatorNode = SerializedAudioElement<
	'saw-oscillator',
	'frequency' | 'detune'
>;

export type SerializedSquareOscillatorNode = SerializedAudioElement<
	'square-oscillator',
	'frequency' | 'detune'
>;

export type SerializedTriangleOscillatorNode = SerializedAudioElement<
	'triangle-oscillator',
	'frequency' | 'detune'
>;

export type SerializedLowpassFilterNode = SerializedAudioElement<'lowpass-filter', 'frequency'>;

export type SerializedBandpassFilterNode = SerializedAudioElement<'bandpass-filter', 'frequency'>;

export type SerializedHighpassFilterNode = SerializedAudioElement<'highpass-filter', 'frequency'>;

export type SerializedGainNode = SerializedAudioElement<'gain', 'gain'>;

export type SerializedMultiplyNode = SerializedAudioElement<'multiply', 'factor'>;

export type SerializedDestinationNode = SerializedAudioElement<'destination', never>;

export type SerializedClockNode = SerializedAudioElement<'clock', 'tempo'>;

export type SerializedPanNode = SerializedAudioElement<'pan', 'pan'>;

export type SerializedSequencerNode = SerializedAudioElement<'sequencer', never>;

export type SerializedMidiNode = SerializedAudioElement<'midi', never>;

export type SerializedSequencerNote = {
	note: string;
	time: number;
	duration: number;
};

export type SerializedAREnvelopeNode = SerializedAudioElement<'ar-envelope', 'attack' | 'release'>;

export type SerializedADEnvelopeNode = SerializedAudioElement<'ad-envelope', 'attack' | 'decay'>;

export type SerializedOscilloscopeNode = SerializedAudioElement<'oscilloscope', 'slow'>;

export type SerializedConvolutionNode = SerializedAudioElement<'convolution', never>;

export type SerializedDelayNode = SerializedAudioElement<'delay', 'delayTime'>;

export type SerializedPitchQuantizerNode = SerializedAudioElement<'pitch-quantizer', never>;

export type SerializedBipolarToUnipolar = SerializedAudioElement<'bipolar-to-unipolar', never>;

export type SerializedGateLengthNode = SerializedAudioElement<'gate-length', 'length'>;

export type SerializedMeasureGateNode = SerializedAudioElement<'measure-gate', never>;

export type SerializedSineLFONode = SerializedAudioElement<'sine-lfo', never>;

export type SerializedSawLFONode = SerializedAudioElement<'saw-lfo', never>;

export type SerializedTriangleLFONode = SerializedAudioElement<'triangle-lfo', never>;

export type SerializedSquareLFONode = SerializedAudioElement<'square-lfo', never>;

export type SerializedPatternNode = SerializedAudioElement<'pattern', never>;

export type SerializedTutorialNode = SerializedAudioElement<'tutorial', never> & {
	tutorialId: string;
};

export type AllowedSerializedAudioElements =
	| SerializedSineOscillatorNode
	| SerializedSawOscillatorNode
	| SerializedTriangleOscillatorNode
	| SerializedSquareOscillatorNode
	| SerializedLowpassFilterNode
	| SerializedHighpassFilterNode
	| SerializedBandpassFilterNode
	| SerializedGainNode
	| SerializedDestinationNode
	| SerializedClockNode
	| SerializedADEnvelopeNode
	| SerializedAREnvelopeNode
	| SerializedSequencerNode
	| SerializedMidiNode
	| SerializedOscilloscopeNode
	| SerializedConvolutionNode
	| SerializedDelayNode
	| SerializedPitchQuantizerNode
	| SerializedMultiplyNode
	| SerializedPanNode
	| SerializedBipolarToUnipolar
	| SerializedGateLengthNode
	| SerializedMeasureGateNode
	| SerializedSineLFONode
	| SerializedSawLFONode
	| SerializedTriangleLFONode
	| SerializedSquareLFONode
	| SerializedPatternNode
	| SerializedTutorialNode;

export type NodeType = AllowedSerializedAudioElements['type'];
