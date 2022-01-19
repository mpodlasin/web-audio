import './App.css';
import React from 'react';

function App() {
  const [audioContext, setAudioContext] = React.useState<AudioContext>();
  const [osc, setOsc] = React.useState<OscillatorNode>();
  const [gain, setGain] = React.useState<GainNode>();

  React.useEffect(() => {
    if (!audioContext) {
      setAudioContext(new AudioContext());
    }

    if (!osc) {
      setOsc(audioContext?.createOscillator());
    }

    if (!gain) {
      setGain(audioContext?.createGain());
    }
  }, [audioContext, osc]);

  const playOsc = () => {
    if (osc && audioContext && gain) {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, audioContext.currentTime);

      osc
        .connect(gain)
        .connect(audioContext.destination);

      osc.start();
    }
  };

  const changeGain: React.FormEventHandler<HTMLInputElement> = (e) => {
    if (gain) {
      gain.gain.value = parseFloat(e.currentTarget.value);
    }
  }

  return (
    <div>
      <input type="range" min={0} max={1} step={0.01} onInput={changeGain} />
      <button onClick={playOsc}>Play</button>
    </div>
  );
}

export default App;
