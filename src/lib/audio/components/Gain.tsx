import React from 'react';
import { GLOBAL_AUDIO_CONTEXT } from '../audioContext';
import { AudioComponentDefinition, AudioComponentProps } from './AudioComponentDefinition';

export interface GainState {
  gain: number;
}

export const GainDefinition: AudioComponentDefinition<GainNode, GainState> = {
  component: Gain,
  initializeMutableState: () => new GainNode(GLOBAL_AUDIO_CONTEXT),
  initialSerializableState: {
    gain: 0,
  },
  inPlugs: [
    {
      type: 'audio',
      name: 'Input',
      getParameter: gainNode => gainNode,
    },
    {
      type: 'number',
      name: 'Gain',
      getParameter: gainNode => gainNode.gain,
    }
  ],
  outPlugs: [
    {
      type: 'audio',
      name: 'Output',
      getParameter: gainNode => gainNode,
    }
  ],
  color: 'lightgray',
};

export type GainProps = AudioComponentProps<GainNode, GainState>;

export function Gain({ mutableState: gain, serializableState: state, onSerializableStateChange: onStateChange, inPlugs }: GainProps) {
  React.useEffect(() => {
    if (!inPlugs.number['Gain'].connected) {
      gain.gain.value = state.gain;
    }
    }, [gain, state.gain, inPlugs.number['Gain'].connected]);
  
    const changeGain: React.FormEventHandler<HTMLInputElement> = (e) => {
      const currentTarget = e.currentTarget;
      onStateChange(state => ({...state, gain: currentTarget.valueAsNumber}));
    }
  
    return <div>
      <input value={state.gain} type="range" min={0} max={1} step={0.01} onInput={changeGain} />
      </div>;
  }

