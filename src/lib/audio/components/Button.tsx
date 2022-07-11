import { GLOBAL_AUDIO_CONTEXT } from '../audioContext';
import { AudioComponentDefinition, AudioComponentProps } from './AudioComponentDefinition';

export interface ButtonState {
    on: boolean;
}

export const ButtonDefinition: AudioComponentDefinition<void, ButtonState> = {
    component: Button,
    initializeMutableState: () => undefined,
    initialSerializableState: {
        on: false,
    },
    inPlugs: [],
    outPlugs: [
      {
        type: 'ping',
        name: 'Ping',
      },
    ],
    color: 'lightcoral',
};

export type ButtonProps = AudioComponentProps<void, ButtonState>;

export function Button({ outPlugs, serializableState: state, onSerializableStateChange: onStateChange }: ButtonProps) {
    const audioParamPing = outPlugs.ping['Ping'].value;

    const handleClick = () => {
        const isOn = state.on;
        onStateChange(state => ({...state, on: !isOn}));

        if (!audioParamPing) return;

        if (!isOn) {
            audioParamPing.start(GLOBAL_AUDIO_CONTEXT.currentTime);
        } else {
            audioParamPing.stop(GLOBAL_AUDIO_CONTEXT.currentTime);
        }
    }

    return (
        <div>
            <button onClick={handleClick}>{state.on ? 'On' : 'Off'}</button>
        </div>
    )
};