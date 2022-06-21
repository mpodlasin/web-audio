import React from 'react';
import { Observable } from 'rxjs';
import { AudioComponentDefinition } from './AudioComponentDefinition';

const OSCILLATOR_TYPES: OscillatorType[] = ["sine", "square", "sawtooth", "triangle"];

export const OscillatorDefinition: AudioComponentDefinition<OscillatorNode> = {
  component: Oscillator,
  getAudioElement: audioContext => new OscillatorNode(audioContext),
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
  inPlugs: {
    [name: string]: {
      audioParameter: AudioNode | AudioParam | Observable<number>
    } | undefined
  }
}

export function Oscillator({ audioElement: oscillator, audioContext, inPlugs }: OscillatorProps) {
  const [frequency, setFrequency] = React.useState(440);

  React.useEffect(() => {
    oscillator.type = OSCILLATOR_TYPES[0];
    oscillator.frequency.value = 440;
    oscillator.start();
  }, [oscillator]);

  const handleOscillatorTypeClick = (e: React.FormEvent<HTMLSelectElement>) => {
    oscillator.type = e.currentTarget.value as OscillatorType;
  }

  const changeFrequency: React.FormEventHandler<HTMLInputElement> = (e) => {
    setFrequency(e.currentTarget.valueAsNumber);
    oscillator.frequency.setValueAtTime(e.currentTarget.valueAsNumber, audioContext.currentTime);
  };

  React.useEffect(() => {
    const frequencyPlug = inPlugs['Frequency'];

    if (frequencyPlug !== undefined && frequencyPlug.audioParameter instanceof Observable) {
      const subscription = frequencyPlug.audioParameter.subscribe(setFrequency);

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
    <input value={frequency} onChange={changeFrequency} type="range" min="0" max="1000" step="1" />
    </div>
  </div>;
}
