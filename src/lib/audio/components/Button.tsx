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
    inPlugs: {},
    outPlugs: {
        'Ping': {
            type: 'ping',
        }
    },
    color: 'lightcoral',
};

export type ButtonProps = AudioComponentProps<void, ButtonState>;

export function Button({ outPlugs, serializableState: state, onSerializableStateChange: onStateChange, applicationContext }: ButtonProps) {
    const audioParamPing = outPlugs.ping['Ping'].value;

    const handleClick = () => {
        const isOn = state.on;
        onStateChange(state => ({...state, on: !isOn}));

        if (!audioParamPing) return;

        if (!isOn) {
            audioParamPing.start(applicationContext.globalAudioContext.currentTime);
        } else {
            audioParamPing.stop(applicationContext.globalAudioContext.currentTime);
        }
    }

    return (
        <div>
            <button onClick={handleClick}>{state.on ? 'Off' : 'On'}</button>
        </div>
    )
};