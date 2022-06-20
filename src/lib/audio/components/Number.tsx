import React from 'react';
import { Subject } from 'rxjs';

export interface NumberProps {
    audioElement: Subject<number>
}

export const Number = ({ audioElement }: NumberProps) => {
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