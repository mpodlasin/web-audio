import React from 'react';
import { AudioComponentDefinition, AudioComponentProps } from './AudioComponentDefinition';

const OSCILLATOR_TYPES: OscillatorType[] = ["sine", "square", "sawtooth", "triangle"];

export interface OscillatorState {
  frequency: number;
  type: OscillatorType;
}

export const OscillatorDefinition: AudioComponentDefinition<OscillatorNode, OscillatorState> = {
  component: Oscillator,
  initializeMutableState: ({ globalAudioContext }) => new OscillatorNode(globalAudioContext),
  initialSerializableState: {
    frequency: 440,
    type: OSCILLATOR_TYPES[0],
  },
  inPlugs: {
    'Frequency': {
      type: 'number',
      getParameter: oscillatorNode => oscillatorNode.frequency,
    }
  },
  outPlugs: {
    'Output': {
      type: 'audio',
      getParameter: oscillatorNode => oscillatorNode,
    }
  },
  color: 'lightyellow',
};

export type OscillatorProps = AudioComponentProps<OscillatorNode, OscillatorState>;

export function Oscillator({ mutableState: oscillator, serializableState: state, onSerializableStateChange: onStateChange }: OscillatorProps) {
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
