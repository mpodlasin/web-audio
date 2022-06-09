import React from 'react';

export function Oscillator({ audioElement: oscillator, audioContext, }: { audioElement: OscillatorNode, audioContext: AudioContext, }) {
  React.useEffect(() => {
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
    oscillator.start();
  }, [audioContext.currentTime, oscillator]);

    
  const changeFrequency: React.FormEventHandler<HTMLInputElement> = (e) => {
    oscillator.frequency.setValueAtTime(e.currentTarget.valueAsNumber, audioContext.currentTime);
  };

  return <div>
    <input type="range" min={0} max={2000} step={1} defaultValue={0} onInput={changeFrequency} />
    <div>{oscillator.type}</div>
  </div>;
}
