import React from 'react';
import { Subject } from 'rxjs';
import { AudioComponentDefinition, AudioComponentProps } from './AudioComponentDefinition';

export const PingDefinition: AudioComponentDefinition<Subject<void>, void> = {
    component: Ping,
    initializeMutableState: () => new Subject(),
    initialSerializableState: undefined,
    inPlugs: [],
    outPlugs: [
      {
        type: 'ping',
        name: 'Ping',
        getParameter: audioElement => audioElement,
      },
    ],
    color: 'lightcoral',
};

export type PingProps = AudioComponentProps<Subject<void>, void>;

export function Ping({ mutableState: ping }: PingProps) {
    const handleMouseDown = () => {
        ping.next();
    }

    return (
        <div>
            <button onMouseDown={handleMouseDown}>Ping</button>
        </div>
    )
};