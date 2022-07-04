import React from 'react';
import { GLOBAL_AUDIO_CONTEXT } from '../audioContext';
import { AudioComponentDefinition, AudioComponentProps } from './AudioComponentDefinition';

const OSCILLATOR_TYPES: OscillatorType[] = ["sine", "square", "sawtooth", "triangle"];

export interface OscillatorState {
  frequency: number;
  type: OscillatorType;
}

export const OscillatorDefinition: AudioComponentDefinition<OscillatorNode, OscillatorState> = {
  component: Oscillator,
  initializeMutableState: () => new OscillatorNode(GLOBAL_AUDIO_CONTEXT),
  initialSerializableState: {
    frequency: 440,
    type: OSCILLATOR_TYPES[0],
  },
  inPlugs: [
    {
      type: 'number',
      name: 'Frequency',
      getParameter: oscillatorNode => oscillatorNode.frequency,
    }
  ],
  outPlugs: [
    {
      type: 'audio',
      name: 'Output',
      getParameter: oscillatorNode => oscillatorNode,
    }
  ],
  color: 'lightyellow',
};

export type OscillatorProps = AudioComponentProps<OscillatorNode, OscillatorState>;

export function Oscillator({ mutableState: oscillator, serializableState: state, onSerializableStateChange: onStateChange, inPlugs }: OscillatorProps) {
  React.useEffect(() => {
    oscillator.start();
  }, [oscillator])
  
  React.useEffect(() => {
    oscillator.type = state.type;
    oscillator.frequency.value = state.frequency;
  }, [state.type, state.frequency]);

  const handleOscillatorTypeClick = (e: React.FormEvent<HTMLSelectElement>) => {
    const currentTarget = e.currentTarget;
    onStateChange(state => ({...state, type: currentTarget.value as OscillatorType}));
  }

  const changeFrequency: React.FormEventHandler<HTMLInputElement> = (e) => {
    const currentTarget = e.currentTarget;
    onStateChange(state => ({...state, frequency: currentTarget.valueAsNumber}));
  };

  React.useEffect(() => {
    const frequency = inPlugs.number['Frequency'];

    if (frequency) {
      onStateChange(state => ({...state, frequency}));
    }
  }, [inPlugs.number['Frequency']]);

  return <div>
    <select value={state.type} onChange={handleOscillatorTypeClick}>
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
