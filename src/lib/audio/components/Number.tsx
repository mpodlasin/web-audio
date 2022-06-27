import React from 'react';
import { Subject } from 'rxjs';
import { AudioComponentDefinition } from './AudioComponentDefinition';

export interface NumberState {
    number: number;
}

export const NumberDefinition: AudioComponentDefinition<Subject<number>, NumberState> = {
    component: Number,
    getAudioElement: () => new Subject(),
    initialState: {
        number: 0
    },
    inPlugs: [],
    outPlugs: [
      {
        type: 'number',
        name: 'Number',
        getAudioParameter: audioElement => audioElement,
      },
    ]
};

export interface NumberProps {
    audioElement: Subject<number>
    state: NumberState;
    onStateChange: React.Dispatch<React.SetStateAction<NumberState>>,
}

export function Number({ audioElement, state, onStateChange }: NumberProps) {
    const [number, setNumber] = React.useState(`${state.number}`);

    const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value;
        const valueAsNumber = e.currentTarget.valueAsNumber;

        setNumber(value);
        
        if (!isNaN(valueAsNumber)) {
            onStateChange(state => ({...state, number: valueAsNumber}));
            audioElement.next(valueAsNumber);
        }
    }

    return (
        <div>
            <input value={number} onChange={handleChange} type="number" />
        </div>
    )
};