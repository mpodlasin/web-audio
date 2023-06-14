/**
 * @jest-environment jsdom
 */
import './mocks';
import {
	AudioNodeDatabase,
	SerializedAudioCanvas,
	createAudioCanvas,
	updateAudioCanvas
} from './AudioCanvas';
import { GainNodeMock, OscillatorNodeMock, audioContextMock } from './mocks';

describe('AudioCanvas', () => {
	describe('createAudioCanvas', () => {
		it('returns single oscillator', () => {
			const audioElements = {
				'1': {
					type: 'oscillator' as const,
					parameters: {
						frequency: 440
					},
					oscillatorType: 'sine' as const
				}
			};
			const serializedAudioCanvas: SerializedAudioCanvas = [
				{
					id: '1'
				}
			];
			const audioNodesWithInputs = createAudioCanvas(serializedAudioCanvas, audioElements, {});
			expect(audioNodesWithInputs).toHaveLength(1);
			expect(audioNodesWithInputs[0]?.audioNode).toBeInstanceOf(OscillatorNodeMock);
			expect((audioNodesWithInputs[0]?.audioNode as OscillatorNode).frequency.value).toBe(440);
			expect((audioNodesWithInputs[0]?.audioNode as OscillatorNode).type).toBe('sine');
			expect(audioNodesWithInputs[0]?.id).toBe('1');
			expect(audioNodesWithInputs[0]?.type).toBe('oscillator');
			expect(audioNodesWithInputs[0]?.inputs).toHaveLength(0);
		});

		it('returns oscillator with gain and destination', () => {
			const audioElements = {
				'1': {
					type: 'oscillator' as const,
					parameters: {
						frequency: 440
					},
					oscillatorType: 'sine' as const
				},
				'2': {
					type: 'gain' as const,
					parameters: {
						gain: 0.5
					},
					inputs: [
						{
							id: '1'
						}
					]
				},
				'3': {
					type: 'destination' as const,
					parameters: {},
					inputs: [
						{
							id: '2'
						}
					]
				}
			};
			const serializedAudioCanvas: SerializedAudioCanvas = [
				{
					id: '3'
				}
			];
			const audioNodesWithInputs = createAudioCanvas(serializedAudioCanvas, audioElements, {});
			expect(audioNodesWithInputs).toHaveLength(1);
			expect(audioNodesWithInputs[0]?.audioNode).toBe(audioContextMock.destination);
			expect(audioNodesWithInputs[0]?.id).toBe('3');
			expect(audioNodesWithInputs[0]?.type).toBe('destination');
			expect(audioNodesWithInputs[0]?.inputs).toHaveLength(1);

			const gainNode = audioNodesWithInputs[0]?.inputs[0]?.audioNode as GainNode;
			expect(gainNode).toBeInstanceOf(GainNodeMock);
			expect(gainNode.gain.value).toBe(0.5);
			expect(audioNodesWithInputs[0]?.inputs[0]?.id).toBe('2');
			expect(audioNodesWithInputs[0]?.inputs[0]?.type).toBe('gain');
			expect(audioNodesWithInputs[0]?.inputs[0]?.inputs).toHaveLength(1);
			expect(gainNode.connect).toHaveBeenCalledWith(audioContextMock.destination);

			const oscillatorNode = audioNodesWithInputs[0]?.inputs[0]?.inputs[0]
				?.audioNode as OscillatorNode;
			expect(oscillatorNode).toBeInstanceOf(OscillatorNodeMock);
			expect(oscillatorNode.frequency.value).toBe(440);
			expect(oscillatorNode.type).toBe('sine');
			expect(audioNodesWithInputs[0]?.inputs[0]?.inputs[0]?.id).toBe('1');
			expect(audioNodesWithInputs[0]?.inputs[0]?.inputs[0]?.type).toBe('oscillator');
			expect(audioNodesWithInputs[0]?.inputs[0]?.inputs[0]?.inputs).toHaveLength(0);
			expect(oscillatorNode.connect).toHaveBeenCalledWith(gainNode);
		});

		it('returns single oscillator with two parallel gains and single destination', () => {
			const audioElements = {
				'1': {
					type: 'oscillator' as const,
					parameters: {
						frequency: 440
					},
					oscillatorType: 'sine' as const
				},
				'2': {
					type: 'gain' as const,
					parameters: {
						gain: 0.5
					},
					inputs: [
						{
							id: '1'
						}
					]
				},
				'3': {
					type: 'gain' as const,
					parameters: {
						gain: 0.5
					},
					inputs: [
						{
							id: '1'
						}
					]
				},
				'4': {
					type: 'destination' as const,
					parameters: {},
					inputs: [
						{
							id: '2'
						},
						{
							id: '3'
						}
					]
				}
			};
			const serializedAudioCanvas: SerializedAudioCanvas = [
				{
					id: '4'
				}
			];
			const audioNodesWithInputs = createAudioCanvas(serializedAudioCanvas, audioElements, {});
			expect(audioNodesWithInputs).toHaveLength(1);
			expect(audioNodesWithInputs[0]?.audioNode).toBe(audioContextMock.destination);
			expect(audioNodesWithInputs[0]?.id).toBe('4');
			expect(audioNodesWithInputs[0]?.type).toBe('destination');
			expect(audioNodesWithInputs[0]?.inputs).toHaveLength(2);

			const gainNode1 = audioNodesWithInputs[0]?.inputs[0]?.audioNode as GainNode;
			expect(gainNode1).toBeInstanceOf(GainNodeMock);
			expect(gainNode1.gain.value).toBe(0.5);
			expect(audioNodesWithInputs[0]?.inputs[0]?.id).toBe('2');
			expect(audioNodesWithInputs[0]?.inputs[0]?.type).toBe('gain');
			expect(audioNodesWithInputs[0]?.inputs[0]?.inputs).toHaveLength(1);
			expect(gainNode1.connect).toHaveBeenCalledWith(audioContextMock.destination);

			const gainNode2 = audioNodesWithInputs[0]?.inputs[1]?.audioNode as GainNode;
			expect(gainNode2).toBeInstanceOf(GainNodeMock);
			expect(gainNode2.gain.value).toBe(0.5);
			expect(audioNodesWithInputs[0]?.inputs[1]?.id).toBe('3');
			expect(audioNodesWithInputs[0]?.inputs[1]?.type).toBe('gain');
			expect(audioNodesWithInputs[0]?.inputs[1]?.inputs).toHaveLength(1);
			expect(gainNode2.connect).toHaveBeenCalledWith(audioContextMock.destination);

			const oscillatorNodeFromGainNode1 = audioNodesWithInputs[0]?.inputs[0]?.inputs[0]
				?.audioNode as OscillatorNode;
			expect(oscillatorNodeFromGainNode1).toBeInstanceOf(OscillatorNodeMock);
			expect(oscillatorNodeFromGainNode1.frequency.value).toBe(440);
			expect(oscillatorNodeFromGainNode1.type).toBe('sine');
			expect(audioNodesWithInputs[0]?.inputs[0]?.inputs[0]?.id).toBe('1');
			expect(audioNodesWithInputs[0]?.inputs[0]?.inputs[0]?.type).toBe('oscillator');
			expect(audioNodesWithInputs[0]?.inputs[0]?.inputs[0]?.inputs).toHaveLength(0);
			expect(oscillatorNodeFromGainNode1.connect).toHaveBeenCalledWith(gainNode1);

			const oscillatorNodeFromGainNode2 = audioNodesWithInputs[0]?.inputs[1]?.inputs[0]
				?.audioNode as OscillatorNode;

			expect(oscillatorNodeFromGainNode2).toBe(oscillatorNodeFromGainNode1);
			expect(oscillatorNodeFromGainNode2.connect).toHaveBeenCalledWith(gainNode2);
		});

		it('returns two oscillators with single gain and single destination', () => {
			const audioElements = {
				'1': {
					type: 'oscillator' as const,
					parameters: {
						frequency: 440
					},
					oscillatorType: 'sine' as const
				},
				'2': {
					type: 'oscillator' as const,
					parameters: {
						frequency: 440
					},
					oscillatorType: 'sine' as const
				},
				'3': {
					type: 'gain' as const,
					parameters: {
						gain: 0.5
					},
					inputs: [
						{
							id: '1'
						},
						{
							id: '2'
						}
					]
				},
				'4': {
					type: 'destination' as const,
					parameters: {},
					inputs: [
						{
							id: '3'
						}
					]
				}
			};
			const serializedAudioCanvas: SerializedAudioCanvas = [
				{
					id: '4'
				}
			];
			const audioNodesWithInputs = createAudioCanvas(serializedAudioCanvas, audioElements, {});
			expect(audioNodesWithInputs).toHaveLength(1);
			expect(audioNodesWithInputs[0]?.audioNode).toBe(audioContextMock.destination);
			expect(audioNodesWithInputs[0]?.id).toBe('4');
			expect(audioNodesWithInputs[0]?.type).toBe('destination');
			expect(audioNodesWithInputs[0]?.inputs).toHaveLength(1);

			const gainNode = audioNodesWithInputs[0]?.inputs[0]?.audioNode as GainNode;
			expect(gainNode).toBeInstanceOf(GainNodeMock);
			expect(gainNode.gain.value).toBe(0.5);
			expect(audioNodesWithInputs[0]?.inputs[0]?.id).toBe('3');
			expect(audioNodesWithInputs[0]?.inputs[0]?.type).toBe('gain');
			expect(audioNodesWithInputs[0]?.inputs[0]?.inputs).toHaveLength(2);
			expect(gainNode.connect).toHaveBeenCalledWith(audioContextMock.destination);

			const oscillatorNode1 = audioNodesWithInputs[0]?.inputs[0]?.inputs[0]
				?.audioNode as OscillatorNode;
			expect(oscillatorNode1).toBeInstanceOf(OscillatorNodeMock);
			expect(oscillatorNode1.frequency.value).toBe(440);
			expect(oscillatorNode1.type).toBe('sine');
			expect(audioNodesWithInputs[0]?.inputs[0]?.inputs[0]?.id).toBe('1');
			expect(audioNodesWithInputs[0]?.inputs[0]?.inputs[0]?.type).toBe('oscillator');
			expect(oscillatorNode1.connect).toHaveBeenCalledWith(gainNode);

			const oscillatorNode2 = audioNodesWithInputs[0]?.inputs[0]?.inputs[1]
				?.audioNode as OscillatorNode;
			expect(oscillatorNode2).toBeInstanceOf(OscillatorNodeMock);
			expect(oscillatorNode2.frequency.value).toBe(440);
			expect(oscillatorNode2.type).toBe('sine');
			expect(audioNodesWithInputs[0]?.inputs[0]?.inputs[1]?.id).toBe('2');
			expect(audioNodesWithInputs[0]?.inputs[0]?.inputs[1]?.type).toBe('oscillator');
			expect(oscillatorNode2.connect).toHaveBeenCalledWith(gainNode);
		});

		it('returns oscillator as gain lfo to gain', () => {
			const audioElements = {
				'1': {
					type: 'oscillator' as const,
					parameters: {
						frequency: 440
					},
					oscillatorType: 'sine' as const
				},
				'2': {
					type: 'oscillator' as const,
					parameters: {
						frequency: 30
					},
					oscillatorType: 'sine' as const
				},
				'3': {
					type: 'gain' as const,
					parameters: {
						gain: {
							inputs: [
								{
									id: '2'
								}
							]
						}
					},
					inputs: [
						{
							id: '1'
						}
					]
				},
				'4': {
					type: 'destination' as const,
					parameters: {},
					inputs: [
						{
							id: '3'
						}
					]
				}
			};
			const serializedAudioCanvas: SerializedAudioCanvas = [
				{
					id: '4'
				}
			];

			const audioNodesWithInputs = createAudioCanvas(serializedAudioCanvas, audioElements, {});
			expect(audioNodesWithInputs).toHaveLength(1);
			expect(audioNodesWithInputs[0]?.audioNode).toBe(audioContextMock.destination);
			expect(audioNodesWithInputs[0]?.id).toBe('4');
			expect(audioNodesWithInputs[0]?.type).toBe('destination');
			expect(audioNodesWithInputs[0]?.inputs).toHaveLength(1);

			const gainNode = audioNodesWithInputs[0]?.inputs[0]?.audioNode as GainNode;
			expect(gainNode).toBeInstanceOf(GainNodeMock);
			expect(audioNodesWithInputs[0]?.inputs[0]?.id).toBe('3');
			expect(audioNodesWithInputs[0]?.inputs[0]?.type).toBe('gain');
			expect(audioNodesWithInputs[0]?.inputs[0]?.parameterInputs).toHaveProperty('gain');
			expect(audioNodesWithInputs[0]?.inputs[0]?.parameterInputs.gain).toHaveLength(1);
			expect(gainNode.connect).toHaveBeenCalledWith(audioContextMock.destination);

			const lfoOscillatorNode = audioNodesWithInputs[0]?.inputs[0]?.parameterInputs.gain?.[0]
				?.audioNode as OscillatorNode;
			expect(lfoOscillatorNode).toBeInstanceOf(OscillatorNodeMock);
			expect(lfoOscillatorNode.frequency.value).toBe(30);
			expect(lfoOscillatorNode.type).toBe('sine');
			expect(audioNodesWithInputs[0]?.inputs[0]?.parameterInputs.gain?.[0]?.id).toBe('2');
			expect(audioNodesWithInputs[0]?.inputs[0]?.parameterInputs.gain?.[0]?.type).toBe(
				'oscillator'
			);
			expect(lfoOscillatorNode.connect).toHaveBeenCalledWith(gainNode.gain);

			const oscillatorNode = audioNodesWithInputs[0]?.inputs[0]?.inputs[0]
				?.audioNode as OscillatorNode;
			expect(oscillatorNode).toBeInstanceOf(OscillatorNodeMock);
			expect(oscillatorNode.frequency.value).toBe(440);
			expect(oscillatorNode.type).toBe('sine');
			expect(audioNodesWithInputs[0]?.inputs[0]?.inputs[0]?.id).toBe('1');
			expect(audioNodesWithInputs[0]?.inputs[0]?.inputs[0]?.type).toBe('oscillator');
			expect(oscillatorNode.connect).toHaveBeenCalledWith(gainNode);
		});

		it('returns oscillator as frequency lfo to another oscillator', () => {
			const audioElements = {
				'1': {
					type: 'oscillator' as const,
					parameters: {
						frequency: {
							inputs: [
								{
									id: '2'
								}
							]
						}
					},
					oscillatorType: 'sine' as const
				},
				'2': {
					type: 'oscillator' as const,
					parameters: {
						frequency: 30
					},
					oscillatorType: 'sine' as const
				},
				'3': {
					type: 'gain' as const,
					parameters: {
						gain: 0.5
					},
					inputs: [
						{
							id: '1'
						}
					]
				},
				'4': {
					type: 'destination' as const,
					parameters: {},
					inputs: [
						{
							id: '3'
						}
					]
				}
			};
			const serializedAudioCanvas: SerializedAudioCanvas = [
				{
					id: '4'
				}
			];

			const audioNodesWithInputs = createAudioCanvas(serializedAudioCanvas, audioElements, {});
			expect(audioNodesWithInputs).toHaveLength(1);
			expect(audioNodesWithInputs[0]?.audioNode).toBe(audioContextMock.destination);
			expect(audioNodesWithInputs[0]?.id).toBe('4');
			expect(audioNodesWithInputs[0]?.type).toBe('destination');
			expect(audioNodesWithInputs[0]?.inputs).toHaveLength(1);

			const gainNode = audioNodesWithInputs[0]?.inputs[0]?.audioNode as GainNode;
			expect(gainNode).toBeInstanceOf(GainNodeMock);
			expect(audioNodesWithInputs[0]?.inputs[0]?.id).toBe('3');
			expect(audioNodesWithInputs[0]?.inputs[0]?.type).toBe('gain');
			expect(gainNode.gain.value).toBe(0.5);
			expect(gainNode.connect).toHaveBeenCalledWith(audioContextMock.destination);
			expect(audioNodesWithInputs[0]?.inputs[0]?.inputs).toHaveLength(1);

			const oscillatorNode = audioNodesWithInputs[0]?.inputs[0]?.inputs[0]
				?.audioNode as OscillatorNode;
			expect(oscillatorNode).toBeInstanceOf(OscillatorNodeMock);
			expect(oscillatorNode.connect).toHaveBeenCalledWith(gainNode);
			expect(audioNodesWithInputs[0]?.inputs[0]?.inputs[0]?.parameterInputs).toHaveProperty(
				'frequency'
			);
			expect(audioNodesWithInputs[0]?.inputs[0]?.inputs[0]?.parameterInputs.frequency).toHaveLength(
				1
			);

			const lfoOscillatorNode = audioNodesWithInputs[0]?.inputs[0]?.inputs[0]?.parameterInputs
				.frequency?.[0]?.audioNode as OscillatorNode;
			expect(lfoOscillatorNode).toBeInstanceOf(OscillatorNodeMock);
			expect(lfoOscillatorNode.frequency.value).toBe(30);
			expect(lfoOscillatorNode.type).toBe('sine');
			expect(
				audioNodesWithInputs[0]?.inputs[0]?.inputs[0]?.parameterInputs.frequency?.[0]?.id
			).toBe('2');
			expect(
				audioNodesWithInputs[0]?.inputs[0]?.inputs[0]?.parameterInputs.frequency?.[0]?.type
			).toBe('oscillator');
			expect(lfoOscillatorNode.connect).toHaveBeenCalledWith(oscillatorNode.frequency);
		});
	});

	describe('updateAudioCanvas', () => {
		it('updates oscillator frequency', () => {
			const audioElements = {
				'1': {
					type: 'oscillator' as const,
					parameters: {
						frequency: 440
					},
					oscillatorType: 'sine' as const
				},
				'2': {
					type: 'destination' as const,
					parameters: {},
					inputs: [
						{
							id: '1'
						}
					]
				}
			};
			const serializedAudioCanvas: SerializedAudioCanvas = [
				{
					id: '2'
				}
			];

			const audioNodeDatabase: AudioNodeDatabase = {};

			const audioNodesWithInputs = createAudioCanvas(
				serializedAudioCanvas,
				audioElements,
				audioNodeDatabase
			);

			const updatedAudioElements = {
				'1': {
					type: 'oscillator' as const,
					parameters: {
						frequency: 880
					},
					oscillatorType: 'sine' as const
				},
				'2': {
					type: 'destination' as const,
					parameters: {},
					inputs: [
						{
							id: '1'
						}
					]
				}
			};

			const updatedSerializedAudioCanvas: SerializedAudioCanvas = [
				{
					id: '2'
				}
			];

			const updatedAudioNodesWithInputs = updateAudioCanvas(
				updatedSerializedAudioCanvas,
				updatedAudioElements,
				audioNodeDatabase,
				audioNodesWithInputs
			);

			expect(updatedAudioNodesWithInputs).toHaveLength(1);
			expect(updatedAudioNodesWithInputs[0]?.audioNode).toBe(audioContextMock.destination);
			expect(updatedAudioNodesWithInputs[0]?.id).toBe('2');
			expect(updatedAudioNodesWithInputs[0]?.type).toBe('destination');
			expect(updatedAudioNodesWithInputs[0]?.inputs).toHaveLength(1);

			const oscillatorNode = updatedAudioNodesWithInputs[0]?.inputs[0]?.audioNode as OscillatorNode;
			expect(oscillatorNode).toBeInstanceOf(OscillatorNodeMock);
			expect(oscillatorNode.frequency.value).toBe(880);
			expect(oscillatorNode.type).toBe('sine');
			expect(updatedAudioNodesWithInputs[0]?.inputs[0]?.id).toBe('1');
			expect(updatedAudioNodesWithInputs[0]?.inputs[0]?.type).toBe('oscillator');
			expect(oscillatorNode.connect).toHaveBeenCalledWith(audioContextMock.destination);
		});

		it('adds oscillator to destination', () => {
			const audioElements = {
				'1': {
					type: 'destination' as const,
					parameters: {},
					inputs: []
				}
			};
			const serializedAudioCanvas: SerializedAudioCanvas = [
				{
					id: '1'
				}
			];
			const audioNodeDatabase: AudioNodeDatabase = {};
			const audioNodesWithInputs = createAudioCanvas(
				serializedAudioCanvas,
				audioElements,
				audioNodeDatabase
			);

			const updatedAudioElements = {
				'1': {
					type: 'destination' as const,
					parameters: {},
					inputs: [
						{
							id: '2'
						}
					]
				},
				'2': {
					type: 'oscillator' as const,
					parameters: {
						frequency: 440
					},
					oscillatorType: 'sine' as const
				}
			};

			const updatedSerializedAudioCanvas: SerializedAudioCanvas = [
				{
					id: '1'
				}
			];

			const updatedAudioNodesWithInputs = updateAudioCanvas(
				updatedSerializedAudioCanvas,
				updatedAudioElements,
				audioNodeDatabase,
				audioNodesWithInputs
			);

			expect(updatedAudioNodesWithInputs).toHaveLength(1);
			expect(updatedAudioNodesWithInputs[0]?.audioNode).toBe(audioContextMock.destination);
			expect(updatedAudioNodesWithInputs[0]?.id).toBe('1');
			expect(updatedAudioNodesWithInputs[0]?.type).toBe('destination');
			expect(updatedAudioNodesWithInputs[0]?.inputs).toHaveLength(1);

			const oscillatorNode = updatedAudioNodesWithInputs[0]?.inputs[0]?.audioNode as OscillatorNode;
			expect(oscillatorNode).toBeInstanceOf(OscillatorNodeMock);
			expect(oscillatorNode.frequency.value).toBe(440);
			expect(oscillatorNode.type).toBe('sine');
			expect(updatedAudioNodesWithInputs[0]?.inputs[0]?.id).toBe('2');
			expect(updatedAudioNodesWithInputs[0]?.inputs[0]?.type).toBe('oscillator');
			expect(oscillatorNode.connect).toHaveBeenCalledWith(audioContextMock.destination);
		});

		it('removes oscillator from destination', () => {
			const audioElements = {
				'1': {
					type: 'destination' as const,
					parameters: {},
					inputs: [
						{
							id: '2'
						}
					]
				},
				'2': {
					type: 'oscillator' as const,
					parameters: {
						frequency: 440
					},
					oscillatorType: 'sine' as const
				}
			};
			const serializedAudioCanvas: SerializedAudioCanvas = [
				{
					id: '1'
				}
			];
			const audioNodeDatabase: AudioNodeDatabase = {};
			const audioNodesWithInputs = createAudioCanvas(
				serializedAudioCanvas,
				audioElements,
				audioNodeDatabase
			);

			const oscillatorNode = audioNodesWithInputs[0]?.inputs[0]?.audioNode as OscillatorNode;

			const updatedAudioElements = {
				'1': {
					type: 'destination' as const,
					parameters: {},
					inputs: []
				},
				'2': {
					type: 'oscillator' as const,
					parameters: {
						frequency: 440
					},
					oscillatorType: 'sine' as const
				}
			};

			const updatedSerializedAudioCanvas: SerializedAudioCanvas = [
				{
					id: '1'
				}
			];

			const updatedAudioNodesWithInputs = updateAudioCanvas(
				updatedSerializedAudioCanvas,
				updatedAudioElements,
				audioNodeDatabase,
				audioNodesWithInputs
			);

			expect(updatedAudioNodesWithInputs).toHaveLength(1);
			expect(updatedAudioNodesWithInputs[0]?.audioNode).toBe(audioContextMock.destination);
			expect(updatedAudioNodesWithInputs[0]?.id).toBe('1');
			expect(updatedAudioNodesWithInputs[0]?.type).toBe('destination');
			expect(updatedAudioNodesWithInputs[0]?.inputs).toHaveLength(0);

			expect(oscillatorNode.disconnect).toHaveBeenCalledWith(audioContextMock.destination);
		});
	});
});
