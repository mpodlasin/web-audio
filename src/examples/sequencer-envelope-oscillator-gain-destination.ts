import type { SerializedAudioElements } from "../audio/AudioCanvas";

export const sequencerEnvelopeOscillatorGainDestination: SerializedAudioElements = {
    '1': {
        type: 'sequencer' as const,
        parameters: {},
        tempoInBpm: 80,
        notes: [
            { time: 0, duration: 1, note: 'A3' },
            { time: 1, duration: 1, note: 'C3' },
            { time: 2, duration: 1, note: 'E3' },
            { time: 3, duration: 1, note: 'F3' },
        ],
        loopLength: 4,
    },
    '2': {
        type: 'envelope' as const,
        inputs: ['1'],
        parameters: {},
        attack: 0,
        decay: 0,
        sustain: 0.3,
        release: 0.5,
    },
    '3': {
        type: 'oscillator' as const,
        parameters: {
            frequency: [{ id: '1', output: 'trigger'}], 
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
};