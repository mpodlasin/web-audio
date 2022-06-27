import React from 'react';
import { Observable } from 'rxjs';
import { AudioComponentDefinition } from './AudioComponentDefinition';

const OSCILLATOR_TYPES: OscillatorType[] = ["sine", "square", "sawtooth", "triangle"];

export interface OscillatorState {
  frequency: number;
  type: OscillatorType;
}

export const OscillatorDefinition: AudioComponentDefinition<OscillatorNode, OscillatorState> = {
  component: Oscillator,
  getAudioElement: audioContext => new OscillatorNode(audioContext),
  initialState: {
    frequency: 440,
    type: OSCILLATOR_TYPES[0],
  },
  inPlugs: [
    {
      type: 'number',
      name: 'Frequency',
      getAudioParameter: audioElement => audioElement.frequency,
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

export interface OscillatorProps { 
  audioElement: OscillatorNode, 
  audioContext: AudioContext,
  state: OscillatorState,
  onStateChange: React.Dispatch<React.SetStateAction<OscillatorState>>,
  inPlugs: {
    [name: string]: {
      audioParameter: AudioNode | AudioParam | Observable<number>
    } | undefined
  }
}

export function Oscillator({ audioElement: oscillator, audioContext, state, onStateChange, inPlugs }: OscillatorProps) {
  React.useEffect(() => {
    oscillator.type = state.type;
    oscillator.frequency.value = state.frequency;
    oscillator.start();
  }, [oscillator]);

  const handleOscillatorTypeClick = (e: React.FormEvent<HTMLSelectElement>) => {
    const currentTarget = e.currentTarget;
    oscillator.type = e.currentTarget.value as OscillatorType;
    onStateChange(state => ({...state, type: currentTarget.value as OscillatorType}));
  }

  const changeFrequency: React.FormEventHandler<HTMLInputElement> = (e) => {
    const currentTarget = e.currentTarget;
    onStateChange(state => ({...state, frequency: currentTarget.valueAsNumber}));
    oscillator.frequency.setValueAtTime(currentTarget.valueAsNumber, audioContext.currentTime);
  };

  React.useEffect(() => {
    const frequencyPlug = inPlugs['Frequency'];

    if (frequencyPlug !== undefined && frequencyPlug.audioParameter instanceof Observable) {
      const subscription = frequencyPlug.audioParameter.subscribe(frequency => {
        onStateChange(state => ({...state, frequency}));
      });

      return () => subscription.unsubscribe();
    }
  }, [inPlugs]);

  return <div>
    <select onChange={handleOscillatorTypeClick}>
      {OSCILLATOR_TYPES.map(oscillatorType => (
        <option key={oscillatorType} value={oscillatorType}>
          {oscillatorType}
        </option>
      ))}
    </select>
    <div>
    <input value={state.frequency} onChange={changeFrequency} type="range" min="0" max="1000" step="1" />
    </div>
  </div>;
}
