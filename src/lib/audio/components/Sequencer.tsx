import React from 'react';
import { AudioComponentDefinition, AudioComponentProps } from './AudioComponentDefinition';

const NOTES = [1, 2, 3, 4, 5, 6, 7, 8];
const STEPS = [1, 2, 3, 4, 5, 6, 7, 8];

export interface SequencerState {
    tempo: number;
    frequency: number;
    sequenceMatrix: boolean[][];
}

export const SequencerDefinition: AudioComponentDefinition<void, SequencerState> = {
    component: Sequencer,
    initialState: {
        tempo: 120,
        frequency: 0,
        sequenceMatrix: NOTES.map(() => STEPS.map(() => false)),
    },
    inPlugs: [],
    outPlugs: [
      {
        type: 'number',
        name: 'Frequency',
        getStateParameter: state => state.frequency,
      },
    ],
    color: 'lightblue',
};

export type SequencerProps = AudioComponentProps<void, SequencerState>;

export function Sequencer({ state, onStateChange }: SequencerProps) {
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [stepClock, setStepClock] = React.useState(0);

    const handleCheckboxClick = (note: number, step: number) => () => {
        onStateChange(state => {
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

    React.useEffect(() => {
        const callback = () => {
            setStepClock(stepClock => {
                if (stepClock >= 7) return 0;

                return stepClock + 1;
            });
        };

        if (isPlaying) {
            const id = setInterval(callback, 60_000 / state.tempo);

            return () => { 
                clearInterval(id);
            };
        }
    }, [isPlaying, state.tempo]);

    React.useEffect(() => {
        onStateChange(state => {
            const sequenceMatrixIndex = state.sequenceMatrix.findIndex(note => note[stepClock] === true);

            if (sequenceMatrixIndex === -1) return state;

            const midiNote = [27, 29, 30, 32, 34, 35, 37, 39][sequenceMatrixIndex];
            const frequency = 440 * Math.pow(2, (midiNote - 69) / 12);

            return {
                ...state,
                frequency,
            }
        })
    }, [stepClock]);

    const handleChangeTempo = (e: React.FormEvent<HTMLInputElement>) => {
        const currentTarget = e.currentTarget;
        onStateChange(state => ({...state, tempo: currentTarget.valueAsNumber}))
    };

    const toggleIsPlaying = () => {
        setIsPlaying(isPlaying => !isPlaying);
    }

    return (
        <div>
        <button onClick={toggleIsPlaying}>{isPlaying ? 'Stop' : 'Play'}</button>
        <div>
            <input type="number" value={state.tempo} onChange={handleChangeTempo} />
        </div>
        <table>
            <tbody>
                <tr>
                    {STEPS.map(step => <td key={step}>{stepClock + 1 === step ? 'x' : ''}</td>)}
                </tr>
                {NOTES.map(note => (
                    <tr key={note}>{STEPS.map(step => (
                        <td key={step}><input checked={state.sequenceMatrix[note - 1][step - 1]} onChange={handleCheckboxClick(note, step)} type="checkbox" /></td>
                    ))}</tr>
                ))}
            </tbody>
        </table>
        </div>
    )
};