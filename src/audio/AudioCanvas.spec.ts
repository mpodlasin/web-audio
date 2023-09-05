/**
 * @jest-environment jsdom
 */
import './mocks';
import {
	type AudioNodeDatabase,
	CustomOscillatorNode,
	CustomGainNode,
	DestinationNode,
	updateAudioCanvas,
	addConnection,
	addNode,
	changeParameter,
	removeConnection,
	removeNode,
	addConnectionToParameter,
	SequencerNode
} from './AudioCanvas';
import { OscillatorNodeMock } from './mocks';

describe('AudioCanvas', () => {
	describe('updateAudioCanvas - creating', () => {
		it('returns single oscillator', () => {
			const audioElements = {
				'1': {
					type: 'oscillator' as const,
					parameters: {
						frequency: 333,
						detune: 0
					},
					oscillatorType: 'square' as const
				}
			};
			const audioNodeDatabase: AudioNodeDatabase = {};

			updateAudioCanvas(audioElements, {}, audioNodeDatabase);

			expect(audioNodeDatabase['1']).toBeDefined();
			expect((audioNodeDatabase['1'] as CustomOscillatorNode).webApiNode).toBeInstanceOf(
				OscillatorNodeMock
			);
			expect(
				((audioNodeDatabase['1'] as CustomOscillatorNode).webApiNode as OscillatorNode).frequency
					.value
			).toBe(333);
			expect(
				((audioNodeDatabase['1'] as CustomOscillatorNode).webApiNode as OscillatorNode).type
			).toBe('square');
		});

		it('returns oscillator connected to gain', () => {
			const audioElements = {
				'1': {
					type: 'oscillator' as const,
					parameters: {
						frequency: 333,
						detune: 0
					},
					oscillatorType: 'square' as const
				},
				'2': {
					type: 'gain' as const,
					inputs: ['1'],
					parameters: {
						gain: 0.5
					}
				}
			};
			const audioNodeDatabase: AudioNodeDatabase = {};

			updateAudioCanvas(audioElements, {}, audioNodeDatabase);

			expect(audioNodeDatabase['1']).toBeDefined();
			expect(audioNodeDatabase['2']).toBeDefined();

			expect((audioNodeDatabase['1'] as CustomOscillatorNode).webApiNode.type).toBe('square');
			expect((audioNodeDatabase['1'] as CustomOscillatorNode).webApiNode.frequency.value).toBe(333);

			expect((audioNodeDatabase['2'] as CustomGainNode).webApiNode.gain.value).toBe(0.5);

			expect(
				(audioNodeDatabase['1'] as CustomOscillatorNode).webApiNode.connect
			).toHaveBeenCalledWith((audioNodeDatabase['2'] as CustomGainNode).webApiNode);
		});

		it('returns oscillator connected to oscillator frequency', () => {
			const audioElements = {
				'1': {
					type: 'oscillator' as const,
					parameters: {
						frequency: ['2'],
						detune: 0
					},
					oscillatorType: 'square' as const
				},
				'2': {
					type: 'oscillator' as const,
					parameters: {
						frequency: 30,
						detune: 0
					},
					oscillatorType: 'sine' as const
				}
			};
			const audioNodeDatabase: AudioNodeDatabase = {};

			updateAudioCanvas(audioElements, {}, audioNodeDatabase);

			expect(audioNodeDatabase['1']).toBeDefined();
			expect(audioNodeDatabase['2']).toBeDefined();
			expect(
				(audioNodeDatabase['2'] as CustomOscillatorNode).webApiNode.connect
			).toHaveBeenCalledWith((audioNodeDatabase['1'] as CustomOscillatorNode).webApiNode.frequency);
			expect((audioNodeDatabase['1'] as CustomOscillatorNode).webApiNode.type).toBe('square');

			expect((audioNodeDatabase['2'] as CustomOscillatorNode).webApiNode.frequency.value).toBe(30);
			expect((audioNodeDatabase['2'] as CustomOscillatorNode).webApiNode.type).toBe('sine');
		});

		it('returns oscillator connected to gain connected to destination', () => {
			const audioElements = {
				'1': {
					type: 'oscillator' as const,
					parameters: {
						frequency: 333,
						detune: 0
					},
					oscillatorType: 'square' as const
				},
				'2': {
					type: 'gain' as const,
					inputs: ['1'],
					parameters: {
						gain: 0.5
					}
				},
				'3': {
					type: 'destination' as const,
					inputs: ['2']
				}
			};
			const audioNodeDatabase: AudioNodeDatabase = {};

			updateAudioCanvas(audioElements, {}, audioNodeDatabase);

			expect(audioNodeDatabase['1']).toBeDefined();
			expect(audioNodeDatabase['2']).toBeDefined();
			expect(audioNodeDatabase['3']).toBeDefined();
			expect(
				(audioNodeDatabase['1'] as CustomOscillatorNode).webApiNode.connect
			).toHaveBeenCalledWith((audioNodeDatabase['2'] as CustomGainNode).webApiNode);
			expect((audioNodeDatabase['2'] as CustomGainNode).webApiNode.connect).toHaveBeenCalledWith(
				(audioNodeDatabase['3'] as DestinationNode).webApiNode
			);
			expect((audioNodeDatabase['2'] as CustomGainNode).webApiNode.gain.value).toBe(0.5);
			expect((audioNodeDatabase['1'] as CustomOscillatorNode).webApiNode.type).toBe('square');
			expect((audioNodeDatabase['1'] as CustomOscillatorNode).webApiNode.frequency.value).toBe(333);
		});

		it('returns sequencer connected to envelope connected to oscillator', () => {
			const audioElements = {
				'1': {
					type: 'sequencer' as const,
					parameters: {},
					tempoInBpm: 80,
					notes: [
						{ time: 0, duration: 1, note: 'A3' },
						{ time: 1, duration: 1, note: 'C3' },
						{ time: 2, duration: 1, note: 'E3' },
						{ time: 3, duration: 1, note: 'F3' }
					],
					loopLength: 4
				},
				'2': {
					type: 'envelope' as const,
					inputs: [{ id: '1', output: 'trigger' }],
					parameters: {},
					attack: 0.1,
					decay: 0.1,
					sustain: 0.5,
					release: 0.1
				},
				'3': {
					type: 'oscillator' as const,
					parameters: {
						frequency: [{ id: '1', output: 'frequency' }],
						detune: 0
					},
					oscillatorType: 'sine' as const
				},
				'4': {
					type: 'gain' as const,
					inputs: ['3'],
					parameters: {
						gain: ['2']
					}
				},
				'5': {
					type: 'destination' as const,
					inputs: ['4']
				}
			};
			const audioNodeDatabase: AudioNodeDatabase = {};

			updateAudioCanvas(audioElements, {}, audioNodeDatabase);

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
					type: 'oscillator' as const,
					parameters: {
						frequency: 333,
						detune: 0
					},
					oscillatorType: 'square' as const
				}
			};
			const audioNodeDatabase: AudioNodeDatabase = {};

			updateAudioCanvas(audioElements, {}, audioNodeDatabase);

			expect(
				((audioNodeDatabase['1'] as CustomOscillatorNode).webApiNode as OscillatorNode).frequency
					.value
			).toBe(333);

			const newAudioElements = changeParameter(audioElements, '1', 'frequency', 444);

			updateAudioCanvas(newAudioElements, audioElements, audioNodeDatabase);

			expect(
				((audioNodeDatabase['1'] as CustomOscillatorNode).webApiNode as OscillatorNode).frequency
					.value
			).toBe(444);
		});

		it('creates new oscillator', () => {
			const audioElements = {
				'1': {
					type: 'oscillator' as const,
					parameters: {
						frequency: 333,
						detune: 0
					},
					oscillatorType: 'square' as const
				}
			};
			const audioNodeDatabase: AudioNodeDatabase = {};

			updateAudioCanvas(audioElements, {}, audioNodeDatabase);

			expect(audioNodeDatabase['1']).toBeDefined();

			const newAudioElements = addNode(audioElements, 'oscillator');

			updateAudioCanvas(newAudioElements, audioElements, audioNodeDatabase);

			expect(audioNodeDatabase['1']).toBeDefined();
			expect(audioNodeDatabase['2']).toBeDefined();
			expect(
				((audioNodeDatabase['2'] as CustomOscillatorNode).webApiNode as OscillatorNode).frequency
					.value
			).toBe(440);
			expect((audioNodeDatabase['2'] as CustomOscillatorNode).webApiNode.type).toBe('sine');
		});

		it('adds gain connected to oscillator', () => {
			const audioElements = {
				'1': {
					type: 'oscillator' as const,
					parameters: {
						frequency: 333,
						detune: 0
					},
					oscillatorType: 'square' as const
				}
			};
			const audioNodeDatabase: AudioNodeDatabase = {};

			updateAudioCanvas(audioElements, {}, audioNodeDatabase);

			expect(audioNodeDatabase['1']).toBeDefined();

			const newAudioElements = {
				'1': {
					...audioElements['1']
				},
				'2': {
					type: 'gain' as const,
					inputs: ['1'],
					parameters: {
						gain: 0.5
					}
				}
			};

			updateAudioCanvas(newAudioElements, audioElements, audioNodeDatabase);

			expect(audioNodeDatabase['1']).toBeDefined();
			expect(audioNodeDatabase['2']).toBeDefined();
			expect(
				(audioNodeDatabase['1'] as CustomOscillatorNode).webApiNode.connect
			).toHaveBeenCalledWith((audioNodeDatabase['2'] as CustomGainNode).webApiNode);
			expect((audioNodeDatabase['2'] as CustomGainNode).webApiNode.gain.value).toBe(0.5);
			expect((audioNodeDatabase['1'] as CustomOscillatorNode).webApiNode.type).toBe('square');
			expect((audioNodeDatabase['1'] as CustomOscillatorNode).webApiNode.frequency.value).toBe(333);
		});

		it('adds connection between oscillator and gain', () => {
			const audioElements = {
				'1': {
					type: 'oscillator' as const,
					parameters: {
						frequency: 333,
						detune: 0
					},
					oscillatorType: 'square' as const
				},
				'2': {
					type: 'gain' as const,
					inputs: [],
					parameters: {
						gain: 0.5
					}
				}
			};
			const audioNodeDatabase: AudioNodeDatabase = {};

			updateAudioCanvas(audioElements, {}, audioNodeDatabase);

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

			expect(newAudioElements['2']?.inputs).toEqual(['1']);

			updateAudioCanvas(newAudioElements, audioElements, audioNodeDatabase);

			expect(audioNodeDatabase['1']).toBeDefined();
			expect(audioNodeDatabase['2']).toBeDefined();
			expect(
				(audioNodeDatabase['1'] as CustomOscillatorNode).webApiNode.connect
			).toHaveBeenCalledWith((audioNodeDatabase['2'] as CustomGainNode).webApiNode);
			expect((audioNodeDatabase['2'] as CustomGainNode).webApiNode.gain.value).toBe(0.5);
			expect((audioNodeDatabase['1'] as CustomOscillatorNode).webApiNode.type).toBe('square');
			expect((audioNodeDatabase['1'] as CustomOscillatorNode).webApiNode.frequency.value).toBe(333);
		});

		it('removes connection between oscillator and gain', () => {
			const audioElements = {
				'1': {
					type: 'oscillator' as const,
					parameters: {
						frequency: 333,
						detune: 0
					},
					oscillatorType: 'square' as const
				},
				'2': {
					type: 'gain' as const,
					inputs: ['1'],
					parameters: {
						gain: 0.5
					}
				}
			};
			const audioNodeDatabase: AudioNodeDatabase = {};

			updateAudioCanvas(audioElements, {}, audioNodeDatabase);

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

			updateAudioCanvas(newAudioElements, audioElements, audioNodeDatabase);

			expect(audioNodeDatabase['1']).toBeDefined();
			expect(audioNodeDatabase['2']).toBeDefined();
			expect(
				(audioNodeDatabase['1'] as CustomOscillatorNode).webApiNode.disconnect
			).toHaveBeenCalledWith((audioNodeDatabase['2'] as CustomGainNode).webApiNode);
			expect((audioNodeDatabase['2'] as CustomGainNode).webApiNode.gain.value).toBe(0.5);
			expect((audioNodeDatabase['1'] as CustomOscillatorNode).webApiNode.type).toBe('square');
			expect((audioNodeDatabase['1'] as CustomOscillatorNode).webApiNode.frequency.value).toBe(333);
		});

		it('adds connection between gain and oscillator detune parameter', () => {
			const audioElements = {
				'1': {
					type: 'oscillator' as const,
					parameters: {
						frequency: 333,
						detune: 0
					},
					oscillatorType: 'square' as const
				},
				'2': {
					type: 'gain' as const,
					inputs: [],
					parameters: {
						gain: 0.5
					}
				}
			};
			const audioNodeDatabase: AudioNodeDatabase = {};

			updateAudioCanvas(audioElements, {}, audioNodeDatabase);

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

			expect(newAudioElements['1']?.parameters.detune).toEqual(['2']);

			updateAudioCanvas(newAudioElements, audioElements, audioNodeDatabase);

			expect(audioNodeDatabase['1']).toBeDefined();
			expect(audioNodeDatabase['2']).toBeDefined();
			expect((audioNodeDatabase['2'] as CustomGainNode).webApiNode.connect).toHaveBeenCalledWith(
				(audioNodeDatabase['1'] as CustomOscillatorNode).webApiNode.detune
			);
			expect((audioNodeDatabase['2'] as CustomGainNode).webApiNode.gain.value).toBe(0.5);
			expect((audioNodeDatabase['1'] as CustomOscillatorNode).webApiNode.type).toBe('square');
		});

		it('removes connection between gain and oscillator detune parameter', () => {
			const audioElements = {
				'1': {
					type: 'oscillator' as const,
					parameters: {
						detune: ['2'],
						frequency: 440
					},
					oscillatorType: 'square' as const
				},
				'2': {
					type: 'gain' as const,
					inputs: [],
					parameters: {
						gain: 0.5
					}
				}
			};
			const audioNodeDatabase: AudioNodeDatabase = {};

			updateAudioCanvas(audioElements, {}, audioNodeDatabase);

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

			expect(newAudioElements['1']?.parameters.detune).toEqual(0);

			updateAudioCanvas(newAudioElements, audioElements, audioNodeDatabase);

			expect(audioNodeDatabase['1']).toBeDefined();
			expect(audioNodeDatabase['2']).toBeDefined();
			expect((audioNodeDatabase['2'] as CustomGainNode).webApiNode.disconnect).toHaveBeenCalledWith(
				(audioNodeDatabase['1'] as CustomOscillatorNode).webApiNode.detune
			);
			expect((audioNodeDatabase['2'] as CustomGainNode).webApiNode.gain.value).toBe(0.5);
			expect((audioNodeDatabase['1'] as CustomOscillatorNode).webApiNode.type).toBe('square');
		});

		it('removes oscillator conenected to gain', () => {
			const audioElements = {
				'1': {
					type: 'oscillator' as const,
					parameters: {
						frequency: 333,
						detune: 0
					},
					oscillatorType: 'square' as const
				},
				'2': {
					type: 'gain' as const,
					inputs: ['1'],
					parameters: {
						gain: 0.5
					}
				}
			};
			const audioNodeDatabase: AudioNodeDatabase = {};

			updateAudioCanvas(audioElements, {}, audioNodeDatabase);

			const oscillatorNode = audioNodeDatabase['1'] as CustomOscillatorNode;

			const newAudioElements = removeNode(audioElements, '1');

			expect(newAudioElements['1']).toBeUndefined();
			expect(newAudioElements['2']?.inputs).toEqual([]);

			updateAudioCanvas(newAudioElements, audioElements, audioNodeDatabase);

			expect(audioNodeDatabase['1']).toBeUndefined();
			expect(audioNodeDatabase['2']).toBeDefined();
			expect(oscillatorNode.webApiNode.stop).toHaveBeenCalled();
			expect(oscillatorNode.webApiNode.disconnect).toHaveBeenCalled();
		});

		it('adds connection between sequencer frequency and oscillator detune parameter', () => {
			const audioElements = {
				'1': {
					type: 'oscillator' as const,
					parameters: {
						frequency: 333,
						detune: 0
					},
					oscillatorType: 'square' as const
				},
				'2': {
					type: 'sequencer' as const,
					parameters: {},
					tempoInBpm: 80,
					notes: [],
					loopLength: 4
				}
			};
			const audioNodeDatabase: AudioNodeDatabase = {};

			updateAudioCanvas(audioElements, {}, audioNodeDatabase);

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

			expect(newAudioElements['1']?.parameters.detune).toEqual(['2']);

			updateAudioCanvas(newAudioElements, audioElements, audioNodeDatabase);

			expect(audioNodeDatabase['1']).toBeDefined();
			expect(audioNodeDatabase['2']).toBeDefined();

			expect((audioNodeDatabase['2'] as SequencerNode).getFrequencyDestinations()).toHaveLength(1);
			expect((audioNodeDatabase['2'] as SequencerNode).getTriggerDestinations()).toHaveLength(0);
		});

		it('removes sequencer connected to oscillator', () => {
			const audioElements = {
				'1': {
					type: 'sequencer' as const,
					parameters: {},
					tempoInBpm: 80,
					notes: [],
					loopLength: 4
				},
				'2': {
					type: 'oscillator' as const,
					parameters: {
						frequency: [{ id: '1', output: 'frequency' }],
						detune: 0
					},
					oscillatorType: 'sine' as const
				}
			};

			const audioNodeDatabase: AudioNodeDatabase = {};

			updateAudioCanvas(audioElements, {}, audioNodeDatabase);

			const newAudioElements = removeNode(audioElements, '1');

			updateAudioCanvas(newAudioElements, audioElements, audioNodeDatabase);

			expect(newAudioElements['1']).toBeUndefined();
			expect(newAudioElements['2']?.parameters.frequency).toEqual(440);
		});
	});
});
