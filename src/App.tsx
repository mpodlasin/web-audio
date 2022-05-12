import './App.css';
import React from 'react';
import { AudioContextContext, useGain, useOscillator } from './lib/audio/hooks';
import { ComponentGraphCanvas, Node, Edge } from './lib/component-graph-canvas';

function Oscillator() {
  const audioContext = React.useContext(AudioContextContext);
  const oscillator = useOscillator(audioContext);
  React.useEffect(() => {
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
  }, [audioContext.currentTime, oscillator]);

  return <div>
    <div>{oscillator.type}</div>
  </div>;
}

function Gain() {
  const audioContext = React.useContext(AudioContextContext);
  const gain = useGain(audioContext);

  React.useEffect(() => {
    gain.gain.value = 0;
  }, [gain]);

  const changeGain: React.FormEventHandler<HTMLInputElement> = (e) => {
    gain.gain.value = e.currentTarget.valueAsNumber;
  }

  return <div>
    <input type="range" min={0} max={1} step={0.01} defaultValue={0} onInput={changeGain} />
    </div>;
}

function Output() {
  const audioContext = React.useContext(AudioContextContext);
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

interface CreationMenuProps {
  top: number;
  left: number;
  onCreate(nodeName: string): void;
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

const COMPONENTS = {
  'Oscillator': {
      component: <Oscillator />,
      inPlugs: [],
      outPlugs: [
        {
          type: 'audio',
          name: 'Output'
        }
      ],
  },
  'Gain': {
    component: <Gain />,
    inPlugs: [
      {
        type: 'audio',
        name: 'Input'
      }
    ],
    outPlugs: [
      {
        type: 'audio',
        name: 'Output'
      }
    ],
  },
  'Output': {
    component: <Output />,
    inPlugs: [
      {
        type: 'audio',
        name: 'Input'
      }
    ],
    outPlugs: [],
  }
};

function App() {
    const [edges, setEdges] = React.useState<Edge[]>(localStorage.getItem("EDGES") ? JSON.parse(localStorage.getItem('EDGES')!) : []);

    React.useEffect(() => {
      localStorage.setItem("EDGES", JSON.stringify(edges));
    }, [edges]);
    
    const [nodes, setNodes] = React.useState<Node[]>(localStorage.getItem("NODES") ? JSON.parse(localStorage.getItem('NODES')!) : [
      {
        name: 'Oscillator',
        position: {
          top: 200, 
          left: 400,
        },
      },
      {
        name: 'Gain',
        position: {
          top: 300,
          left: 800,
        }
      },
      {
        name: 'Output',
        position: {
          top: 400,
          left: 600,
        }
      }
    ]);

    React.useEffect(() => {
      localStorage.setItem("NODES", JSON.stringify(nodes));
    }, [nodes]);
  
    return (
      <div style={{height: '100%'}}>
        <ComponentGraphCanvas
          componentDefinitions={COMPONENTS}
          nodes={nodes}
          onNodesChange={setNodes}
          edges={edges}
          onEdgesChange={setEdges}
        />
      </div>
    );
}

export default App;
