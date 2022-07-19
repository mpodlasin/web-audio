import React from 'react';
import { CallbackPing } from '../nodes/CallbackPing';
import { AudioComponentDefinition, AudioComponentProps } from './AudioComponentDefinition';

const NOTES = [1, 2, 3, 4, 5, 6, 7, 8];
const STEPS = [1, 2, 3, 4, 5, 6, 7, 8];

const MIDI_MAP = [39, 41, 42, 44, 46, 47, 49, 51];

export interface SequencerState {
    tempo: number;
    sequenceMatrix: boolean[][];
    octave: number;
}

export const SequencerDefinition: AudioComponentDefinition<CallbackPing, SequencerState> = {
    component: Sequencer,
    initialSerializableState: {
        octave: 0,
        tempo: 120,
        sequenceMatrix: NOTES.map(() => STEPS.map(() => false)),
    },
    initializeMutableState: () => new CallbackPing(),
    inPlugs: {
        'Start/Stop': {
            type: 'ping',
            getParameter: sequencerPing => sequencerPing,
        }
    },
    outPlugs: {
        'Frequency': {
            type: 'number',
        },
        'Ping': {
            type: 'ping',
        }
    },
    color: 'lightblue',
};

export type SequencerProps = AudioComponentProps<CallbackPing, SequencerState>;

const CLOCK_TRIGGER = 25;

export function Sequencer({ mutableState: sequencerPing, serializableState, onSerializableStateChange, outPlugs, applicationContext }: SequencerProps) {
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [startTime, setStartTime] = React.useState(0);

    const ping = outPlugs.ping['Ping'].value;
    const frequency = outPlugs.number['Frequency'].value;

    React.useEffect(() => {
        sequencerPing.onStart = time => {
            setStartTime(time);
            setIsPlaying(true);
        };

        sequencerPing.onStop = () => {
            setIsPlaying(false);
        };
    }, [sequencerPing]);

    React.useEffect(() => {
        if (isPlaying) {
            let nextNoteTime = startTime;
            let step = 0;

            const id = setInterval(() => {
                while (nextNoteTime < applicationContext.globalAudioContext.currentTime + (applicationContext.lookahead / 1000)) {
                    const nextNextNoteTime = nextNoteTime + (((60_000 / serializableState.tempo) / 1000) / 2);

                    const noteToPlay = serializableState.sequenceMatrix.findIndex(row => row[step] === true);

                    if (noteToPlay !== -1) {
                        if (frequency) frequency.setValueAtTime(
                            440 * Math.pow(2, ((MIDI_MAP[noteToPlay] + (serializableState.octave * 12)) - 69) / 12), 
                            nextNoteTime
                        );
                        if (ping) ping.start(nextNoteTime);
                        if (ping) ping.stop(nextNextNoteTime);
                    }

                    if (step >= 7) {
                        step = 0;
                    } else {
                        step++;
                    }

                    nextNoteTime = nextNextNoteTime;
                }
            }, CLOCK_TRIGGER);

            return () => clearInterval(id);
        }
    }, [frequency, ping, serializableState.tempo, isPlaying]);

    const handleCheckboxClick = (note: number, step: number) => () => {
        onSerializableStateChange(state => {
            const sequenceMatrixCopy = state.sequenceMatrix.map(row => row.map(col => col));

            const newSequenceMatrixValue = !sequenceMatrixCopy[note - 1][step - 1];

            if (newSequenceMatrixValue === true) {
                sequenceMatrixCopy.forEach(row => {
                    row[step - 1] = false;
                });
            }

            sequenceMatrixCopy[note - 1][step - 1] = newSequenceMatrixValue;

            return {
                ...state,
                sequenceMatrix: sequenceMatrixCopy,
            }
        })
    };

    const handleChangeTempo = (e: React.FormEvent<HTMLInputElement>) => {
        const currentTarget = e.currentTarget;
        onSerializableStateChange(state => ({...state, tempo: currentTarget.valueAsNumber}))
    };

    const toggleIsPlaying = () => {
        setIsPlaying(isPlaying => !isPlaying);
    }

    const handleOctaveChange = (e: React.FormEvent<HTMLSelectElement>) => {
        const currentTarget = e.currentTarget;
        onSerializableStateChange(state => ({...state, octave: parseInt(currentTarget.value, 10)}))
    };

    return (
        <div>
        <button onClick={toggleIsPlaying}>{isPlaying ? 'Stop' : 'Play'}</button>
        <div>
            <select value={serializableState.octave} onChange={handleOctaveChange}>
                {[-2, -1, 0, 1, 2].map(octave => 
                    <option key={octave} value={octave}>{octave}</option>
                )}
            </select>
        </div>
        <div>
            <input type="number" value={serializableState.tempo} onChange={handleChangeTempo} />
        </div>
        <table>
            <tbody>
                {/* <tr>
                    {STEPS.map(step => <td key={step}>{stepClock + 1 === step ? 'x' : ''}</td>)}
                </tr> */}
                {NOTES.map(note => (
                    <tr key={note}>{STEPS.map(step => (
                        <td key={step}>
                            <input
                            aria-label={`Step ${step - 1}, note ${note - 1}`}
                            checked={serializableState.sequenceMatrix[note - 1][step - 1]} 
                            onChange={handleCheckboxClick(note, step)} 
                            type="checkbox" 
                            />
                        </td>
                    ))}</tr>
                ))}
            </tbody>
        </table>
        </div>
    )
};