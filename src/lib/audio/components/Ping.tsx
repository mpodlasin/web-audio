import { GLOBAL_AUDIO_CONTEXT } from '../audioContext';
import { AudioComponentDefinition, AudioComponentProps } from './AudioComponentDefinition';

export const PingDefinition: AudioComponentDefinition<void, void> = {
    component: Ping,
    initializeMutableState: () => undefined,
    initialSerializableState: undefined,
    inPlugs: [],
    outPlugs: [
      {
        type: 'ping',
        name: 'Ping',
      },
    ],
    color: 'lightcoral',
};

export type PingProps = AudioComponentProps<void, void>;

export function Ping({ outPlugs }: PingProps) {
    const audioParamPing = outPlugs.ping['Ping'].value;

    const handleMouseDown = () => { 
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