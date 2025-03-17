export type SerializedAudioElements = {
	[key: string]: AllowedSerializedAudioElements;
};

export type SerializedAudioElementsWithIds = {
	[key: string]: SerializedAudioElementWithId<NodeType>;
};

export type SerializedAudioElement<T extends NodeType> = {
	type: T;
	inputs: Inputs;
	parameters: {
		[key: string]: SerializedAudioParameter;
	};
	ui: UIInformation;
};

export type Position = {
	x: number;
	y: number;
};

export type UIInformation = {
	position: Position;
	primaryColor: string;
};

export type SerializedAudioElementWithId<T extends NodeType> = SerializedAudioElement<T> & {
	id: string;
};

export type Inputs = { id: string; output: string; input: string }[];

export type SerializedAudioParameter = {
	base: number;
	inputs: { id: string; output: string; multiply?: number }[];
};

export type SerializedSineOscillatorNode = SerializedAudioElement<'sine-oscillator'>;

export type SerializedSawOscillatorNode = SerializedAudioElement<'saw-oscillator'>;

export type SerializedSquareOscillatorNode = SerializedAudioElement<'square-oscillator'>;

export type SerializedTriangleOscillatorNode = SerializedAudioElement<'triangle-oscillator'>;

export type SerializedLowpassFilterNode = SerializedAudioElement<'lowpass-filter'>;

export type SerializedBandpassFilterNode = SerializedAudioElement<'bandpass-filter'>;

export type SerializedHighpassFilterNode = SerializedAudioElement<'highpass-filter'>;

export type SerializedGainNode = SerializedAudioElement<'gain'>;

export type SerializedMultiplyNode = SerializedAudioElement<'multiply'>;

export type SerializedDestinationNode = SerializedAudioElement<'destination'>;

export type SerializedClockNode = SerializedAudioElement<'clock'>;

export type SerializedPanNode = SerializedAudioElement<'pan'>;

export type SerializedSequencerNode = SerializedAudioElement<'sequencer'>;

export type SerializedMidiNode = SerializedAudioElement<'midi'>;

export type SerializedADEnvelopeNode = SerializedAudioElement<'ad-envelope'>;

export type SerializedOscilloscopeNode = SerializedAudioElement<'oscilloscope'>;

export type SerializedConvolutionNode = SerializedAudioElement<'convolution'>;

export type SerializedDelayNode = SerializedAudioElement<'delay'>;

export type SerializedPitchQuantizerNode = SerializedAudioElement<'pitch-quantizer'>;

export type SerializedBipolarToUnipolar = SerializedAudioElement<'bipolar-to-unipolar'>;

export type SerializedGateLengthNode = SerializedAudioElement<'gate-length'>;

export type SerializedMeasureGateNode = SerializedAudioElement<'measure-gate'>;

export type SerializedSineLFONode = SerializedAudioElement<'sine-lfo'>;

export type SerializedSawLFONode = SerializedAudioElement<'saw-lfo'>;

export type SerializedTriangleLFONode = SerializedAudioElement<'triangle-lfo'>;

export type SerializedSquareLFONode = SerializedAudioElement<'square-lfo'>;

export type SerializedPatternNode = SerializedAudioElement<'pattern'>;

export type SerializedTutorialNode = SerializedAudioElement<'tutorial'> & {
	tutorialId: string;
};

export type SerializedCommentNode = SerializedAudioElement<'comment'> & {
	comment: string;
};

export type SerializedValueNode = SerializedAudioElement<'value'>;

export type SerializedNumberNode = SerializedAudioElement<'number'>;

export type SerializedGreaterThanNode = SerializedAudioElement<'greater-than'>;

export type SerializedTimesNode = SerializedAudioElement<'times'>;

export type SerializedSpectrumNode = SerializedAudioElement<'spectrum'>;

export type SerializedSwitchNode = SerializedAudioElement<'switch'>;

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
	| SerializedTutorialNode
	| SerializedValueNode
	| SerializedNumberNode
	| SerializedCommentNode
	| SerializedGreaterThanNode
	| SerializedTimesNode
	| SerializedSpectrumNode
	| SerializedSwitchNode;

export type NodeType = AllowedSerializedAudioElements['type'];
