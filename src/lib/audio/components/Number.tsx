import React from 'react';
import { Subject } from 'rxjs';
import { AudioComponentDefinition } from './AudioComponentDefinition';

export const NumberDefinition: AudioComponentDefinition<Subject<number>> = {
    component: Number,
    getAudioElement: () => new Subject(),
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
}

export function Number({ audioElement }: NumberProps) {
    const [number, setNumber] = React.useState("");

    const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value;
        const valueAsNumber = e.currentTarget.valueAsNumber;

        setNumber(value);
        
        if (!isNaN(valueAsNumber)) {
            audioElement.next(valueAsNumber);
        }
    }

    return (
        <div>
            <input value={number} onChange={handleChange} type="number" />
        </div>
    )
};