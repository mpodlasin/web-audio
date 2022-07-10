import React from 'react';
import { GLOBAL_AUDIO_CONTEXT } from '../audioContext';
import { AudioComponentDefinition, AudioComponentProps } from './AudioComponentDefinition';

const BIQUAD_FILTER_TYPES: BiquadFilterType[] = ['lowpass', 'highpass', 'bandpass'];

export interface FilterState {
    frequency: number;
    type: BiquadFilterType;
}

export const FilterDefinition: AudioComponentDefinition<BiquadFilterNode, FilterState> = {
  component: Filter,
  initializeMutableState: () => new BiquadFilterNode(GLOBAL_AUDIO_CONTEXT),
  initialSerializableState: {
    frequency: 0,
    type: BIQUAD_FILTER_TYPES[0],
  },
  inPlugs: [
    {
      type: 'audio',
      name: 'Input',
      getParameter: filterNode => filterNode,
    },
    {
      type: 'number',
      name: 'Frequency',
      getParameter: filterNode => filterNode.frequency,
    }
  ],
  outPlugs: [
    {
      type: 'audio',
      name: 'Output',
      getParameter: filterNode => filterNode,
    }
  ],
  color: 'lightpink',
};

export type FilterProps = AudioComponentProps<BiquadFilterNode, FilterState>;

export function Filter({ mutableState: filter, serializableState: state, onSerializableStateChange: onStateChange, inPlugs }: FilterProps) {
    React.useEffect(() => {
        const connected = inPlugs.number['Frequency'].connected;

        if (!connected) {
          filter.frequency.value = state.frequency;
        }
        
        filter.type = state.type;
    }, [filter, state.frequency, state.type, inPlugs.number['Frequency'].connected]);

    const changeFrequency: React.FormEventHandler<HTMLInputElement> = (e) => {
        const currentTarget = e.currentTarget;
        onStateChange(state => ({...state, frequency: currentTarget.valueAsNumber})); 
      }

    const handleFilterTypeClick = (e: React.FormEvent<HTMLSelectElement>) => {
        const currentTarget = e.currentTarget;
        onStateChange(state => ({...state, type: currentTarget.value as BiquadFilterType}));
      }

    return (
        <div>
            <select value={state.type} onChange={handleFilterTypeClick}>
                {BIQUAD_FILTER_TYPES.map(filterType => (
                    <option key={filterType} value={filterType}>
                    {filterType}
                    </option>
                ))}
            </select>
            <div>
            <input value={state.frequency} type="range" min={0} max={1000} step={1} onInput={changeFrequency} />
            </div>
        </div>
    )
}

