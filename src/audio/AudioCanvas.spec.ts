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
						frequency: 440
					},
					oscillatorType: 'sine' as const
				}
			};
			const audioNodeDatabase: AudioNodeDatabase = {};

			createAudioCanvas(audioElements, audioNodeDatabase);

			expect(audioNodeDatabase['1']).toBeDefined();
			expect(audioNodeDatabase['1']).toBeInstanceOf(OscillatorNodeMock);
		});

		it('returns oscillator connected to gain', () => {
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
			expect(audioNodeDatabase['1'].connect).toHaveBeenCalledWith(audioNodeDatabase['2']);
		});

		it('returns oscillator connected to oscillator frequency', () => {
			const audioElements = {
				'1': {
					type: 'oscillator' as const,
					parameters: {
						frequency: ['2']
					},
					oscillatorType: 'sine' as const
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
			expect(audioNodeDatabase['2'].connect).toHaveBeenCalledWith(
				(audioNodeDatabase['1'] as OscillatorNode).frequency
			);
		});
	});
});
