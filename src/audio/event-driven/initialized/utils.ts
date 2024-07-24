import {
	ADEnvelopeNode,
	AREnvelopeNode,
	ClockNode,
	CustomBandpassFilterNode,
	CustomBipolarToUnipolarNode,
	CustomConvolutionNode,
	CustomDelayNode,
	CustomGainNode,
	CustomGateLengthNode,
	CustomHighpassFilterNode,
	CustomLowpassFilterNode,
	CustomMultiplyNode,
	CustomOscilloscopeNode,
	CustomPanNode,
	CustomPatternNode,
	CustomSawLFONode,
	CustomSawOscillatorNode,
	CustomSineLFONode,
	CustomSineOscillatorNode,
	CustomSquareLFONode,
	CustomSquareOscillatorNode,
	CustomTriangleLFONode,
	CustomTriangleOscillatorNode,
	DestinationNode,
	EmptyCustomAudioNode,
	MeasureGateNode,
	MidiNode,
	PitchQuantizerNode,
	SequencerNode,
	type CustomAudioNode
} from '../../initialized';
import type { NodeType } from '../../serialized';

export function createCustomAudioNode(id: string, nodeType: NodeType): CustomAudioNode {
	switch (nodeType) {
		case 'sine-oscillator':
			return new CustomSineOscillatorNode(id);
		case 'saw-oscillator':
			return new CustomSawOscillatorNode(id);
		case 'square-oscillator':
			return new CustomSquareOscillatorNode(id);
		case 'triangle-oscillator':
			return new CustomTriangleOscillatorNode(id);
		case 'lowpass-filter':
			return new CustomLowpassFilterNode(id);
		case 'highpass-filter':
			return new CustomHighpassFilterNode(id);
		case 'bandpass-filter':
			return new CustomBandpassFilterNode(id);
		case 'gain':
			return new CustomGainNode(id);
		case 'multiply':
			return new CustomMultiplyNode(id);
		case 'destination':
			return new DestinationNode(id);
		case 'clock':
			return new ClockNode(id);
		case 'ar-envelope':
			return new AREnvelopeNode(id);
		case 'ad-envelope':
			return new ADEnvelopeNode(id);
		case 'sequencer':
			return new SequencerNode(id);
		case 'midi':
			return new MidiNode(id);
		case 'oscilloscope':
			return new CustomOscilloscopeNode(id);
		case 'convolution':
			return new CustomConvolutionNode(id);
		case 'delay':
			return new CustomDelayNode(id);
		case 'pitch-quantizer':
			return new PitchQuantizerNode(id);
		case 'pan':
			return new CustomPanNode(id);
		case 'bipolar-to-unipolar':
			return new CustomBipolarToUnipolarNode(id);
		case 'gate-length':
			return new CustomGateLengthNode(id);
		case 'measure-gate':
			return new MeasureGateNode(id);
		case 'saw-lfo':
			return new CustomSawLFONode(id);
		case 'square-lfo':
			return new CustomSquareLFONode(id);
		case 'triangle-lfo':
			return new CustomTriangleLFONode(id);
		case 'sine-lfo':
			return new CustomSineLFONode(id);
		case 'pattern':
			return new CustomPatternNode(id);
		case 'tutorial':
			return new EmptyCustomAudioNode();
	}
}
