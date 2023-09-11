import type { SerializedAudioElements } from '../audio/AudioCanvas';

export const triggerEnvelopeOscillatorGainDestination: SerializedAudioElements = {
	'1': {
		type: 'trigger' as const,
		parameters: {},
		tempoInBpm: 40
	},
	'2': {
		type: 'envelope' as const,
		inputs: ['1'],
		parameters: {},
		attack: 0,
		decay: 0,
		sustain: 0.3,
		release: 0.5
	},
	'3': {
		type: 'oscillator' as const,
		parameters: {
			frequency: { base: 220, inputs: [] },
			detune: { base: 0, inputs: [] }
		},
		oscillatorType: 'sine' as const
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
