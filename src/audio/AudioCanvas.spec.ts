/**
 * @jest-environment jsdom
 */
jest.fn(() => {
	const { AudioWorkletNodeMock } = jest.requireActual('./mocks');
	return new AudioWorkletNodeMock();
});

jest.mock('./web-audio/utils', () => ({
	createAdEnvelopeWorklet: jest.fn(() => {
		const { AudioWorkletNodeMock } = jest.requireActual('./mocks');
		return new AudioWorkletNodeMock();
	}),
	createClockCounterWorklet: jest.fn(() => {
		const { AudioWorkletNodeMock } = jest.requireActual('./mocks');
		return new AudioWorkletNodeMock();
	}),
	createGateLengthWorklet: jest.fn(() => {
		const { AudioWorkletNodeMock } = jest.requireActual('./mocks');
		return new AudioWorkletNodeMock();
	}),
	createMeasureGateWorklet: jest.fn(() => {
		const { AudioWorkletNodeMock } = jest.requireActual('./mocks');
		return new AudioWorkletNodeMock();
	}),
	createPatternWorklet: jest.fn(() => {
		const { AudioWorkletNodeMock } = jest.requireActual('./mocks');
		return new AudioWorkletNodeMock();
	}),
	createPitchQuantizerWorklet: jest.fn(() => {
		const { AudioWorkletNodeMock } = jest.requireActual('./mocks');
		return new AudioWorkletNodeMock();
	}),
	createSawOscillatorWorklet: jest.fn(() => {
		const { AudioWorkletNodeMock } = jest.requireActual('./mocks');
		return new AudioWorkletNodeMock();
	}),
	createScalerWorklet: jest.fn(() => {
		const { AudioWorkletNodeMock } = jest.requireActual('./mocks');
		return new AudioWorkletNodeMock();
	}),
	createSequencerWorklet: jest.fn(() => {
		const { AudioWorkletNodeMock } = jest.requireActual('./mocks');
		return new AudioWorkletNodeMock();
	}),
	createSquareOscillatorWorklet: jest.fn(() => {
		const { AudioWorkletNodeMock } = jest.requireActual('./mocks');
		return new AudioWorkletNodeMock();
	}),
	createMinMaxWorklet: jest.fn(() => {
		const { AudioWorkletNodeMock } = jest.requireActual('./mocks');
		return new AudioWorkletNodeMock();
	})
}));

import './mocks';

import {
	type AudioNodeDatabase,
	CustomSineOscillatorNode,
	CustomGainNode,
	DestinationNode,
	updateAudioCanvas,
	addConnection,
	addNode,
	changeParameter,
	removeConnection,
	removeNode,
	addConnectionToParameter,
	SequencerNode,
	CustomSquareOscillatorNode,
	insertExistingNodes,
	changeParameterMultiply,
	MidiNode,
	CustomDelayNode,
	ClockNode,
	SerializedAudioParameter
} from './AudioCanvas';
import { OscillatorNodeMock } from './mocks';

const ui = {
	position: { x: 0, y: 0 },
	primaryColor: '#000000'
};

const sequencerParameters = Object.fromEntries(
	[1, 2, 3, 4, 5, 6, 7, 8]
		.map((n) => `frequency${n}`)
		.map((parameterName) => [parameterName, { base: 440, inputs: [] }])
) as unknown as {
	frequency1: SerializedAudioParameter;
	frequency2: SerializedAudioParameter;
	frequency3: SerializedAudioParameter;
	frequency4: SerializedAudioParameter;
	frequency5: SerializedAudioParameter;
	frequency6: SerializedAudioParameter;
	frequency7: SerializedAudioParameter;
	frequency8: SerializedAudioParameter;
};

