/**
 * @jest-environment jsdom
 */
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
	insertExistingNodes
} from './AudioCanvas';
import { OscillatorNodeMock } from './mocks';

describe('AudioCanvas', () => {
	describe('updateAudioCanvas - creating', () => {
		it('returns single oscillator', () => {
			const audioElements = {
				'1': {
					type: 'square-oscillator' as const,
					parameters: {
						frequency: { base: 333, inputs: [] },
						detune: { base: 0, inputs: [] }
					}
				}
			};
			const audioNodeDatabase: AudioNodeDatabase = {};

			updateAudioCanvas(audioElements, {}, audioNodeDatabase);

			expect(audioNodeDatabase['1']).toBeDefined();
			expect((audioNodeDatabase['1'] as CustomSquareOscillatorNode).webApiNode).toBeInstanceOf(
				OscillatorNodeMock
			);
			expect(
				((audioNodeDatabase['1'] as CustomSquareOscillatorNode).webApiNode as OscillatorNode)
					.frequency.value
			).toBe(333);
			expect(
				((audioNodeDatabase['1'] as CustomSquareOscillatorNode).webApiNode as OscillatorNode).type
			).toBe('square');
		});

		it('returns oscillator connected to gain', () => {
			const audioElements = {
				'1': {
					type: 'square-oscillator' as const,
					parameters: {
						frequency: { base: 333, inputs: [] },
						detune: { base: 0, inputs: [] }
					}
				},
				'2': {
					type: 'gain' as const,
					inputs: ['1'],
					parameters: {
						gain: { base: 0.5, inputs: [] }
					}
				}
			};
			const audioNodeDatabase: AudioNodeDatabase = {};

			updateAudioCanvas(audioElements, {}, audioNodeDatabase);

			expect(audioNodeDatabase['1']).toBeDefined();
			expect(audioNodeDatabase['2']).toBeDefined();

			expect((audioNodeDatabase['1'] as CustomSquareOscillatorNode).webApiNode.type).toBe('square');
			expect(
				(audioNodeDatabase['1'] as CustomSquareOscillatorNode).webApiNode.frequency.value
			).toBe(333);

			expect((audioNodeDatabase['2'] as CustomGainNode).webApiNode.gain.value).toBe(0.5);

			expect(
				(audioNodeDatabase['1'] as CustomSquareOscillatorNode).webApiNode.connect
			).toHaveBeenCalledWith((audioNodeDatabase['2'] as CustomGainNode).webApiNode);
		});

		it('returns oscillator connected to oscillator frequency', () => {
			const audioElements = {
				'1': {
					type: 'square-oscillator' as const,
					parameters: {
						frequency: { base: 440, inputs: [{ id: '2', output: 'audio' }] },
						detune: { base: 0, inputs: [] }
					}
				},
				'2': {
					type: 'sine-oscillator' as const,
					parameters: {
						frequency: { base: 30, inputs: [] },
						detune: { base: 0, inputs: [] }
					}
				}
			};
			const audioNodeDatabase: AudioNodeDatabase = {};

			updateAudioCanvas(audioElements, {}, audioNodeDatabase);

			expect(audioNodeDatabase['1']).toBeDefined();
			expect(audioNodeDatabase['2']).toBeDefined();
			expect(
				(audioNodeDatabase['2'] as CustomSquareOscillatorNode).webApiNode.connect
			).toHaveBeenCalledWith(
				(audioNodeDatabase['1'] as CustomSquareOscillatorNode).webApiNode.frequency
			);
			expect((audioNodeDatabase['1'] as CustomSquareOscillatorNode).webApiNode.type).toBe('square');

			expect((audioNodeDatabase['2'] as CustomSineOscillatorNode).webApiNode.frequency.value).toBe(
				30
			);
			expect((audioNodeDatabase['2'] as CustomSineOscillatorNode).webApiNode.type).toBe('sine');
		});

		it('returns oscillator connected to gain connected to destination', () => {
			const audioElements = {
				'1': {
					type: 'square-oscillator' as const,
					parameters: {
						frequency: { base: 333, inputs: [] },
						detune: { base: 0, inputs: [] }
					}
				},
				'2': {
					type: 'gain' as const,
					inputs: ['1'],
					parameters: {
						gain: { base: 0.5, inputs: [] }
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
				(audioNodeDatabase['1'] as CustomSquareOscillatorNode).webApiNode.connect
			).toHaveBeenCalledWith((audioNodeDatabase['2'] as CustomGainNode).webApiNode);
			expect((audioNodeDatabase['2'] as CustomGainNode).webApiNode.connect).toHaveBeenCalledWith(
				(audioNodeDatabase['3'] as DestinationNode).webApiNode
			);
			expect((audioNodeDatabase['2'] as CustomGainNode).webApiNode.gain.value).toBe(0.5);
			expect((audioNodeDatabase['1'] as CustomSquareOscillatorNode).webApiNode.type).toBe('square');
			expect(
				(audioNodeDatabase['1'] as CustomSquareOscillatorNode).webApiNode.frequency.value
			).toBe(333);
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
					type: 'sine-oscillator' as const,
					parameters: {
						frequency: { base: 440, inputs: [{ id: '1', output: 'frequency' }] },
						detune: { base: 0, inputs: [] }
					}
				},
				'4': {
					type: 'gain' as const,
					inputs: ['3'],
					parameters: {
						gain: { base: 0, inputs: [{ id: '2', output: 'envelope' }] }
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
					type: 'square-oscillator' as const,
					parameters: {
						frequency: { base: 333, inputs: [] },
						detune: { base: 0, inputs: [] }
					}
				}
			};
			const audioNodeDatabase: AudioNodeDatabase = {};

			updateAudioCanvas(audioElements, {}, audioNodeDatabase);

			expect(
				((audioNodeDatabase['1'] as CustomSquareOscillatorNode).webApiNode as OscillatorNode)
					.frequency.value
			).toBe(333);

			const newAudioElements = changeParameter(audioElements, '1', 'frequency', 444);

			updateAudioCanvas(newAudioElements, audioElements, audioNodeDatabase);

			expect(
				((audioNodeDatabase['1'] as CustomSquareOscillatorNode).webApiNode as OscillatorNode)
					.frequency.value
			).toBe(444);
		});

		it('creates new oscillator', () => {
			const audioElements = {
				'1': {
					type: 'square-oscillator' as const,
					parameters: {
						frequency: { base: 333, inputs: [] },
						detune: { base: 0, inputs: [] }
					}
				}
			};
			const audioNodeDatabase: AudioNodeDatabase = {};

			updateAudioCanvas(audioElements, {}, audioNodeDatabase);

			expect(audioNodeDatabase['1']).toBeDefined();

			const newAudioElements = addNode(audioElements, 'sine-oscillator');

			updateAudioCanvas(newAudioElements, audioElements, audioNodeDatabase);

			expect(audioNodeDatabase['1']).toBeDefined();
			expect(audioNodeDatabase['2']).toBeDefined();
			expect(
				((audioNodeDatabase['2'] as CustomSineOscillatorNode).webApiNode as OscillatorNode)
					.frequency.value
			).toBe(440);
			expect((audioNodeDatabase['2'] as CustomSineOscillatorNode).webApiNode.type).toBe('sine');
		});

		it('adds gain connected to oscillator', () => {
			const audioElements = {
				'1': {
					type: 'square-oscillator' as const,
					parameters: {
						frequency: { base: 333, inputs: [] },
						detune: { base: 0, inputs: [] }
					}
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
						gain: { base: 0.5, inputs: [] }
					}
				}
			};

			updateAudioCanvas(newAudioElements, audioElements, audioNodeDatabase);

			expect(audioNodeDatabase['1']).toBeDefined();
			expect(audioNodeDatabase['2']).toBeDefined();
			expect(
				(audioNodeDatabase['1'] as CustomSquareOscillatorNode).webApiNode.connect
			).toHaveBeenCalledWith((audioNodeDatabase['2'] as CustomGainNode).webApiNode);
			expect((audioNodeDatabase['2'] as CustomGainNode).webApiNode.gain.value).toBe(0.5);
			expect((audioNodeDatabase['1'] as CustomSquareOscillatorNode).webApiNode.type).toBe('square');
			expect(
				(audioNodeDatabase['1'] as CustomSquareOscillatorNode).webApiNode.frequency.value
			).toBe(333);
		});

		it('adds connection between oscillator and gain', () => {
			const audioElements = {
				'1': {
					type: 'square-oscillator' as const,
					parameters: {
						frequency: { base: 333, inputs: [] },
						detune: { base: 0, inputs: [] }
					}
				},
				'2': {
					type: 'gain' as const,
					inputs: [],
					parameters: {
						gain: { base: 0.5, inputs: [] }
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
				(audioNodeDatabase['1'] as CustomSquareOscillatorNode).webApiNode.connect
			).toHaveBeenCalledWith((audioNodeDatabase['2'] as CustomGainNode).webApiNode);
			expect((audioNodeDatabase['2'] as CustomGainNode).webApiNode.gain.value).toBe(0.5);
			expect((audioNodeDatabase['1'] as CustomSquareOscillatorNode).webApiNode.type).toBe('square');
			expect(
				(audioNodeDatabase['1'] as CustomSquareOscillatorNode).webApiNode.frequency.value
			).toBe(333);
		});

		it('removes connection between oscillator and gain', () => {
			const audioElements = {
				'1': {
					type: 'square-oscillator' as const,
					parameters: {
						frequency: { base: 333, inputs: [] },
						detune: { base: 0, inputs: [] }
					}
				},
				'2': {
					type: 'gain' as const,
					inputs: ['1'],
					parameters: {
						gain: { base: 0.5, inputs: [] }
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
				(audioNodeDatabase['1'] as CustomSquareOscillatorNode).webApiNode.disconnect
			).toHaveBeenCalledWith((audioNodeDatabase['2'] as CustomGainNode).webApiNode);
			expect((audioNodeDatabase['2'] as CustomGainNode).webApiNode.gain.value).toBe(0.5);
			expect((audioNodeDatabase['1'] as CustomSquareOscillatorNode).webApiNode.type).toBe('square');
			expect(
				(audioNodeDatabase['1'] as CustomSquareOscillatorNode).webApiNode.frequency.value
			).toBe(333);
		});

		it('adds connection between gain and oscillator detune parameter', () => {
			const audioElements = {
				'1': {
					type: 'square-oscillator' as const,
					parameters: {
						frequency: { base: 333, inputs: [] },
						detune: { base: 0, inputs: [] }
					}
				},
				'2': {
					type: 'gain' as const,
					inputs: [],
					parameters: {
						gain: { base: 0.5, inputs: [] }
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

			expect(newAudioElements['1']?.parameters.detune.inputs).toEqual([
				{ id: '2', output: 'audio' }
			]);

			updateAudioCanvas(newAudioElements, audioElements, audioNodeDatabase);

			expect(audioNodeDatabase['1']).toBeDefined();
			expect(audioNodeDatabase['2']).toBeDefined();
			expect((audioNodeDatabase['2'] as CustomGainNode).webApiNode.connect).toHaveBeenCalledWith(
				(audioNodeDatabase['1'] as CustomSquareOscillatorNode).webApiNode.detune
			);
			expect((audioNodeDatabase['2'] as CustomGainNode).webApiNode.gain.value).toBe(0.5);
			expect((audioNodeDatabase['1'] as CustomSquareOscillatorNode).webApiNode.type).toBe('square');
		});

		it('removes connection between gain and oscillator detune parameter', () => {
			const audioElements = {
				'1': {
					type: 'square-oscillator' as const,
					parameters: {
						frequency: { base: 333, inputs: [] },
						detune: { base: 0, inputs: [{ id: '2', output: 'audio' }] }
					}
				},
				'2': {
					type: 'gain' as const,
					inputs: [],
					parameters: {
						gain: { base: 0.5, inputs: [] }
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

			expect(newAudioElements['1']?.parameters.detune.inputs.length).toEqual(0);

			updateAudioCanvas(newAudioElements, audioElements, audioNodeDatabase);

			expect(audioNodeDatabase['1']).toBeDefined();
			expect(audioNodeDatabase['2']).toBeDefined();
			expect((audioNodeDatabase['2'] as CustomGainNode).webApiNode.disconnect).toHaveBeenCalledWith(
				(audioNodeDatabase['1'] as CustomSquareOscillatorNode).webApiNode.detune
			);
			expect((audioNodeDatabase['2'] as CustomGainNode).webApiNode.gain.value).toBe(0.5);
			expect((audioNodeDatabase['1'] as CustomSquareOscillatorNode).webApiNode.type).toBe('square');
		});

		it('removes oscillator conenected to gain', () => {
			const audioElements = {
				'1': {
					type: 'square-oscillator' as const,
					parameters: {
						frequency: { base: 333, inputs: [] },
						detune: { base: 0, inputs: [] }
					}
				},
				'2': {
					type: 'gain' as const,
					inputs: ['1'],
					parameters: {
						gain: { base: 0.5, inputs: [] }
					}
				}
			};
			const audioNodeDatabase: AudioNodeDatabase = {};

			updateAudioCanvas(audioElements, {}, audioNodeDatabase);

			const oscillatorNode = audioNodeDatabase['1'] as CustomSineOscillatorNode;

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
					type: 'square-oscillator' as const,
					parameters: {
						frequency: { base: 333, inputs: [] },
						detune: { base: 0, inputs: [] }
					}
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

			expect(newAudioElements['1']?.parameters.detune.inputs).toEqual([
				{ id: '2', output: 'frequency' }
			]);

			updateAudioCanvas(newAudioElements, audioElements, audioNodeDatabase);

			expect(audioNodeDatabase['1']).toBeDefined();
			expect(audioNodeDatabase['2']).toBeDefined();

			expect((audioNodeDatabase['2'] as SequencerNode).webApiNode.connect).toHaveBeenCalledWith(
				(audioNodeDatabase['1'] as CustomSquareOscillatorNode).webApiNode.detune
			);
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
					type: 'sine-oscillator' as const,
					parameters: {
						frequency: { base: 440, inputs: [{ id: '1', output: 'frequency' }] },
						detune: { base: 0, inputs: [] }
					}
				}
			};

			const audioNodeDatabase: AudioNodeDatabase = {};

			updateAudioCanvas(audioElements, {}, audioNodeDatabase);

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
					}
				},
				'2': {
					type: 'gain' as const,
					inputs: ['1'],
					parameters: {
						gain: { base: 0.5, inputs: [] }
					}
				}
			};

			const audioNodeDatabase: AudioNodeDatabase = {};

			updateAudioCanvas(audioElements, {}, audioNodeDatabase);

			expect(
				(audioNodeDatabase['1'] as CustomSquareOscillatorNode).webApiNode.connect
			).toHaveBeenCalledTimes(1);
			expect((audioNodeDatabase['2'] as CustomGainNode).webApiNode.connect).not.toHaveBeenCalled();
			expect(
				(audioNodeDatabase['1'] as CustomSquareOscillatorNode).webApiNode.disconnect
			).not.toHaveBeenCalled();
			expect(
				(audioNodeDatabase['2'] as CustomGainNode).webApiNode.disconnect
			).not.toHaveBeenCalled();

			const newAudioElements = { ...audioElements };

			updateAudioCanvas(newAudioElements, audioElements, audioNodeDatabase);

			expect(
				(audioNodeDatabase['1'] as CustomSquareOscillatorNode).webApiNode.connect
			).toHaveBeenCalledTimes(1);
			expect((audioNodeDatabase['2'] as CustomGainNode).webApiNode.connect).not.toHaveBeenCalled();
			expect(
				(audioNodeDatabase['1'] as CustomSquareOscillatorNode).webApiNode.disconnect
			).not.toHaveBeenCalled();
			expect(
				(audioNodeDatabase['2'] as CustomGainNode).webApiNode.disconnect
			).not.toHaveBeenCalled();
		});

		it('removes only one line from inputs', () => {
			const audioElements = {
				'1': {
					type: 'square-oscillator' as const,
					parameters: {
						frequency: { base: 333, inputs: [] },
						detune: { base: 0, inputs: [] }
					}
				},
				'2': {
					type: 'gain' as const,
					inputs: ['1'],
					parameters: {
						gain: { base: 0.5, inputs: [{ id: '1', output: 'audio' }] }
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
					}
				},
				'2': {
					type: 'gain' as const,
					inputs: ['1'],
					parameters: {
						gain: { base: 0.5, inputs: [{ id: '1', output: 'audio' }] }
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
					}
				},
				'2': {
					type: 'gain' as const,
					inputs: ['1'],
					parameters: {
						gain: { base: 0.5, inputs: [{ id: '1', output: 'audio' }] }
					}
				}
			};

			const newAudioElements = insertExistingNodes(audioElements, ['1', '2'], { x: 0, y: 0 });

			expect(newAudioElements['3']).toBeDefined();
			expect(newAudioElements['3']?.type).toBe('square-oscillator');

			expect(newAudioElements['4']).toBeDefined();
			expect(newAudioElements['4']?.type).toBe('gain');
			expect(newAudioElements['4']?.inputs?.[0]).toBe('3');
			expect(newAudioElements['4']?.parameters?.['gain'].inputs[0]?.id).toBe('3');
		});

		it('adds copied node to inputs and parameters of other nodes', () => {
			const audioElements = {
				'1': {
					type: 'square-oscillator' as const,
					parameters: {
						frequency: { base: 333, inputs: [] },
						detune: { base: 0, inputs: [] }
					}
				},
				'2': {
					type: 'gain' as const,
					inputs: ['1'],
					parameters: {
						gain: { base: 0.5, inputs: [{ id: '1', output: 'audio' }] }
					}
				}
			};

			const newAudioElements = insertExistingNodes(audioElements, ['1'], { x: 0, y: 0 });

			expect(newAudioElements['3']).toBeDefined();
			expect(newAudioElements['3']?.type).toBe('square-oscillator');

			expect(newAudioElements['2']?.inputs?.length).toBe(2);
			expect(newAudioElements['2']?.inputs).toEqual(['1', '3']);
			expect(newAudioElements['2']?.parameters?.['gain'].inputs.length).toBe(2);
			expect(newAudioElements['2']?.parameters?.['gain'].inputs['1']).toEqual({
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
					}
				},
				'2': {
					type: 'gain' as const,
					inputs: ['1'],
					parameters: {
						gain: { base: 0.5, inputs: [{ id: '1', output: 'audio' }] }
					}
				},
				'3': {
					type: 'multiply' as const,
					inputs: [],
					parameters: {
						factor: {
							base: 0,
							inputs: []
						}
					}
				}
			};

			const newAudioElements = insertExistingNodes(audioElements, ['3'], { x: 0, y: 0 });

			expect(newAudioElements['2']?.inputs?.length).toBe(1);
			expect(newAudioElements['2']?.parameters?.['gain'].inputs.length).toBe(1);
		});
	});
});
