/**
 * @jest-environment jsdom
 */
import './mocks';
import { createAudioCanvas, type AudioNodeDatabase } from './AudioCanvas';
import { OscillatorNodeMock } from './mocks';

describe('AudioCanvas', () => {
	describe('createAudioCanvas', () => {
		it('returns single oscillator', () => {
			const audioElements = {
				'1': {
					type: 'oscillator' as const,
					parameters: {
						frequency: 333
					},
					oscillatorType: 'square' as const
				}
			};
			const audioNodeDatabase: AudioNodeDatabase = {};

			createAudioCanvas(audioElements, audioNodeDatabase);

			expect(audioNodeDatabase['1']).toBeDefined();
			expect(audioNodeDatabase['1']).toBeInstanceOf(OscillatorNodeMock);
			expect((audioNodeDatabase['1'] as OscillatorNode).frequency.value).toBe(333);
			expect((audioNodeDatabase['1'] as OscillatorNode).type).toBe('square');
		});

		it('returns oscillator connected to gain', () => {
			const audioElements = {
				'1': {
					type: 'oscillator' as const,
					parameters: {
						frequency: 333,
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
			expect(audioNodeDatabase['1']?.connect).toHaveBeenCalledWith(audioNodeDatabase['2']);
			expect((audioNodeDatabase['2'] as GainNode).gain.value).toBe(0.5);
			expect((audioNodeDatabase['1'] as OscillatorNode).frequency.value).toBe(333);
			expect((audioNodeDatabase['1'] as OscillatorNode).type).toBe('square');
		});

		it('returns oscillator connected to oscillator frequency', () => {
			const audioElements = {
				'1': {
					type: 'oscillator' as const,
					parameters: {
						frequency: ['2']
					},
					oscillatorType: 'square' as const
				},
				'2': {
					type: 'oscillator' as const,
					parameters: {
						frequency: 30
					},
					oscillatorType: 'sine' as const
				}
			};
			const audioNodeDatabase: AudioNodeDatabase = {};

			createAudioCanvas(audioElements, audioNodeDatabase);

			expect(audioNodeDatabase['1']).toBeDefined();
			expect(audioNodeDatabase['2']).toBeDefined();
			expect(audioNodeDatabase['2']?.connect).toHaveBeenCalledWith(
				(audioNodeDatabase['1'] as OscillatorNode).frequency
			);
			expect((audioNodeDatabase['2'] as OscillatorNode).frequency.value).toBe(30);
			expect((audioNodeDatabase['2'] as OscillatorNode).type).toBe('sine');

			expect((audioNodeDatabase['1'] as OscillatorNode).type).toBe('square');
		});
	});

	it('returns 120bpm trigger connected to envelope connected to oscillator', () => {
		const audioElements = {
			'1': {
				type: 'trigger' as const,
				parameters: {
					tempoInBpm: 120,
				},
			},
			'2': {
				type: 'envelope' as const,
				inputs: ['1'],
				parameters: {
					attack: 0.1,
					decay: 0.1,
					sustain: 0.5,
					release: 0.1,
				},
			},
			'3': {
				type: 'oscillator' as const,
				inputs: ['2'],
				parameters: {
					frequency: 440,
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
