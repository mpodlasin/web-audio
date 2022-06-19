import React from 'react';

const OSCILLATOR_TYPES: OscillatorType[] = ["sine", "square", "sawtooth", "triangle"];

export function Oscillator({ audioElement: oscillator, audioContext, }: { audioElement: OscillatorNode, audioContext: AudioContext, }) {
  React.useEffect(() => {
    oscillator.type = OSCILLATOR_TYPES[0];
    oscillator.frequency.value = 440;
    oscillator.start();
  }, [oscillator]);

  const handleOscillatorTypeClick = (e: React.FormEvent<HTMLSelectElement>) => {
    oscillator.type = e.currentTarget.value as OscillatorType;
  }

  const changeFrequency: React.FormEventHandler<HTMLInputElement> = (e) => {
    oscillator.frequency.setValueAtTime(e.currentTarget.valueAsNumber, audioContext.currentTime);
  };

  return <div>
    <select onChange={handleOscillatorTypeClick}>
      {OSCILLATOR_TYPES.map(oscillatorType => (
        <option key={oscillatorType} value={oscillatorType}>
          {oscillatorType}
        </option>
      ))}
    </select>
    <div>
    <input onChange={changeFrequency} type="range" min="0" max="1000" step="1" defaultValue={oscillator.frequency.value} />
    </div>
  </div>;
}
