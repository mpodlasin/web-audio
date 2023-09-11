import type { SerializedAudioElements } from '../audio/AudioCanvas';

export const midiEnvelopeOscillatorGainDestination: SerializedAudioElements = {
	'1': {
		type: 'midi' as const,
		parameters: {}
	},
	'2': {
		type: 'envelope' as const,
		inputs: [{ id: '1', output: 'trigger' }],
		parameters: {},
		attack: 0,
		decay: 0,
		sustain: 0.5,
		release: 0.9
	},
	'3': {
		type: 'oscillator' as const,
		parameters: {
			frequency: { base: 440, inputs: [{ id: '1', output: 'frequency' }] },
			detune: { base: 0, inputs: [] }
		},
		oscillatorType: 'sawtooth' as const
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
