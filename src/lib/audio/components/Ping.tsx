import React from 'react';
import { Subject } from 'rxjs';
import { GLOBAL_AUDIO_CONTEXT } from '../audioContext';
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

export function Ping({ mutableState: ping, outPlugs }: PingProps) {
    const audioParamPing = outPlugs.ping['Ping'].value;

    const handleMouseDown = () => {
        ping.next();

        if (audioParamPing) {
            audioParamPing.start(GLOBAL_AUDIO_CONTEXT.currentTime);
        }
    }

    const handleMouseUp = () => {

        if (audioParamPing) {
            audioParamPing.stop(GLOBAL_AUDIO_CONTEXT.currentTime);
        }
    };

    return (
        <div>
            <button onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>Ping</button>
        </div>
    )
};