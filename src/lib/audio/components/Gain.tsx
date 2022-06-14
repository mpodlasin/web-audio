import React from 'react';

export function Gain({ audioElement: gain, audioContext }: { audioElement: GainNode, audioContext: AudioContext }) {
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