describe('AudioCanvas', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('updateAudioCanvas - creating', () => {
		it('returns single oscillator', () => {
			const audioElements = {
				'1': {
					type: 'square-oscillator' as const,
					parameters: {
						frequency: { base: 333, inputs: [] },
						detune: { base: 0, inputs: [] }
					},
					inputs: [],
					ui
				}
			};

			const audioNodeDatabase = updateAudioCanvas(audioElements, {}, {});

			expect(audioNodeDatabase['1']).toBeDefined();
			expect((audioNodeDatabase['1'] as CustomSquareOscillatorNode).leftOscillator).toBeInstanceOf(
				OscillatorNodeMock
			);
			expect((audioNodeDatabase['1'] as CustomSquareOscillatorNode).rightOscillator).toBeInstanceOf(
				OscillatorNodeMock
			);
			expect((audioNodeDatabase['1'] as CustomSquareOscillatorNode).leftOscillator.type).toBe(
				'square'
			);
			expect((audioNodeDatabase['1'] as CustomSquareOscillatorNode).rightOscillator.type).toBe(
				'square'
			);
			expect(
				(audioNodeDatabase['1'] as CustomSquareOscillatorNode).getParameter('frequency').audioParam
					.value
			).toBe(333);
		});

		it('returns oscillator connected to gain', () => {
			const audioElements = {
				'1': {
					type: 'square-oscillator' as const,
					parameters: {
						frequency: { base: 333, inputs: [] },
						detune: { base: 0, inputs: [] }
					},
					inputs: [],
					ui
				},
				'2': {
					type: 'gain' as const,
					inputs: [{ id: '1', output: 'audio', input: 'audio' }],
					parameters: {
						gain: { base: 0.5, inputs: [] }
					},
					ui
				}
			};

			const audioNodeDatabase = updateAudioCanvas(audioElements, {}, {});

			expect(audioNodeDatabase['1']).toBeDefined();
			expect(audioNodeDatabase['2']).toBeDefined();

			expect((audioNodeDatabase['1'] as CustomSquareOscillatorNode).leftOscillator.type).toBe(
				'square'
			);
			expect((audioNodeDatabase['1'] as CustomSquareOscillatorNode).rightOscillator.type).toBe(
				'square'
			);
			expect(
				(audioNodeDatabase['1'] as CustomSquareOscillatorNode).getParameter('frequency').audioParam
					.value
			).toBe(333);

			expect((audioNodeDatabase['2'] as CustomGainNode).getParameter('gain').audioParam.value).toBe(
				0.5
			);

			expect(
				(audioNodeDatabase['1'] as CustomSquareOscillatorNode).output.connect
			).toHaveBeenCalledWith((audioNodeDatabase['2'] as CustomGainNode).webApiNode);
		});

		it('returns oscillator connected to oscillator frequency', () => {
			const audioElements = {
				'1': {
					type: 'square-oscillator' as const,
					parameters: {
						frequency: { base: 440, inputs: [{ id: '2', output: 'audio' }] },
						detune: { base: 0, inputs: [] }
					},
					inputs: [],
					ui
				},
				'2': {
					type: 'sine-oscillator' as const,
					parameters: {
						frequency: { base: 30, inputs: [] },
						detune: { base: 0, inputs: [] }
					},
					inputs: [],
					ui
				}
			};
			const audioNodeDatabase: AudioNodeDatabase = updateAudioCanvas(audioElements, {}, {});

			expect(audioNodeDatabase['1']).toBeDefined();
			expect(audioNodeDatabase['2']).toBeDefined();
			expect(
				(audioNodeDatabase['2'] as CustomSquareOscillatorNode).output.connect
			).toHaveBeenCalledWith(
				(audioNodeDatabase['1'] as CustomSquareOscillatorNode)
					.getParameter('frequency')
					.getMultiplierForInput('2')
			);
			expect(
				(audioNodeDatabase['1'] as CustomSquareOscillatorNode)
					.getParameter('frequency')
					.getMultiplierForInput('2').connect
			).toHaveBeenCalledWith(
				(audioNodeDatabase['1'] as CustomSquareOscillatorNode).getParameter('frequency').audioParam
			);
			expect((audioNodeDatabase['1'] as CustomSquareOscillatorNode).leftOscillator.type).toBe(
				'square'
			);
			expect((audioNodeDatabase['1'] as CustomSquareOscillatorNode).rightOscillator.type).toBe(
				'square'
			);

			expect(
				(audioNodeDatabase['2'] as CustomSineOscillatorNode).getParameter('frequency').audioParam
					.value
			).toBe(30);
			expect((audioNodeDatabase['2'] as CustomSineOscillatorNode).leftOscillator.type).toBe('sine');
			expect((audioNodeDatabase['2'] as CustomSineOscillatorNode).rightOscillator.type).toBe(
				'sine'
			);
		});

		it('returns oscillator connected to gain connected to destination', () => {
			const audioElements = {
				'1': {
					type: 'square-oscillator' as const,
					parameters: {
						frequency: { base: 333, inputs: [] },
						detune: { base: 0, inputs: [] }
					},
					inputs: [],
					ui
				},
				'2': {
					type: 'gain' as const,
					inputs: [{ id: '1', output: 'audio', input: 'audio' }],
					parameters: {
						gain: { base: 0.5, inputs: [] }
					},
					ui
				},
				'3': {
					type: 'destination' as const,
					inputs: [{ id: '2', output: 'audio', input: 'audio' }],
					parameters: {},
					ui
				}
			};
			const audioNodeDatabase: AudioNodeDatabase = updateAudioCanvas(audioElements, {}, {});

			expect(audioNodeDatabase['1']).toBeDefined();
			expect(audioNodeDatabase['2']).toBeDefined();
			expect(audioNodeDatabase['3']).toBeDefined();
			expect(
				(audioNodeDatabase['1'] as CustomSquareOscillatorNode).output.connect
			).toHaveBeenCalledWith((audioNodeDatabase['2'] as CustomGainNode).webApiNode);
			expect((audioNodeDatabase['2'] as CustomGainNode).webApiNode.connect).toHaveBeenCalledWith(
				(audioNodeDatabase['3'] as DestinationNode).getInput()?.getNode()
			);
			expect((audioNodeDatabase['2'] as CustomGainNode).getParameter('gain').audioParam.value).toBe(
				0.5
			);
			expect((audioNodeDatabase['1'] as CustomSquareOscillatorNode).leftOscillator.type).toBe(
				'square'
			);
			expect(
				(audioNodeDatabase['1'] as CustomSquareOscillatorNode).getParameter('frequency').audioParam
					.value
			).toBe(333);
		});

		it('returns sequencer connected to envelope connected to oscillator', () => {
			const audioElements = {
				'1': {
					type: 'sequencer' as const,
					parameters: sequencerParameters,
					inputs: [],
					ui
				},
				'2': {
					type: 'ad-envelope' as const,
					inputs: [{ id: '1', output: 'trigger', input: 'trigger' }],
					parameters: {
						attack: { base: 0, inputs: [] },
						decay: { base: 0, inputs: [] }
					},
					ui
				},
				'3': {
					type: 'sine-oscillator' as const,
					parameters: {
						frequency: { base: 440, inputs: [{ id: '1', output: 'frequency' }] },
						detune: { base: 0, inputs: [] }
					},
					inputs: [],
					ui
				},
				'4': {
					type: 'gain' as const,
					inputs: [{ id: '3', output: 'audio', input: 'audio' }],
					parameters: {
						gain: { base: 0, inputs: [{ id: '2', output: 'envelope' }] }
					},
					ui
				},
				'5': {
					type: 'destination' as const,
					inputs: [{ id: '4', output: 'audio', input: 'audio' }],
					parameters: {},
					ui
				}
			};
			const audioNodeDatabase: AudioNodeDatabase = updateAudioCanvas(audioElements, {}, {});

			expect(audioNodeDatabase['1']).toBeDefined();
			expect(audioNodeDatabase['2']).toBeDefined();
			expect(audioNodeDatabase['3']).toBeDefined();
			expect(audioNodeDatabase['4']).toBeDefined();
			expect(audioNodeDatabase['5']).toBeDefined();
		});
	});

	describe('updateAudioCanvas - updating', () => {
		it('updates oscillator frequency', () => {
			const audioElements = {
				'1': {
					type: 'square-oscillator' as const,
					parameters: {
						frequency: { base: 333, inputs: [] },
						detune: { base: 0, inputs: [] }
					},
					inputs: [],
					ui
				}
			};
			const audioNodeDatabase: AudioNodeDatabase = updateAudioCanvas(audioElements, {}, {});

			expect(
				(audioNodeDatabase['1'] as CustomSquareOscillatorNode).getParameter('frequency').audioParam
					.value
			).toBe(333);

			const newAudioElements = changeParameter(audioElements, '1', 'frequency', 444);

			updateAudioCanvas(newAudioElements, audioElements, audioNodeDatabase);

			expect(
				(audioNodeDatabase['1'] as CustomSquareOscillatorNode).getParameter('frequency').audioParam
					.value
			).toBe(444);
		});

		it('creates new oscillator', () => {
			const audioElements = {
				'1': {
					type: 'square-oscillator' as const,
					parameters: {
						frequency: { base: 333, inputs: [] },
						detune: { base: 0, inputs: [] }
					},
					inputs: [],
					ui
				}
			};
			const audioNodeDatabase: AudioNodeDatabase = updateAudioCanvas(audioElements, {}, {});

			expect(audioNodeDatabase['1']).toBeDefined();

			const newAudioElements = addNode(audioElements, 'sine-oscillator');

			const nextAudioNodeDatabase = updateAudioCanvas(
				newAudioElements,
				audioElements,
				audioNodeDatabase
			);

			expect(nextAudioNodeDatabase['1']).toBeDefined();
			expect(nextAudioNodeDatabase['2']).toBeDefined();
			expect(
				(nextAudioNodeDatabase['2'] as CustomSineOscillatorNode).getParameter('frequency')
					.audioParam.value
			).toBe(440);
			expect((nextAudioNodeDatabase['2'] as CustomSineOscillatorNode).leftOscillator.type).toBe(
				'sine'
			);
			expect((nextAudioNodeDatabase['2'] as CustomSineOscillatorNode).rightOscillator.type).toBe(
				'sine'
			);
		});

		it('adds gain connected to oscillator', () => {
			const audioElements = {
				'1': {
					type: 'square-oscillator' as const,
					parameters: {
						frequency: { base: 333, inputs: [] },
						detune: { base: 0, inputs: [] }
					},
					inputs: [],
					ui
				}
			};
			const audioNodeDatabase: AudioNodeDatabase = updateAudioCanvas(audioElements, {}, {});

			expect(audioNodeDatabase['1']).toBeDefined();

			const newAudioElements = {
				'1': {
					...audioElements['1']
				},
				'2': {
					type: 'gain' as const,
					inputs: [{ id: '1', output: 'audio', input: 'audio' }],
					parameters: {
						gain: { base: 0.5, inputs: [] }
					},
					ui
				}
			};

			const nextAudioNodeDatabase = updateAudioCanvas(
				newAudioElements,
				audioElements,
				audioNodeDatabase
			);

			expect(nextAudioNodeDatabase['1']).toBeDefined();
			expect(nextAudioNodeDatabase['2']).toBeDefined();
			expect(
				(nextAudioNodeDatabase['1'] as CustomSquareOscillatorNode).output.connect
			).toHaveBeenCalledWith((nextAudioNodeDatabase['2'] as CustomGainNode).webApiNode);
			expect(
				(nextAudioNodeDatabase['2'] as CustomGainNode).getParameter('gain').audioParam.value
			).toBe(0.5);
			expect((nextAudioNodeDatabase['1'] as CustomSquareOscillatorNode).leftOscillator.type).toBe(
				'square'
			);
			expect(
				(nextAudioNodeDatabase['1'] as CustomSquareOscillatorNode).getParameter('frequency')
					.audioParam.value
			).toBe(333);
		});

		it('adds connection between oscillator and gain', () => {
			const audioElements = {
				'1': {
					type: 'square-oscillator' as const,
					parameters: {
						frequency: { base: 333, inputs: [] },
						detune: { base: 0, inputs: [] }
					},
					inputs: [],
					ui
				},
				'2': {
					type: 'gain' as const,
					inputs: [],
					parameters: {
						gain: { base: 0.5, inputs: [] }
					},
					ui
				}
			};
			const audioNodeDatabase: AudioNodeDatabase = updateAudioCanvas(audioElements, {}, {});

			const newAudioElements = addConnection(
				audioElements,
				{
					type: 'output',
					nodeId: '1',
					id: 'audio'
				},
				{
					type: 'input',
					nodeId: '2',
					id: 'audio'
				}
			);

			expect(newAudioElements['2']?.inputs).toEqual([{ id: '1', output: 'audio', input: 'audio' }]);

			const nextAudioNodeDatabase = updateAudioCanvas(
				newAudioElements,
				audioElements,
				audioNodeDatabase
			);

			expect(nextAudioNodeDatabase['1']).toBeDefined();
			expect(nextAudioNodeDatabase['2']).toBeDefined();
			expect(
				(nextAudioNodeDatabase['1'] as CustomSquareOscillatorNode).output.connect
			).toHaveBeenCalledWith((nextAudioNodeDatabase['2'] as CustomGainNode).webApiNode);
			expect(
				(nextAudioNodeDatabase['2'] as CustomGainNode).getParameter('gain').audioParam.value
			).toBe(0.5);
			expect((nextAudioNodeDatabase['1'] as CustomSquareOscillatorNode).leftOscillator.type).toBe(
				'square'
			);
			expect(
				(nextAudioNodeDatabase['1'] as CustomSquareOscillatorNode).getParameter('frequency')
					.audioParam.value
			).toBe(333);
		});

		it('adds connection between midi trigger output and envelope', () => {
			const audioElements = {
				'1': {
					type: 'midi' as const,
					parameters: {},
					inputs: [],
					ui
				},
				'2': {
					type: 'ad-envelope' as const,
					inputs: [],
					parameters: {
						attack: { base: 0.5, inputs: [] },
						decay: { base: 0, inputs: [] }
					},
					ui
				}
			};
			const audioNodeDatabase: AudioNodeDatabase = updateAudioCanvas(audioElements, {}, {});

			const newAudioElements = addConnection(
				audioElements,
				{
					type: 'output',
					nodeId: '1',
					id: 'trigger'
				},
				{
					type: 'input',
					nodeId: '2',
					id: 'trigger'
				}
			);

			expect(newAudioElements['2']?.inputs).toEqual([
				{ id: '1', output: 'trigger', input: 'trigger' }
			]);

			const nextAudioNodeDatabase = updateAudioCanvas(
				newAudioElements,
				audioElements,
				audioNodeDatabase
			);

			expect(nextAudioNodeDatabase['1']).toBeDefined();
			expect(nextAudioNodeDatabase['2']).toBeDefined();

			expect(nextAudioNodeDatabase['1']).toBeInstanceOf(MidiNode);

			expect(
				(nextAudioNodeDatabase['1'] as MidiNode).getOutputNode('trigger').connect
			).toHaveBeenCalledWith(nextAudioNodeDatabase['2']?.getInput()?.getNode());
		});

		it('adds connection between clock and delay trigger input', () => {
			const audioElements = {
				'1': {
					type: 'clock' as const,
					parameters: {
						tempo: { base: 120, inputs: [] }
					},
					inputs: [],
					ui
				},
				'2': {
					type: 'delay' as const,
					inputs: [],
					parameters: {
						delayTime: { base: 0.5, inputs: [] }
					},
					ui
				}
			};
			const audioNodeDatabase: AudioNodeDatabase = updateAudioCanvas(audioElements, {}, {});

			const newAudioElements = addConnection(
				audioElements,
				{
					type: 'output',
					nodeId: '1',
					id: 'trigger'
				},
				{
					type: 'input',
					nodeId: '2',
					id: 'trigger'
				}
			);

			expect(newAudioElements['2']?.inputs).toEqual([
				{ id: '1', output: 'trigger', input: 'trigger' }
			]);

			const nextAudioNodeDatabase = updateAudioCanvas(
				newAudioElements,
				audioElements,
				audioNodeDatabase
			);

			expect(nextAudioNodeDatabase['1']).toBeDefined();
			expect(nextAudioNodeDatabase['2']).toBeDefined();

			expect(nextAudioNodeDatabase['1']).toBeInstanceOf(ClockNode);
			expect(nextAudioNodeDatabase['2']).toBeInstanceOf(CustomDelayNode);

			expect(
				(nextAudioNodeDatabase['1'] as ClockNode).getOutputNode().connect
			).toHaveBeenCalledWith(
				(nextAudioNodeDatabase['2'] as CustomDelayNode).getInput('trigger')?.getNode(),
				0,
				1
			);
		});

		it('adds connections to both inputs of delay', () => {
			const audioElements = {
				'1': {
					type: 'clock' as const,
					parameters: {
						tempo: { base: 120, inputs: [] }
					},
					inputs: [],
					ui
				},
				'2': {
					type: 'sine-oscillator' as const,
					parameters: {
						frequency: { base: 0, inputs: [] },
						detune: { base: 0, inputs: [] }
					},
					inputs: [],
					ui
				},
				'3': {
					type: 'delay' as const,
					inputs: [],
					parameters: {
						delayTime: { base: 0.5, inputs: [] }
					},
					ui
				}
			};
			const audioNodeDatabase: AudioNodeDatabase = updateAudioCanvas(audioElements, {}, {});

			const intermediateAudioElements = addConnection(
				audioElements,
				{
					type: 'output',
					nodeId: '1',
					id: 'trigger'
				},
				{
					type: 'input',
					nodeId: '3',
					id: 'trigger'
				}
			);

			const newAudioElements = addConnection(
				intermediateAudioElements,
				{
					type: 'output',
					nodeId: '2',
					id: 'audio'
				},
				{
					type: 'input',
					nodeId: '3',
					id: 'audio'
				}
			);

			expect(newAudioElements['3']?.inputs).toEqual([
				{ id: '1', output: 'trigger', input: 'trigger' },
				{ id: '2', output: 'audio', input: 'audio' }
			]);

			const nextAudioNodeDatabase = updateAudioCanvas(
				newAudioElements,
				audioElements,
				audioNodeDatabase
			);

			expect(nextAudioNodeDatabase['1']).toBeDefined();
			expect(nextAudioNodeDatabase['2']).toBeDefined();
			expect(nextAudioNodeDatabase['3']).toBeDefined();

			expect(nextAudioNodeDatabase['1']).toBeInstanceOf(ClockNode);
			expect(nextAudioNodeDatabase['2']).toBeInstanceOf(CustomSineOscillatorNode);
			expect(nextAudioNodeDatabase['3']).toBeInstanceOf(CustomDelayNode);

			expect(
				(nextAudioNodeDatabase['2'] as CustomSineOscillatorNode).getOutputNode().connect
			).toHaveBeenCalledWith((nextAudioNodeDatabase['3'] as CustomDelayNode).getInput()?.getNode());
			expect(
				(nextAudioNodeDatabase['1'] as ClockNode).getOutputNode().connect
			).toHaveBeenCalledWith(
				(nextAudioNodeDatabase['3'] as CustomDelayNode).getInput('trigger')?.getNode(),
				0,
				1
			);
		});

		it('removes connection between oscillator and gain', () => {
			const audioElements = {
				'1': {
					type: 'square-oscillator' as const,
					parameters: {
						frequency: { base: 333, inputs: [] },
						detune: { base: 0, inputs: [] }
					},
					inputs: [],
					ui
				},
				'2': {
					type: 'gain' as const,
					inputs: [{ id: '1', output: 'audio', input: 'audio' }],
					parameters: {
						gain: { base: 0.5, inputs: [] }
					},
					ui
				}
			};
			const audioNodeDatabase: AudioNodeDatabase = updateAudioCanvas(audioElements, {}, {});

			const newAudioElements = removeConnection(
				audioElements,
				{
					type: 'output',
					nodeId: '1',
					id: 'audio'
				},
				{
					type: 'input',
					nodeId: '2',
					id: 'audio'
				}
			);

			expect(newAudioElements['2']?.inputs).toEqual([]);

			const nextAudioNodeDatabase = updateAudioCanvas(
				newAudioElements,
				audioElements,
				audioNodeDatabase
			);

			expect(nextAudioNodeDatabase['1']).toBeDefined();
			expect(nextAudioNodeDatabase['2']).toBeDefined();
			expect(
				(nextAudioNodeDatabase['1'] as CustomSquareOscillatorNode).output.disconnect
			).toHaveBeenCalledWith((nextAudioNodeDatabase['2'] as CustomGainNode).webApiNode);
			expect(
				(nextAudioNodeDatabase['2'] as CustomGainNode).getParameter('gain').audioParam.value
			).toBe(0.5);
			expect((nextAudioNodeDatabase['1'] as CustomSquareOscillatorNode).leftOscillator.type).toBe(
				'square'
			);
			expect(
				(nextAudioNodeDatabase['1'] as CustomSquareOscillatorNode).getParameter('frequency')
					.audioParam.value
			).toBe(333);
		});

		it('removes connection between clock and delay trigger input', () => {
			const audioElements = {
				'1': {
					type: 'clock' as const,
					parameters: {
						tempo: { base: 120, inputs: [] }
					},
					inputs: [],
					ui
				},
				'2': {
					type: 'sine-oscillator' as const,
					parameters: {
						frequency: { base: 0, inputs: [] },
						detune: { base: 0, inputs: [] }
					},
					inputs: [],
					ui
				},
				'3': {
					type: 'delay' as const,
					inputs: [
						{ id: '1', output: 'trigger', input: 'trigger' },
						{ id: '2', output: 'audio', input: 'audio' }
					],
					parameters: {
						delayTime: { base: 0.5, inputs: [] }
					},
					ui
				}
			};

			const audioNodeDatabase: AudioNodeDatabase = updateAudioCanvas(audioElements, {}, {});

			const newAudioElements = removeConnection(
				audioElements,
				{
					type: 'output',
					nodeId: '1',
					id: 'trigger'
				},
				{
					type: 'input',
					nodeId: '3',
					id: 'trigger'
				}
			);

			expect(newAudioElements['3']?.inputs).toEqual([{ id: '2', output: 'audio', input: 'audio' }]);

			const nextAudioNodeDatabase = updateAudioCanvas(
				newAudioElements,
				audioElements,
				audioNodeDatabase
			);

			expect(
				(nextAudioNodeDatabase['1'] as ClockNode).getOutputNode().disconnect
			).toHaveBeenCalledWith(nextAudioNodeDatabase['3']?.getInput('trigger')?.getNode());
		});

		it('removes input form one node when two are present', () => {
			const audioElements = {
				'1': {
					type: 'sine-oscillator' as const,
					parameters: {
						frequency: { base: 0, inputs: [] },
						detune: { base: 0, inputs: [] }
					},
					inputs: [],
					ui
				},
				'2': {
					type: 'sine-oscillator' as const,
					parameters: {
						frequency: { base: 0, inputs: [] },
						detune: { base: 0, inputs: [] }
					},
					inputs: [],
					ui
				},
				'3': {
					type: 'delay' as const,
					inputs: [
						{ id: '1', output: 'audio', input: 'audio' },
						{ id: '2', output: 'audio', input: 'audio' }
					],
					parameters: {
						delayTime: { base: 0.5, inputs: [] }
					},
					ui
				}
			};

			const audioNodeDatabase: AudioNodeDatabase = updateAudioCanvas(audioElements, {}, {});

			const newAudioElements = removeConnection(
				audioElements,
				{
					type: 'output',
					nodeId: '1',
					id: 'audio'
				},
				{
					type: 'input',
					nodeId: '3',
					id: 'audio'
				}
			);

			expect(newAudioElements['3']?.inputs).toEqual([{ id: '2', output: 'audio', input: 'audio' }]);

			const nextAudioNodeDatabase = updateAudioCanvas(
				newAudioElements,
				audioElements,
				audioNodeDatabase
			);

			expect(
				(nextAudioNodeDatabase['1'] as CustomSineOscillatorNode).getOutputNode().disconnect
			).toHaveBeenCalledWith(nextAudioNodeDatabase['3']?.getInput('audio')?.getNode());
		});

		it('removes "weird" connection between clock node and delays audio input', () => {
			const audioElements = {
				'1': {
					type: 'clock' as const,
					parameters: {
						tempo: { base: 120, inputs: [] }
					},
					inputs: [],
					ui
				},
				'2': {
					type: 'sine-oscillator' as const,
					parameters: {
						frequency: { base: 0, inputs: [] },
						detune: { base: 0, inputs: [] }
					},
					inputs: [],
					ui
				},
				'3': {
					type: 'delay' as const,
					inputs: [
						{ id: '1', output: 'trigger', input: 'audio' },
						{ id: '2', output: 'audio', input: 'audio' }
					],
					parameters: {
						delayTime: { base: 0.5, inputs: [] }
					},
					ui
				}
			};

			const audioNodeDatabase: AudioNodeDatabase = updateAudioCanvas(audioElements, {}, {});

			const newAudioElements = removeConnection(
				audioElements,
				{
					type: 'output',
					nodeId: '1',
					id: 'trigger'
				},
				{
					type: 'input',
					nodeId: '3',
					id: 'audio'
				}
			);

			expect(newAudioElements['3']?.inputs).toEqual([{ id: '2', output: 'audio', input: 'audio' }]);

			const nextAudioNodeDatabase = updateAudioCanvas(
				newAudioElements,
				audioElements,
				audioNodeDatabase
			);

			expect(
				(nextAudioNodeDatabase['1'] as ClockNode).getOutputNode().disconnect
			).toHaveBeenCalledWith(nextAudioNodeDatabase['3']?.getInput('audio')?.getNode());
		});

		it('adds two connections from clock to delay', () => {
			const audioElements = {
				'1': {
					type: 'clock' as const,
					parameters: {
						tempo: { base: 120, inputs: [] }
					},
					inputs: [],
					ui
				},
				'2': {
					type: 'delay' as const,
					inputs: [],
					parameters: {
						delayTime: { base: 0.5, inputs: [] }
					},
					ui
				}
			};

			const audioNodeDatabase: AudioNodeDatabase = updateAudioCanvas(audioElements, {}, {});

			const intermediateAudioElements = addConnection(
				audioElements,
				{
					type: 'output',
					nodeId: '1',
					id: 'trigger'
				},
				{
					type: 'input',
					nodeId: '2',
					id: 'trigger'
				}
			);

			expect(intermediateAudioElements['2']?.inputs).toEqual([
				{ id: '1', output: 'trigger', input: 'trigger' }
			]);

			const nextAudioNodeDatabase = updateAudioCanvas(
				intermediateAudioElements,
				audioElements,
				audioNodeDatabase
			);

			expect(
				(nextAudioNodeDatabase['1'] as ClockNode).getOutputNode().connect
			).toHaveBeenCalledWith(nextAudioNodeDatabase['2']?.getInput('trigger')?.getNode(), 0, 1);

			const newAudioElements = addConnection(
				intermediateAudioElements,
				{
					type: 'output',
					nodeId: '1',
					id: 'trigger'
				},
				{
					type: 'input',
					nodeId: '2',
					id: 'audio'
				}
			);

			expect(newAudioElements['2']?.inputs).toEqual([
				{ id: '1', output: 'trigger', input: 'trigger' },
				{ id: '1', output: 'trigger', input: 'audio' }
			]);

			const nextNextAudioNodeDatabase = updateAudioCanvas(
				newAudioElements,
				intermediateAudioElements,
				nextAudioNodeDatabase
			);

			expect(
				(nextNextAudioNodeDatabase['1'] as ClockNode).getOutputNode().connect
			).toHaveBeenCalledWith(nextNextAudioNodeDatabase['2']?.getInput('audio')?.getNode());
		});

		it('removes two connections from clock to delay', () => {
			const audioElements = {
				'1': {
					type: 'clock' as const,
					parameters: {
						tempo: { base: 120, inputs: [] }
					},
					inputs: [],
					ui
				},
				'2': {
					type: 'delay' as const,
					inputs: [
						{ id: '1', output: 'trigger', input: 'audio' },
						{ id: '1', output: 'trigger', input: 'trigger' }
					],
					parameters: {
						delayTime: { base: 0.5, inputs: [] }
					},
					ui
				}
			};

			const audioNodeDatabase: AudioNodeDatabase = updateAudioCanvas(audioElements, {}, {});

			const newAudioElements = removeConnection(
				audioElements,
				{
					type: 'output',
					nodeId: '1',
					id: 'trigger'
				},
				{
					type: 'input',
					nodeId: '2',
					id: 'audio'
				}
			);

			expect(newAudioElements['2']?.inputs).toEqual([
				{ id: '1', output: 'trigger', input: 'trigger' }
			]);

			const nextAudioNodeDatabase = updateAudioCanvas(
				newAudioElements,
				audioElements,
				audioNodeDatabase
			);

			expect(
				(nextAudioNodeDatabase['1'] as ClockNode).getOutputNode().disconnect
			).toHaveBeenCalledWith(nextAudioNodeDatabase['2']?.getInput('audio')?.getNode());

			const newerAudioElements = removeConnection(
				newAudioElements,
				{
					type: 'output',
					nodeId: '1',
					id: 'trigger'
				},
				{
					type: 'input',
					nodeId: '2',
					id: 'trigger'
				}
			);

			expect(newerAudioElements['2']?.inputs).toEqual([]);

			jest.clearAllMocks();

			const nextNextAudioNodeDatabase = updateAudioCanvas(
				newerAudioElements,
				newAudioElements,
				nextAudioNodeDatabase
			);

			expect(
				(nextNextAudioNodeDatabase['1'] as ClockNode).getOutputNode().disconnect
			).toHaveBeenCalledWith(nextNextAudioNodeDatabase['2']?.getInput('trigger')?.getNode());
		});

		it('adds connection between gain and oscillator detune parameter', () => {
			const audioElements = {
				'1': {
					type: 'square-oscillator' as const,
					parameters: {
						frequency: { base: 333, inputs: [] },
						detune: { base: 0, inputs: [] }
					},
					inputs: [],
					ui
				},
				'2': {
					type: 'gain' as const,
					inputs: [],
					parameters: {
						gain: { base: 0.5, inputs: [] }
					},
					ui
				}
			};
			const audioNodeDatabase: AudioNodeDatabase = updateAudioCanvas(audioElements, {}, {});

			const newAudioElements = addConnectionToParameter(
				audioElements,
				{
					type: 'output',
					nodeId: '2',
					id: 'audio'
				},
				{
					type: 'input',
					nodeId: '1',
					id: 'detune'
				}
			);

			expect(newAudioElements['1']?.parameters.detune.inputs).toEqual([
				{ id: '2', output: 'audio', multiply: 1 }
			]);

			const nextAudioNodeDatabase = updateAudioCanvas(
				newAudioElements,
				audioElements,
				audioNodeDatabase
			);

			expect(nextAudioNodeDatabase['1']).toBeDefined();
			expect(nextAudioNodeDatabase['2']).toBeDefined();
			expect(
				(nextAudioNodeDatabase['2'] as CustomGainNode).webApiNode.connect
			).toHaveBeenCalledWith(
				(nextAudioNodeDatabase['1'] as CustomSquareOscillatorNode)
					.getParameter('detune')
					.getMultiplierForInput('2')
			);
			expect(
				(nextAudioNodeDatabase['1'] as CustomSquareOscillatorNode)
					.getParameter('detune')
					.getMultiplierForInput('2').connect
			).toHaveBeenCalledWith(
				(nextAudioNodeDatabase['1'] as CustomSquareOscillatorNode).getParameter('detune').audioParam
			);
			expect(
				(nextAudioNodeDatabase['2'] as CustomGainNode).getParameter('gain').audioParam.value
			).toBe(0.5);
			expect((nextAudioNodeDatabase['1'] as CustomSquareOscillatorNode).leftOscillator.type).toBe(
				'square'
			);
		});

		it('removes connection between gain and oscillator detune parameter', () => {
			const audioElements = {
				'1': {
					type: 'square-oscillator' as const,
					parameters: {
						frequency: { base: 333, inputs: [] },
						detune: { base: 0, inputs: [{ id: '2', output: 'audio' }] }
					},
					inputs: [],
					ui
				},
				'2': {
					type: 'gain' as const,
					inputs: [],
					parameters: {
						gain: { base: 0.5, inputs: [] }
					},
					ui
				}
			};
			const audioNodeDatabase: AudioNodeDatabase = updateAudioCanvas(audioElements, {}, {});

			const newAudioElements = removeConnection(
				audioElements,
				{
					type: 'output',
					nodeId: '2',
					id: 'audio'
				},
				{
					type: 'input',
					nodeId: '1',
					id: 'detune'
				}
			);

			expect(newAudioElements['1']?.parameters.detune.inputs.length).toEqual(0);

			const nextAudioNodeDatabase = updateAudioCanvas(
				newAudioElements,
				audioElements,
				audioNodeDatabase
			);

			expect(nextAudioNodeDatabase['1']).toBeDefined();
			expect(nextAudioNodeDatabase['2']).toBeDefined();
			expect(
				(nextAudioNodeDatabase['2'] as CustomGainNode).webApiNode.disconnect
			).toHaveBeenCalledWith(
				(nextAudioNodeDatabase['1'] as CustomSquareOscillatorNode)
					.getParameter('detune')
					.getMultiplierForInput('2')
			);
			expect(
				(nextAudioNodeDatabase['2'] as CustomGainNode).getParameter('gain').audioParam.value
			).toBe(0.5);
			expect((nextAudioNodeDatabase['1'] as CustomSquareOscillatorNode).leftOscillator.type).toBe(
				'square'
			);
		});

		it('removes oscillator conenected to gain', () => {
			const audioElements = {
				'1': {
					type: 'square-oscillator' as const,
					parameters: {
						frequency: { base: 333, inputs: [] },
						detune: { base: 0, inputs: [] }
					},
					inputs: [],
					ui
				},
				'2': {
					type: 'gain' as const,
					inputs: [{ id: '1', output: 'audio', input: 'audio' }],
					parameters: {
						gain: { base: 0.5, inputs: [] }
					},
					ui
				}
			};
			const audioNodeDatabase: AudioNodeDatabase = updateAudioCanvas(audioElements, {}, {});

			const oscillatorNode = audioNodeDatabase['1'] as CustomSineOscillatorNode;

			const newAudioElements = removeNode(audioElements, '1');

			expect(newAudioElements['1']).toBeUndefined();
			expect(newAudioElements['2']?.inputs).toEqual([]);

			const nextAudioNodeDatabase = updateAudioCanvas(
				newAudioElements,
				audioElements,
				audioNodeDatabase
			);

			expect(nextAudioNodeDatabase['1']).toBeUndefined();
			expect(nextAudioNodeDatabase['2']).toBeDefined();
			expect(oscillatorNode.leftOscillator.stop).toHaveBeenCalled();
			expect(oscillatorNode.rightOscillator.stop).toHaveBeenCalled();
			expect(oscillatorNode.output.disconnect).toHaveBeenCalled();
		});

		it('adds connection between sequencer frequency and oscillator detune parameter', () => {
			const audioElements = {
				'1': {
					type: 'square-oscillator' as const,
					parameters: {
						frequency: { base: 333, inputs: [] },
						detune: { base: 0, inputs: [] }
					},
					inputs: [],
					ui
				},
				'2': {
					type: 'sequencer' as const,
					parameters: sequencerParameters,
					inputs: [],
					ui
				}
			};
			const audioNodeDatabase: AudioNodeDatabase = updateAudioCanvas(audioElements, {}, {});

			const newAudioElements = addConnectionToParameter(
				audioElements,
				{
					type: 'output',
					nodeId: '2',
					id: 'frequency'
				},
				{
					type: 'input',
					nodeId: '1',
					id: 'detune'
				}
			);

			expect(newAudioElements['1']?.parameters.detune.inputs).toEqual([
				{ id: '2', output: 'frequency', multiply: 1 }
			]);

			const nextAudioNodeDatabase = updateAudioCanvas(
				newAudioElements,
				audioElements,
				audioNodeDatabase
			);

			expect(nextAudioNodeDatabase['1']).toBeDefined();
			expect(nextAudioNodeDatabase['2']).toBeDefined();

			expect((nextAudioNodeDatabase['2'] as SequencerNode).webApiNode.connect).toHaveBeenCalledWith(
				(nextAudioNodeDatabase['1'] as CustomSquareOscillatorNode)
					.getParameter('detune')
					.getMultiplierForInput('2')
			);
			expect(
				(nextAudioNodeDatabase['1'] as CustomSquareOscillatorNode)
					.getParameter('detune')
					.getMultiplierForInput('2').connect
			).toHaveBeenCalledWith(
				(nextAudioNodeDatabase['1'] as CustomSquareOscillatorNode).getParameter('detune').audioParam
			);
		});

		it('removes sequencer connected to oscillator', () => {
			const audioElements = {
				'1': {
					type: 'sequencer' as const,
					parameters: sequencerParameters,
					inputs: [],
					ui
				},
				'2': {
					type: 'sine-oscillator' as const,
					parameters: {
						frequency: { base: 440, inputs: [{ id: '1', output: 'frequency' }] },
						detune: { base: 0, inputs: [] }
					},
					inputs: [],
					ui
				}
			};

			const audioNodeDatabase: AudioNodeDatabase = updateAudioCanvas(audioElements, {}, {});

			const newAudioElements = removeNode(audioElements, '1');

			updateAudioCanvas(newAudioElements, audioElements, audioNodeDatabase);

			expect(newAudioElements['1']).toBeUndefined();
			expect(newAudioElements['2']?.parameters.frequency.inputs.length).toEqual(0);
		});

		it('does not make any updates if nothing changed', () => {
			const audioElements = {
				'1': {
					type: 'square-oscillator' as const,
					parameters: {
						frequency: { base: 333, inputs: [] },
						detune: { base: 0, inputs: [] }
					},
					inputs: [],
					ui
				},
				'2': {
					type: 'gain' as const,
					inputs: [{ id: '1', output: 'audio', input: 'audio' }],
					parameters: {
						gain: { base: 0.5, inputs: [] }
					},
					ui
				}
			};

			const audioNodeDatabase: AudioNodeDatabase = updateAudioCanvas(audioElements, {}, {});

			expect(
				(audioNodeDatabase['1'] as CustomSquareOscillatorNode).output.connect
			).toHaveBeenCalledTimes(1);
			expect((audioNodeDatabase['2'] as CustomGainNode).webApiNode.connect).not.toHaveBeenCalled();
			expect(
				(audioNodeDatabase['1'] as CustomSquareOscillatorNode).output.disconnect
			).not.toHaveBeenCalled();
			expect(
				(audioNodeDatabase['2'] as CustomGainNode).webApiNode.disconnect
			).not.toHaveBeenCalled();

			const newAudioElements = { ...audioElements };

			const newAudioNodeDatabase = updateAudioCanvas(
				newAudioElements,
				audioElements,
				audioNodeDatabase
			);

			expect(
				(newAudioNodeDatabase['1'] as CustomSquareOscillatorNode).output.connect
			).toHaveBeenCalledTimes(1);
			expect(
				(newAudioNodeDatabase['2'] as CustomGainNode).webApiNode.connect
			).not.toHaveBeenCalled();
			expect(
				(newAudioNodeDatabase['1'] as CustomSquareOscillatorNode).output.disconnect
			).not.toHaveBeenCalled();
			expect(
				(newAudioNodeDatabase['2'] as CustomGainNode).webApiNode.disconnect
			).not.toHaveBeenCalled();
		});

		it('removes only one line from inputs', () => {
			const audioElements = {
				'1': {
					type: 'square-oscillator' as const,
					parameters: {
						frequency: { base: 333, inputs: [] },
						detune: { base: 0, inputs: [] }
					},
					inputs: [],
					ui
				},
				'2': {
					type: 'gain' as const,
					inputs: [{ id: '1', output: 'audio', input: 'audio' }],
					parameters: {
						gain: { base: 0.5, inputs: [{ id: '1', output: 'audio' }] }
					},
					ui
				}
			};

			updateAudioCanvas(audioElements, {}, {});

			const newAudioElements = removeConnection(
				audioElements,
				{
					type: 'output',
					nodeId: '1',
					id: 'audio'
				},
				{
					type: 'input',
					nodeId: '2',
					id: 'audio'
				}
			);

			expect(newAudioElements['2'].inputs.length).toBe(0);
			expect(newAudioElements['2'].parameters.gain.inputs.length).toBe(1);
		});

		it('removes only one line from parameters', () => {
			const audioElements = {
				'1': {
					type: 'square-oscillator' as const,
					parameters: {
						frequency: { base: 333, inputs: [] },
						detune: { base: 0, inputs: [] }
					},
					inputs: [],
					ui
				},
				'2': {
					type: 'gain' as const,
					inputs: [{ id: '1', output: 'audio', input: 'audio' }],
					parameters: {
						gain: { base: 0.5, inputs: [{ id: '1', output: 'audio' }] }
					},
					ui
				}
			};

			updateAudioCanvas(audioElements, {}, {});

			const newAudioElements = removeConnection(
				audioElements,
				{
					type: 'output',
					nodeId: '1',
					id: 'audio'
				},
				{
					type: 'input',
					nodeId: '2',
					id: 'gain'
				}
			);

			expect(newAudioElements['2'].inputs.length).toBe(1);
			expect(newAudioElements['2'].parameters.gain.inputs.length).toBe(0);
		});

		it('adds existing nodes while rewritting ids (copy/paste functionality)', () => {
			const audioElements = {
				'1': {
					type: 'square-oscillator' as const,
					parameters: {
						frequency: { base: 333, inputs: [] },
						detune: { base: 0, inputs: [] }
					},
					inputs: [],
					ui
				},
				'2': {
					type: 'gain' as const,
					inputs: [{ id: '1', output: 'audio', input: 'audio' }],
					parameters: {
						gain: { base: 0.5, inputs: [{ id: '1', output: 'audio' }] }
					},
					ui
				}
			};

			const newAudioElements = insertExistingNodes(audioElements, ['1', '2'], { x: 0, y: 0 });

			expect(newAudioElements['3']).toBeDefined();
			expect(newAudioElements['3']?.type).toBe('square-oscillator');

			expect(newAudioElements['4']).toBeDefined();
			expect(newAudioElements['4']?.type).toBe('gain');
			expect(newAudioElements['4']?.inputs?.[0]).toEqual({
				id: '3',
				input: 'audio',
				output: 'audio'
			});
			expect(newAudioElements['4']?.parameters?.['gain']?.inputs[0]?.id).toBe('3');
		});

		it('adds copied node to inputs and parameters of other nodes', () => {
			const audioElements = {
				'1': {
					type: 'square-oscillator' as const,
					parameters: {
						frequency: { base: 333, inputs: [] },
						detune: { base: 0, inputs: [] }
					},
					inputs: [],
					ui
				},
				'2': {
					type: 'gain' as const,
					inputs: [{ id: '1', output: 'audio', input: 'audio' }],
					parameters: {
						gain: { base: 0.5, inputs: [{ id: '1', output: 'audio' }] }
					},
					ui
				}
			};

			const newAudioElements = insertExistingNodes(audioElements, ['1'], { x: 0, y: 0 });

			expect(newAudioElements['3']).toBeDefined();
			expect(newAudioElements['3']?.type).toBe('square-oscillator');

			expect(newAudioElements['2']?.inputs?.length).toBe(2);
			expect(newAudioElements['2']?.inputs).toEqual([
				{ id: '1', output: 'audio', input: 'audio' },
				{ id: '3', output: 'audio', input: 'audio' }
			]);
			expect(newAudioElements['2']?.parameters?.['gain']?.inputs.length).toBe(2);
			expect(newAudioElements['2']?.parameters?.['gain']?.inputs['1']).toEqual({
				id: '3',
				output: 'audio'
			});
		});

		it('does not remove existing lines when copy pasting a node', () => {
			const audioElements = {
				'1': {
					type: 'square-oscillator' as const,
					parameters: {
						frequency: { base: 333, inputs: [] },
						detune: { base: 0, inputs: [] }
					},
					inputs: [],
					ui
				},
				'2': {
					type: 'gain' as const,
					inputs: [{ id: '1', output: 'audio', input: 'audio' }],
					parameters: {
						gain: { base: 0.5, inputs: [{ id: '1', output: 'audio' }] }
					},
					ui
				},
				'3': {
					type: 'multiply' as const,
					inputs: [],
					parameters: {
						factor: {
							base: 0,
							inputs: []
						}
					},
					ui
				}
			};

			const newAudioElements = insertExistingNodes(audioElements, ['3'], { x: 0, y: 0 });

			expect(newAudioElements['2']?.inputs?.length).toBe(1);
			expect(newAudioElements['2']?.parameters?.['gain']?.inputs.length).toBe(1);
		});

		it('multiplies sine signal passed to gain parameter', () => {
			const audioElements = {
				'1': {
					type: 'sine-oscillator' as const,
					parameters: {
						frequency: { base: 333, inputs: [] },
						detune: { base: 0, inputs: [] }
					},
					inputs: [],
					ui
				},
				'2': {
					type: 'gain' as const,
					inputs: [{ id: '1', output: 'audio', input: 'audio' }],
					parameters: {
						gain: { base: 0.5, inputs: [{ id: '1', output: 'audio', multiply: 0.2 }] }
					},
					ui
				}
			};

			const audioNodeDatabase: AudioNodeDatabase = updateAudioCanvas(audioElements, {}, {});

			expect(
				(audioNodeDatabase['1'] as CustomSineOscillatorNode).output.connect
			).toHaveBeenCalledWith(
				(audioNodeDatabase['2'] as CustomGainNode).getParameter('gain').getMultiplierForInput('1')
			);
			expect(
				(audioNodeDatabase['2'] as CustomGainNode).getParameter('gain').getMultiplierForInput('1')
					.connect
			).toHaveBeenCalledWith(
				(audioNodeDatabase['2'] as CustomGainNode).getParameter('gain').audioParam
			);

			expect(
				(audioNodeDatabase['2'] as CustomGainNode).getParameter('gain').getMultiplierForInput('1')
					.gain.value
			).toBe(0.2);
		});

		it('changes multiply value', () => {
			const audioElements = {
				'1': {
					type: 'sine-oscillator' as const,
					parameters: {
						frequency: { base: 333, inputs: [] },
						detune: { base: 0, inputs: [] }
					},
					inputs: [],
					ui
				},
				'2': {
					type: 'gain' as const,
					inputs: [{ id: '1', output: 'audio', input: 'audio' }],
					parameters: {
						gain: { base: 0.5, inputs: [{ id: '1', output: 'audio', multiply: 0.2 }] }
					},
					ui
				}
			};

			const audioNodeDatabase: AudioNodeDatabase = updateAudioCanvas(audioElements, {}, {});

			const newAudioElements = changeParameterMultiply(audioElements, '2', 'gain', '1', 0.5);

			expect(newAudioElements['2'].parameters['gain'].inputs[0]?.multiply).toBe(0.5);

			const newAudioNodeDatabase = updateAudioCanvas(
				newAudioElements,
				audioElements,
				audioNodeDatabase
			);

			expect(
				(newAudioNodeDatabase['2'] as CustomGainNode)
					.getParameter('gain')
					.getMultiplierForInput('1').gain.value
			).toBe(0.5);
		});
	});
});
