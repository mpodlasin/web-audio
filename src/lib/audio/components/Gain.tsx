import React from 'react';
import { AudioComponentDefinition } from './AudioComponentDefinition';

export interface GainState {
  gain: number;
}

export const GainDefinition: AudioComponentDefinition<GainNode, GainState> = {
  component: Gain,
  getAudioElement: audioContext => new GainNode(audioContext),
  initialState: {
    gain: 0,
  },
  inPlugs: [
    {
      type: 'audio',
      name: 'Input',
      getAudioParameter: audioElement => audioElement,
    }
  ],
  outPlugs: [
    {
      type: 'audio',
      name: 'Output',
      getAudioParameter: audioElement => audioElement,
    }
  ],
};

export interface GainProps {
  state: GainState;
  onStateChange: React.Dispatch<React.SetStateAction<GainState>>;
  audioElement: GainNode;
}

export function Gain({ audioElement: gain, state, onStateChange }: GainProps) {
    React.useEffect(() => {
      gain.gain.value = state.gain;
    }, [gain, state.gain]);
  
    const changeGain: React.FormEventHandler<HTMLInputElement> = (e) => {
      const currentTarget = e.currentTarget;
      onStateChange(state => ({...state, gain: currentTarget.valueAsNumber}));
    }
  
    return <div>
      <input value={state.gain} type="range" min={0} max={1} step={0.01} onInput={changeGain} />
      </div>;
  }

