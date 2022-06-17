import './App.css';
import React from 'react';
import { ComponentGraphCanvas, Node, Edge, Position } from './lib/component-graph-canvas';
import { COMPONENTS, PLUGS } from './lib/audio/components';
import { v4 as uuidv4 } from 'uuid';

interface CreationMenuProps {
  onCreate(nodeName: string): void;
}

function CreationMenu({ onCreate }: CreationMenuProps) {
  return (
    <ul>
      {Object.keys(COMPONENTS).map(name => (
        <li><button onClick={() => onCreate(name)}>{name}</button></li>
      ))}
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

const nodeIdToAudioElement = new Map<string, AudioNode>(); 

const nodeDescriptionToAudioNode = (nodeDescription: NodeDescription): AudioComponentNode => {
  const definition = COMPONENTS[nodeDescription.name];

  let audioElement: AudioNode;
  if (nodeIdToAudioElement.has(nodeDescription.id)) {
    audioElement = nodeIdToAudioElement.get(nodeDescription.id)!;
  } else {
    audioElement = definition.getAudioElement(audioContext);

    nodeIdToAudioElement.set(nodeDescription.id, audioElement);
  }

  const component = React.createElement(definition.component, {audioElement, audioContext});

  const audioComponentNode = {
    ...nodeDescription,
    component,
    inPlugs: definition.inPlugs,
    outPlugs: definition.outPlugs,
    audioElement,
  };

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
      const disconnectFunctions = edges.map(edge => {
        const inNode = nodes.find(node => node.id === edge.inNodeId);
        const outNode = nodes.find(node => node.id === edge.outNodeId);

        if (inNode === undefined || outNode === undefined) return;

        const inPlug = inNode.outPlugs[edge.inPlugIndex - inNode.inPlugs.length];
        const outPlug = outNode.inPlugs[edge.outPlugIndex];

        const plugDefinition = PLUGS[inPlug.type]?.possibleInputs[outPlug.type];

        if (plugDefinition === undefined) return;

        return PLUGS[inPlug.type].possibleInputs[outPlug.type].connect(
          inNode,
          outNode,
        );
      });

      return () => {
        disconnectFunctions.forEach(disconnect => {
          if (disconnect !== undefined) {
            disconnect();
          }
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
