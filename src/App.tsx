import './App.css';
import React from 'react';
import { ComponentGraphCanvas, Node, Edge, Position } from './lib/component-graph-canvas';
import { AudioPlug, COMPONENTS, connectPlugs } from './lib/audio/components';
import { v4 as uuidv4 } from 'uuid';

interface CreationMenuProps {
  onCreate(nodeName: string): void;
}

function CreationMenu({ onCreate }: CreationMenuProps) {
  return (
    <ul>
      {Object.keys(COMPONENTS).map(name => (
        <li key={name}><button onClick={() => onCreate(name)}>{name}</button></li>
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
  inPlugs: AudioPlug[];
  outPlugs: AudioPlug[];
}

const audioContext = new AudioContext();

const nodeIdToAudioElement = new Map<string, AudioNode>(); 
const getAudioElementForNodeDescription = (nodeDescription: NodeDescription) => {
  const definition = COMPONENTS[nodeDescription.name];

  let audioElement: AudioNode;
  if (nodeIdToAudioElement.has(nodeDescription.id)) {
    audioElement = nodeIdToAudioElement.get(nodeDescription.id)!;
  } else {
    audioElement = definition.getAudioElement(audioContext);

    nodeIdToAudioElement.set(nodeDescription.id, audioElement);
  }

  return audioElement;
}

const nodeDescriptionToAudioNode = (
  nodeDescription: NodeDescription, 
  nodeDescriptions: NodeDescription[], 
  edges: Edge[]
): AudioComponentNode => {
  const audioElement = getAudioElementForNodeDescription(nodeDescription);

  const definition = COMPONENTS[nodeDescription.name];

  const inPlugs = definition.inPlugs.reduce((inPlugs, inPlug, i) => {
    const edgeComingToPlug = edges.find(
      e => e.outNodeId === nodeDescription.id && e.outPlugIndex === i
    );

    if (edgeComingToPlug === undefined) return inPlugs;

    const incomingNodeDescription = nodeDescriptions.find(n => n.id === edgeComingToPlug.inNodeId);

    if (incomingNodeDescription === undefined) return inPlugs;

    const incomingAudioElement = getAudioElementForNodeDescription(incomingNodeDescription);

    const incomingNodeDefinition = COMPONENTS[incomingNodeDescription.name];

    const incomingNodePlug = incomingNodeDefinition.outPlugs[edgeComingToPlug.inPlugIndex - incomingNodeDefinition.inPlugs.length];

    return {
      ...inPlugs,
      [inPlug.name]: { 
        ...inPlug,
        audioParameter: incomingNodePlug.getAudioParameter(incomingAudioElement)
      },
    };
  }, {} as {[name: string]: AudioPlug});

  const component = React.createElement(definition.component, {
    audioElement, 
    audioContext, 
    inPlugs,
  });

  const audioComponentNode = {
    ...nodeDescription,
    component,
    inPlugs: definition.inPlugs.map(plug => ({
      ...plug,
      audioParameter: plug.getAudioParameter(audioElement),
    })),
    outPlugs: definition.outPlugs.map(plug => ({
      ...plug,
      audioParameter: plug.getAudioParameter(audioElement),
    })),
    audioElement,
  };

  return audioComponentNode;
}

const nodeDescriptionsToAudioNodes = (nodeDescriptions: NodeDescription[], edges: Edge[]): AudioComponentNode[] => {
  return nodeDescriptions.map(nodeDescription => nodeDescriptionToAudioNode(nodeDescription, nodeDescriptions, edges))
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
      nodeDescriptionsToAudioNodes(JSON.parse(localStorage.getItem('NODES')!), edges) : 
      []
    );

    React.useEffect(() => {
      localStorage.setItem("NODES", JSON.stringify(nodes.map(nodeToNodeDescription)));
    }, [nodes]);

    React.useEffect(() => {
      const disconnectFunctions = edges.flatMap(edge => {
        const inNode = nodes.find(node => node.id === edge.inNodeId);
        const outNode = nodes.find(node => node.id === edge.outNodeId);

        if (inNode === undefined || outNode === undefined) return [];

        const inPlug = inNode.outPlugs[edge.inPlugIndex - inNode.inPlugs.length];
        const outPlug = outNode.inPlugs[edge.outPlugIndex];

        try {
          return [connectPlugs(inPlug, outPlug)];
        } catch {
          setEdges(edges => edges.filter(e => e !== edge));
          return [];
        }
      });

      return () => {
        disconnectFunctions.forEach(disconnect => disconnect());
      };
    }, [nodes, edges]);

    const handleNodesChange = (newNodes: Node[]) => {
      setNodes(nodeDescriptionsToAudioNodes(newNodes, edges))
    }

    const handleCreateNode = (nodeName: string) => {
      setNodes(nodes => [...nodes, nodeDescriptionToAudioNode({
        id: uuidv4(),
        name: nodeName,
        position: {top: 100, left: 100},
      }, nodes, edges)])
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
