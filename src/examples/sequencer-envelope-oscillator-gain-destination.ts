import type { SerializedAudioElements } from "../audio/AudioCanvas";

export const sequencerEnvelopeOscillatorGainDestination: SerializedAudioElements = {
    '1': {
        type: 'sequencer' as const,
        parameters: {},
        tempoInBpm: 40,
        notes: [
            { time: 0, duration: 0.1, note: 'A2' },
            { time: 1, duration: 0.1, note: 'C2' },
            { time: 2, duration: 0.1, note: 'E2' },
            { time: 3, duration: 0.1, note: 'F2' },
        ],
        loopLength: 4,
    },
    '2': {
        type: 'envelope' as const,
        inputs: [{ id: '1', output: 'trigger'}],
        parameters: {},
        attack: 0,
        decay: 0,
        sustain: 0.5,
        release: 0.9,
    },
    '3': {
        type: 'oscillator' as const,
        parameters: {
            frequency: [{ id: '1', output: 'frequency'}], 
            detune: 0,
        },
        oscillatorType: 'sawtooth' as const
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
};