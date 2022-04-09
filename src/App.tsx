import './App.css';
import React from 'react';
import { useAudioContext, useOscillator, useGain, useConnect } from './lib/audio/hooks';

interface OscillatorProps {
  oscillator: OscillatorNode;
  audioContext: AudioContext;
}

function Oscillator({ oscillator, audioContext }: OscillatorProps) {
  React.useEffect(() => {
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
  }, [audioContext.currentTime, oscillator]);

  return <div>Osc</div>;
}

interface GainProps {
  gain: GainNode;
}

function Gain({ gain }: GainProps) {

  React.useEffect(() => {
    gain.gain.value = 0;
  }, [gain]);

  const changeGain: React.FormEventHandler<HTMLInputElement> = (e) => {
    gain.gain.value = e.currentTarget.valueAsNumber;
  }

  return <input type="range" min={0} max={1} step={0.01} defaultValue={0} onInput={changeGain} />;
}

interface OutputProps {
  audioContext: AudioContext;
}

function Output({ audioContext }: OutputProps) {
  const [audioContextState, setAudioContextState] = React.useState(audioContext.state);

  const togglePlay = () => {
    if (audioContextState === 'running') {
      audioContext.suspend();
    } else if (audioContextState === 'suspended') {
      audioContext.resume();
    }
  };
  
  React.useEffect(() => {
    const callback = () => {
      setAudioContextState(audioContext.state);
    };

    audioContext.addEventListener('statechange', callback);

    return () => {
      audioContext.removeEventListener('statechange', callback);
    }
  }, [audioContext]);

  return <div>
    <div>Current state: {audioContextState}</div>
      <button onClick={togglePlay}>
      {audioContextState === 'running' ? 'Stop' : 'Play'}
    </button>
    </div>
}

function AudioGraph() {
  const audioContext = useAudioContext();
  const osc = useOscillator(audioContext);
  const gain = useGain(audioContext);

  useConnect(osc, gain);
  useConnect(gain, audioContext.destination);

  return (
    <div>
      <Oscillator oscillator={osc} audioContext={audioContext} />
      <Gain gain={gain} />
      <Output audioContext={audioContext} />
    </div>
  );
};

type NodeType = 'oscillator' | 'gain' | 'output';

interface CreationMenuProps {
  top: number;
  left: number;
  onCreate(nodeType: NodeType): void;
}

function CreationMenu({ top, left, onCreate }: CreationMenuProps) {
  const handleClick: React.MouseEventHandler<HTMLDivElement> = e => {
    e.stopPropagation();
  };

  return <div onClick={handleClick} style={{border: '1px solid gray', position: 'absolute', top, left}}>
    <ul>
      <li><button onClick={() => onCreate('oscillator')}>Oscilator</button></li>
      <li><button onClick={() => onCreate('gain')}>Gain</button></li>
      <li><button onClick={() => onCreate('output')}>Output</button></li>
    </ul>
  </div>
}

function AudioCanvas() {
  const ref = React.useRef<HTMLDivElement>(null);

  const handleClick: React.MouseEventHandler<HTMLDivElement> = e => {
    if (ref.current) {
      if (showCreationMenu) {
        setShowCreationMenu(false);
      } else {
        setShowCreationMenu(true);
      }

      const top = e.clientY - ref.current.getBoundingClientRect().top;
      const left = e.clientX - ref.current.getBoundingClientRect().left;

      setCreationMenuPosition({top, left});
    }
  };

  const [showCreationMenu, setShowCreationMenu] = React.useState(false);
  const [creationMenuPosition, setCreationMenuPosition] = React.useState({top: 0, left: 0});

  const [oscillators, setOscillators] = React.useState<OscillatorNode[]>([]);

  const audioContext = useAudioContext();

  const handleCreate = (nodeType: NodeType) => {
    switch (nodeType) {
      case 'oscillator':
        setOscillators([
          ...oscillators,
          audioContext.createOscillator(),
        ])
        return;
      case 'gain':
      case 'output':
    }
  };

  return (
    <div ref={ref} onClick={handleClick} style={{border: '1px solid red', position: 'relative', height: '100%'}}>
      {showCreationMenu && <CreationMenu onCreate={handleCreate} {...creationMenuPosition} />}
      {oscillators.map((oscillator, i) => <Oscillator key={i} oscillator={oscillator} audioContext={audioContext} />)}
    </div>
  );
}

function App() {
    return (
      <div style={{height: '100%'}}>
        <AudioCanvas />
      </div>
    );
}

export default App;
