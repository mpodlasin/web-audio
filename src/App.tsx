import './App.css';
import React from 'react';
import { ComponentGraphCanvas, Node, Edge } from './lib/component-graph-canvas';
import { connectPlugs } from './lib/audio/AudioPlug';
import { v4 as uuidv4 } from 'uuid';
import { addComponentsToAudioComponentNodes, NodeDescription, nodeDescriptionsToAudioNodes, nodeToNodeDescription } from './lib/audio/AudioComponentNode';
import { CreationMenu } from './components/CreationMenu';
import { COMPONENTS } from './lib/audio/components';

function App() {
    const [edges, setEdges] = React.useState<Edge[]>(
      localStorage.getItem("EDGES") ? 
      JSON.parse(localStorage.getItem('EDGES')!) : 
      []
    );

    React.useEffect(() => {
      localStorage.setItem("EDGES", JSON.stringify(edges));
    }, [edges]);

    const [nodeDescriptions, setNodeDescriptions] = React.useState<NodeDescription[]>(
      localStorage.getItem("NODES") ? JSON.parse(localStorage.getItem('NODES')!) : []
    );

    React.useEffect(() => {
      localStorage.setItem("NODES", JSON.stringify(nodeDescriptions));
    }, [nodeDescriptions]);

    const nodes = React.useMemo(() => nodeDescriptionsToAudioNodes(nodeDescriptions), [nodeDescriptions]);

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

    const [nodeStates, setNodeStates] = React.useState<{[nodeId: string]: unknown}>(
      localStorage.getItem("NODE_STATES") ? 
      JSON.parse(localStorage.getItem('NODE_STATES')!) : 
      nodeDescriptions.reduce((states, nodeDescription) => ({...states, [nodeDescription.id]: COMPONENTS[nodeDescription.name].initialSerializableState}), {})
    );

    React.useEffect(() => {
      localStorage.setItem("NODE_STATES", JSON.stringify(nodeStates));
    }, [nodeStates]);

    const nodesWithComponents = addComponentsToAudioComponentNodes(
      nodes, 
      edges,
      nodeStates,
      setNodeStates,
    );

    const handleNodesChange = (newNodes: Node[]) => {
      setNodeDescriptions(newNodes.map(nodeToNodeDescription))
    };

    const handleCreateNode = (nodeName: string) => {
      setNodeDescriptions(nodeDescriptions => [...nodeDescriptions, {
        id: uuidv4(),
        name: nodeName,
        position: {top: 100, left: 100},
      }]);
    }
  
    return (
      <div style={{height: '100%'}}>
        <ComponentGraphCanvas
          globalMenu={<CreationMenu onCreate={handleCreateNode} />}
          nodes={nodesWithComponents}
          onNodesChange={handleNodesChange}
          edges={edges}
          onEdgesChange={setEdges}
        />
      </div>
    );
}

export default App;
