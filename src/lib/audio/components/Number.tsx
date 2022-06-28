import React from 'react';
import { AudioComponentDefinition } from './AudioComponentDefinition';

export interface NumberState {
    number: number;
}

export const NumberDefinition: AudioComponentDefinition<void, NumberState> = {
    component: Number,
    initialState: {
        number: 0
    },
    inPlugs: [],
    outPlugs: [
      {
        type: 'number',
        name: 'Number',
        getStateParameter: state => state.number,
      },
    ]
};

export interface NumberProps {
    state: NumberState;
    onStateChange: React.Dispatch<React.SetStateAction<NumberState>>,
}

export function Number({ state, onStateChange }: NumberProps) {
    const [number, setNumber] = React.useState(`${state.number}`);

    const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value;
        const valueAsNumber = e.currentTarget.valueAsNumber;

        setNumber(value);
        
        if (!isNaN(valueAsNumber)) {
            onStateChange(state => ({...state, number: valueAsNumber}));
        }
    }

    return (
        <div>
            <input value={number} onChange={handleChange} type="number" />
        </div>
    )
};