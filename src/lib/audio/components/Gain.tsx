import React from 'react';
import { AudioComponentDefinition, AudioComponentProps } from './AudioComponentDefinition';

export interface GainState {
  gain: number;
}

export const GainDefinition: AudioComponentDefinition<GainNode, GainState> = {
  component: Gain,
  initializeMutableState: ({ globalAudioContext }) => new GainNode(globalAudioContext),
  initialSerializableState: {
    gain: 0,
  },
  inPlugs: {
    'Input': {
      type: 'audio',
      getParameter: gainNode => gainNode,
    },
    'Gain': {
      type: 'number',
      getParameter: gainNode => gainNode.gain,
    },
  },
  outPlugs: {
    'Output': {
      type: 'audio',
      getParameter: gainNode => gainNode,
    }
  },
  color: 'lightgray',
};

export type GainProps = AudioComponentProps<GainNode, GainState>;

export function Gain({ mutableState: gain, serializableState: state, onSerializableStateChange: onStateChange }: GainProps) {
  React.useEffect(() => {
      gain.gain.value = state.gain;
    }, [gain, state.gain]);
  
    const changeGain: React.FormEventHandler<HTMLInputElement> = (e) => {
      const currentTarget = e.currentTarget;
      onStateChange(state => ({...state, gain: currentTarget.valueAsNumber}));
    }

    const [readGain, setReadGain] = React.useState(0);

    React.useEffect(() => {
      setInterval(() => {
        setReadGain(gain.gain.value);
      }, 50);
    }, []);
  
    return <div>
      <div>Value: {gain.gain.value.toFixed(2)}</div>
      <input value={state.gain} type="range" min={0} max={1} step={0.01} onInput={changeGain} />
      </div>;
  }

