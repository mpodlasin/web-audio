import './App.css';
import React from 'react';
import { ComponentGraphCanvas, Node, Edge, Position } from './lib/component-graph-canvas';
import { COMPONENTS } from './lib/audio/components';

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
  name: string;
  position: Position;
}

interface AudioComponentNode extends Node {
  audioElement: AudioNode;
}

const audioContext = new AudioContext();

const nodeDescriptionToAudioElementMap = new Map<NodeDescription, AudioNode>();

const nodeDescriptionToAudioNode = (nodeDescription: NodeDescription): AudioComponentNode => {
  const definition = COMPONENTS[nodeDescription.name];
  const audioElement = nodeDescriptionToAudioElementMap.has(nodeDescription) ? 
    nodeDescriptionToAudioElementMap.get(nodeDescription)! : 
    definition.getAudioElement(audioContext);
  const component = React.createElement(definition.component, {audioElement, audioContext});

  return {
    ...nodeDescription,
    component,
    inPlugs: definition.inPlugs,
    outPlugs: definition.outPlugs,
    audioElement,
  };
}

const nodeToNodeDescription = (node: Node): NodeDescription => ({
  name: node.name,
  position: node.position,
});

const initialNodeDescriptions = [
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

    React.useEffect(() => {
      edges.forEach(edge => {
        const inNode = nodes[edge.inNodeIndex];
        const outNode = nodes[edge.outNodeIndex];

        const inAudioElement = inNode.audioElement;
        const outAudioElement = outNode.audioElement;

        inAudioElement.connect(outAudioElement);
      });
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
