import React from 'react';
import { AudioComponentDefinition, AudioComponentProps } from './AudioComponentDefinition';

const NOTES = [1, 2, 3, 4, 5, 6, 7, 8];
const STEPS = [1, 2, 3, 4, 5, 6, 7, 8];

export interface SequencerState {
    frequency: number;
    sequenceMatrix: boolean[][];
}

export const SequencerDefinition: AudioComponentDefinition<void, SequencerState> = {
    component: Sequencer,
    initialState: {
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
    ]
};

export type SequencerProps = AudioComponentProps<void, SequencerState>;

export function Sequencer({ state, onStateChange }: SequencerProps) {
    const [stepClock, setStepClock] = React.useState(0);

    const handleCheckboxClick = (note: number, step: number) => () => {
        onStateChange(state => {
            const sequenceMatrixCopy = state.sequenceMatrix.map(row => row.map(col => col));

            sequenceMatrixCopy[note - 1][step - 1] = !sequenceMatrixCopy[note - 1][step - 1];

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

        const id = setInterval(callback, 1000);

        return () => clearInterval(id);
    });

    React.useEffect(() => {
        onStateChange(state => {
            const sequenceMatrixIndex = state.sequenceMatrix[stepClock].indexOf(true);
            const midiNote = [27, 29, 30, 32, 34, 35, 37, 39][sequenceMatrixIndex];
            const frequency = 440 * Math.pow(2, (midiNote - 69) / 12);

            return {
                ...state,
                frequency,
            }
        })
    }, [stepClock]);

    return (
        <div>
        <div>{stepClock}</div>
        <table>
            <tbody>
                {NOTES.map(note => (
                    <tr>{STEPS.map(step => (
                        <td><input checked={state.sequenceMatrix[note - 1][step - 1]} onClick={handleCheckboxClick(note, step)} type="checkbox" /></td>
                    ))}</tr>
                ))}
            </tbody>
        </table>
        </div>
    )
};