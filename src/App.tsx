import './App.css';
import React from 'react';
import { ComponentGraphCanvas, Node, Edge, Position } from './lib/component-graph-canvas';
import { COMPONENTS } from './lib/audio/components';
import { v4 as uuidv4 } from 'uuid';

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

interface NodeDescription {
  id: string;
  name: string;
  position: Position;
}

interface AudioComponentNode extends Node {
  audioElement: AudioNode;
}

const audioContext = new AudioContext();

const nodeIdToAudioComponentNode = new Map<string, AudioComponentNode>();

const nodeDescriptionToAudioNode = (nodeDescription: NodeDescription): AudioComponentNode => {
  if (nodeIdToAudioComponentNode.has(nodeDescription.id)) {
    return nodeIdToAudioComponentNode.get(nodeDescription.id)!;
  }

  const definition = COMPONENTS[nodeDescription.name];
  const audioElement = definition.getAudioElement(audioContext);
  const component = React.createElement(definition.component, {audioElement, audioContext});

  const audioComponentNode = {
    ...nodeDescription,
    component,
    inPlugs: definition.inPlugs,
    outPlugs: definition.outPlugs,
    audioElement,
  };

  nodeIdToAudioComponentNode.set(audioComponentNode.id, audioComponentNode);

  return audioComponentNode;
}

const nodeToNodeDescription = (node: Node): NodeDescription => ({
  id: node.id,
  name: node.name,
  position: node.position,
});

const initialNodeDescriptions = [
  {
    id: uuidv4(),
    name: 'Oscillator',
    position: {
      top: 200, 
      left: 400,
    },
  },
  {
    id: uuidv4(),
    name: 'Gain',
    position: {
      top: 300,
      left: 800,
    }
  },
  {
    id: uuidv4(),
    name: 'Output',
    position: {
      top: 400,
      left: 600,
    }
  }
];

function App() {
    const [edges, setEdges] = React.useState<Edge[]>(
      localStorage.getItem("EDGES") ? 
      JSON.parse(localStorage.getItem('EDGES')!) : 
      []
    );

    React.useEffect(() => {
      localStorage.setItem("EDGES", JSON.stringify(edges));
    }, [edges]);

    const [nodes, setNodes] = React.useState<AudioComponentNode[]>(
      localStorage.getItem("NODES") ? 
        JSON.parse(localStorage.getItem('NODES')!).map(nodeDescriptionToAudioNode) : 
        initialNodeDescriptions.map(nodeDescriptionToAudioNode)
    );

    React.useEffect(() => {
      localStorage.setItem("NODES", JSON.stringify(nodes.map(nodeToNodeDescription)));
    }, [nodes]);

    // React.useEffect(() => {
    //   const oscillator = new OscillatorNode(audioContext);
    //   const gain = new GainNode(audioContext);

    //   oscillator.connect(gain);
    //   gain.connect(audioContext.destination);

    // });

    React.useEffect(() => {
      console.log(
        [...nodeIdToAudioComponentNode.entries()],
      );
    });

    React.useEffect(() => {
      edges.forEach(edge => {
        const inNode = nodes[edge.inNodeIndex];
        const outNode = nodes[edge.outNodeIndex];

        const inAudioElement = inNode.audioElement;
        const outAudioElement = outNode.audioElement;

        inAudioElement.connect(outAudioElement);

        console.log('CONNECTING');
        console.log(inAudioElement);
        console.log(outAudioElement);
        console.log('---------------------');
      });

      return () => {
        edges.forEach(edge => {
          const inNode = nodes[edge.inNodeIndex];
          const outNode = nodes[edge.outNodeIndex];

          const inAudioElement = inNode.audioElement;
          const outAudioElement = outNode.audioElement;

          inAudioElement.disconnect(outAudioElement);


        console.log('DISCONNECTING');
        console.log(inAudioElement);
        console.log(outAudioElement);
        console.log('---------------------');
        });
      };
    }, [nodes, edges]);

    const handleNodesChange = (newNodes: Node[]) => {
      setNodes(newNodes.map(nodeDescriptionToAudioNode))
    }
  
    return (
      <div style={{height: '100%'}}>
        <ComponentGraphCanvas
          nodes={nodes}
          onNodesChange={handleNodesChange}
          edges={edges}
          onEdgesChange={setEdges}
        />
      </div>
    );
}

export default App;
