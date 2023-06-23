/**
 * @jest-environment jsdom
 */
import './mocks';
import { createAudioCanvas, type AudioNodeDatabase, CustomOscillatorNode, CustomGainNode, DestinationNode } from './AudioCanvas';
import { OscillatorNodeMock } from './mocks';

describe('AudioCanvas', () => {
	describe('createAudioCanvas', () => {
		it('returns single oscillator', () => {
			const audioElements = {
				'1': {
					type: 'oscillator' as const,
					parameters: {
						frequency: 333,
						detune: 0,
					},
					oscillatorType: 'square' as const
				}
			};
			const audioNodeDatabase: AudioNodeDatabase = {};

			createAudioCanvas(audioElements, audioNodeDatabase);

			expect(audioNodeDatabase['1']).toBeDefined();
			expect((audioNodeDatabase['1'] as CustomOscillatorNode).webApiNode).toBeInstanceOf(OscillatorNodeMock);
			expect(((audioNodeDatabase['1'] as CustomOscillatorNode).webApiNode as OscillatorNode).frequency.value).toBe(333);
			expect(((audioNodeDatabase['1'] as CustomOscillatorNode).webApiNode as OscillatorNode).type).toBe('square');
		});

		it('returns oscillator connected to gain', () => {
			const audioElements = {
				'1': {
					type: 'oscillator' as const,
					parameters: {
						frequency: 333,
						detune: 0,
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

			createAudioCanvas(audioElements, audioNodeDatabase);

			expect(audioNodeDatabase['1']).toBeDefined();
			expect(audioNodeDatabase['2']).toBeDefined();
			expect((audioNodeDatabase['1'] as CustomOscillatorNode).webApiNode.connect).toHaveBeenCalledWith((audioNodeDatabase['2'] as CustomGainNode).webApiNode);
			expect((audioNodeDatabase['2'] as CustomGainNode).webApiNode.gain.value).toBe(0.5);
			expect((audioNodeDatabase['1'] as CustomOscillatorNode).webApiNode.type).toBe('square');
			expect((audioNodeDatabase['1'] as CustomOscillatorNode).webApiNode.frequency.value).toBe(333);
		});

		it('returns oscillator connected to oscillator frequency', () => {
			const audioElements = {
				'1': {
					type: 'oscillator' as const,
					parameters: {
						frequency: ['2'],
						detune: 0,
					},
					oscillatorType: 'square' as const
				},
				'2': {
					type: 'oscillator' as const,
					parameters: {
						frequency: 30,
						detune: 0,
					},
					oscillatorType: 'sine' as const
				}
			};
			const audioNodeDatabase: AudioNodeDatabase = {};

			createAudioCanvas(audioElements, audioNodeDatabase);

			expect(audioNodeDatabase['1']).toBeDefined();
			expect(audioNodeDatabase['2']).toBeDefined();
			expect((audioNodeDatabase['2'] as CustomOscillatorNode).webApiNode.connect).toHaveBeenCalledWith(
				(audioNodeDatabase['1'] as CustomOscillatorNode).webApiNode.frequency
			);
			expect((audioNodeDatabase['1'] as CustomOscillatorNode).webApiNode.type).toBe('square');

			expect((audioNodeDatabase['2'] as CustomOscillatorNode).webApiNode.frequency.value).toBe(30);
			expect((audioNodeDatabase['2'] as CustomOscillatorNode).webApiNode.type).toBe('sine');
		});
	});

	it('returns oscillator connected to gain connected to destination', () => {
		const audioElements = {
			'1': {
				type: 'oscillator' as const,
				parameters: {
					frequency: 333,
					detune: 0,
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
				inputs: ['2'],
			}
		};
		const audioNodeDatabase: AudioNodeDatabase = {};

		createAudioCanvas(audioElements, audioNodeDatabase);

		expect(audioNodeDatabase['1']).toBeDefined();
		expect(audioNodeDatabase['2']).toBeDefined();
		expect(audioNodeDatabase['3']).toBeDefined();
		expect((audioNodeDatabase['1'] as CustomOscillatorNode).webApiNode.connect).toHaveBeenCalledWith((audioNodeDatabase['2'] as CustomGainNode).webApiNode);
		expect((audioNodeDatabase['2'] as CustomGainNode).webApiNode.connect).toHaveBeenCalledWith((audioNodeDatabase['3'] as DestinationNode).webApiNode);
		expect((audioNodeDatabase['2'] as CustomGainNode).webApiNode.gain.value).toBe(0.5);
		expect((audioNodeDatabase['1'] as CustomOscillatorNode).webApiNode.type).toBe('square');
		expect((audioNodeDatabase['1'] as CustomOscillatorNode).webApiNode.frequency.value).toBe(333);
	});

	it('returns 120bpm trigger connected to envelope connected to oscillator', () => {
		const audioElements = {
			'1': {
				type: 'trigger' as const,
				parameters: {},
				tempoInBpm: 120,
			},
			'2': {
				type: 'envelope' as const,
				inputs: ['1'],
				parameters: {},
				attack: 0.1,
				decay: 0.1,
				sustain: 0.5,
				release: 0.1,
			},
			'3': {
				type: 'oscillator' as const,
				parameters: {
					frequency: 440,
					detune: 0,
				},
				oscillatorType: 'sine' as const
			},	
			'4': {
				type: 'gain' as const,
				inputs: ['3'],
				parameters: {
					gain: ['2'],
				},
			},
			'5': {
				type: 'destination' as const,
				inputs: ['4'],
			}
		}
		const audioNodeDatabase: AudioNodeDatabase = {};

		createAudioCanvas(audioElements, audioNodeDatabase);
	});
});
