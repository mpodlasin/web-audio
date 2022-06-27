import React from 'react';
import { AudioComponentDefinition } from './AudioComponentDefinition';

export const GainDefinition: AudioComponentDefinition<GainNode, void> = {
  component: Gain,
  getAudioElement: audioContext => new GainNode(audioContext),
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
  audioElement: GainNode;
  audioContext: AudioContext;
}

export function Gain({ audioElement: gain, audioContext }: GainProps) {
    React.useEffect(() => {
      gain.gain.value = 0;
    }, [gain]);
  
    const changeGain: React.FormEventHandler<HTMLInputElement> = (e) => {
      gain.gain.setValueAtTime(e.currentTarget.valueAsNumber, audioContext.currentTime)
      gain.gain.value = e.currentTarget.valueAsNumber;
    }
  
    return <div>
      <input type="range" min={0} max={1} step={0.01} defaultValue={0} onInput={changeGain} />
      </div>;
  }

