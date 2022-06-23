import './App.css';
import React from 'react';
import { ComponentGraphCanvas, Node, Edge } from './lib/component-graph-canvas';
import { connectPlugs } from './lib/audio/AudioPlug';
import { v4 as uuidv4 } from 'uuid';
import { AudioComponentNode, nodeDescriptionsToAudioNodes, nodeDescriptionToAudioNode, nodeToNodeDescription } from './lib/audio/AudioComponentNode';
import { CreationMenu } from './components/CreationMenu';

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
      nodeDescriptionsToAudioNodes(JSON.parse(localStorage.getItem('NODES')!), edges, true) : 
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
