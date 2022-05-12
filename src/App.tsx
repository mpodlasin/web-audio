import './App.css';
import React from 'react';
import { useAudioContext } from './lib/audio/hooks';
import { ComponentGraphCanvas, Node, Edge, EdgeEnd } from './lib/component-graph-canvas';

interface OscillatorProps {
  oscillator: OscillatorNode;
  audioContext: AudioContext;
  top: number;
  left: number;

  onOutChosen(): void;
}

function Oscillator({ oscillator, audioContext, top, left, onOutChosen }: OscillatorProps) {
  React.useEffect(() => {
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
  }, [audioContext.currentTime, oscillator]);

  return <div  onClick={e => e.stopPropagation()} style={{border: '1px solid gray', position: 'absolute', top, left, padding: 20,}}>
    <div>{oscillator.type}</div>
    <div onMouseDown={onOutChosen} style={{border: '1px solid gray'}}>Out</div>
  </div>;
}

interface GainProps {
  gain: GainNode;
  top: number;
  left: number;
  onInChosen(): void;
  onOutChosen(): void;
}

function Gain({ gain, top, left, onInChosen }: GainProps) {

  React.useEffect(() => {
    gain.gain.value = 0;
  }, [gain]);

  const changeGain: React.FormEventHandler<HTMLInputElement> = (e) => {
    gain.gain.value = e.currentTarget.valueAsNumber;
  }

  return <div onClick={e => e.stopPropagation()} style={{border: '1px solid gray', position: 'absolute', top, left, padding: 20,}}>
    <div onMouseUp={onInChosen} style={{border: '1px solid gray'}}>In</div>
    <input type="range" min={0} max={1} step={0.01} defaultValue={0} onInput={changeGain} />
    <div style={{border: '1px solid gray'}}>Out</div>
    </div>;
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

  const [oscillators, setOscillators] = React.useState<{ oscillator: OscillatorNode, position: { left: number, top: number}}[]>([]);
  const [gains, setGains] = React.useState<{ gain: GainNode, position: { left: number, top: number}}[]>([]);

  const audioContext = useAudioContext();

  const handleCreate = (nodeType: NodeType) => {
    switch (nodeType) {
      case 'oscillator':
        setOscillators([
          ...oscillators,
          {
            oscillator: audioContext.createOscillator(),
            position: creationMenuPosition,
          }
        ]);
        setShowCreationMenu(false);
        return;
      case 'gain':
        setGains([
          ...gains,
          {
            gain: audioContext.createGain(),
            position: creationMenuPosition,
          }
        ]);
        setShowCreationMenu(false);
        return;
      case 'output':
    }
  };

  const [createdConnection, setCreatedConnection] = React.useState<{inType: NodeType, inIndex: number}>();

  const [connections, setConnections] = React.useState<{inType: NodeType, inIndex: number, outType: NodeType, outIndex: number}[]>([]);

  const handleOscillatorOut = (i: number) => () => {
    setCreatedConnection({
      inType: 'oscillator',
      inIndex: i,
    });
  }

  const handleGainIn = (i: number) => () => {

    if (createdConnection) {
      setConnections([
        ...connections,
        {
          ...createdConnection,
          outIndex: i,
          outType: 'gain',
        }
      ]);
    }
  }

  const [mousePositon, setMousePosition] = React.useState<{top: number, left: number}>();

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (createdConnection) {
      setMousePosition({top: e.clientY, left: e.clientX});
    }
  }

  const handleMouseUp = () => {
    if (createdConnection) {
      setCreatedConnection(undefined);
    }
  }

  return (
    <div ref={ref} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove} onClick={handleClick} style={{border: '1px solid red', position: 'relative', height: '100%', boxSizing: 'border-box'}}>
      {showCreationMenu && <CreationMenu onCreate={handleCreate} {...creationMenuPosition} />}
      {oscillators.map((oscillator, i) => <Oscillator key={i} {...oscillator.position} oscillator={oscillator.oscillator} audioContext={audioContext} onOutChosen={handleOscillatorOut(i)} />)}
      {gains.map((gain, i) => <Gain key={i} {...gain.position} gain={gain.gain} onInChosen={handleGainIn(i)} onOutChosen={() => {}} />)}
      {createdConnection && <Connection inTop={oscillators[createdConnection.inIndex].position.top} inLeft={oscillators[createdConnection.inIndex].position.left} outTop={mousePositon?.top ?? 0} outLeft={mousePositon?.left ?? 0} />}
      {connections.map(connection => <Connection inTop={oscillators[connection.inIndex].position.top} inLeft={oscillators[connection.inIndex].position.left} outTop={gains[connection.outIndex].position.top} outLeft={gains[connection.outIndex].position.left} />)}
    </div>
  );
}

interface ConnectionProps {
  inTop: number;
  inLeft: number;
  outTop: number;
  outLeft: number;
}

function Connection({inTop, inLeft, outTop, outLeft,}: ConnectionProps) {
  return <svg style={{pointerEvents: 'none', position: 'absolute', top: inTop, left: inLeft, height: outTop - inTop, width: outLeft - inLeft}} width="100" height="100" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <line x1="0" y1="0" x2={outLeft - inLeft} y2={outTop - inTop} stroke="black" />
  </svg>
}

const COMPONENTS = {
  'Oscillator': {
      component: <div>Type: saw</div>,
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
  'Gain': {
    name: 'Gain',
    component: <input type="range" />,
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
