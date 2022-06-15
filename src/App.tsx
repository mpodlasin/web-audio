import './App.css';
import React from 'react';
import { ComponentGraphCanvas, Node, Edge, Position } from './lib/component-graph-canvas';
import { COMPONENTS } from './lib/audio/components';
import { v4 as uuidv4 } from 'uuid';

interface CreationMenuProps {
  onCreate(nodeName: string): void;
}

function CreationMenu({ onCreate }: CreationMenuProps) {
  return (
    <ul>
      <li><button onClick={() => onCreate('Oscillator')}>Oscilator</button></li>
      <li><button onClick={() => onCreate('Gain')}>Gain</button></li>
      <li><button onClick={() => onCreate('Output')}>Output</button></li>
    </ul>
  );
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
        []
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

      return () => {
        edges.forEach(edge => {
          const inNode = nodes[edge.inNodeIndex];
          const outNode = nodes[edge.outNodeIndex];

          const inAudioElement = inNode.audioElement;
          const outAudioElement = outNode.audioElement;

          inAudioElement.disconnect(outAudioElement);
        });
      };
    }, [nodes, edges]);

    const handleNodesChange = (newNodes: Node[]) => {
      setNodes(newNodes.map(nodeDescriptionToAudioNode))
    }

    const handleCreateNode = (nodeName: string) => {
      setNodes(nodes => [...nodes, nodeDescriptionToAudioNode({
        id: uuidv4(),
        name: nodeName,
        position: {top: 100, left: 100},
      })])
    }
  
    return (
      <div style={{height: '100%'}}>
        <ComponentGraphCanvas
          globalMenu={<CreationMenu onCreate={handleCreateNode} />}
          nodes={nodes}
          onNodesChange={handleNodesChange}
          edges={edges}
          onEdgesChange={setEdges}
        />
      </div>
    );
}

export default App;
