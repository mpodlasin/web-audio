import React from 'react';

export function Oscillator({ audioElement: oscillator, audioContext, }: { audioElement: OscillatorNode, audioContext: AudioContext, }) {
  React.useEffect(() => {
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
  }, [audioContext.currentTime, oscillator]);

  return <div>
    <div>{oscillator.type}</div>
  </div>;
}
