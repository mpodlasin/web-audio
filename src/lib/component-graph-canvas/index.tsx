import React from "react";
import { Edge, SVGEdge, EdgeMenu, CreatedSVGEdge } from "./Edge";
import { Node, NodeComponent } from "./Node";
import { Position } from "./Position";

import css from './index.module.css';

export { type Edge } from './Edge';
export { type Node, type Plug } from './Node';
export { type Position } from './Position';

export interface ComponentGraphCanvasProps {
    globalMenu: React.ReactNode;
    nodes: Node[];
    edges: Edge[];
    onNodesChange?(newNodes: Node[]): void;
    onEdgesChange?(newEdges: Edge[]): void;
}

const calculateNewNodePosition = (node: Node, draggedNode: {startMousePosition: Position, endMousePosition: Position, nodeId: string}) => ({
    top: node.position.top + draggedNode.endMousePosition.top - draggedNode.startMousePosition.top,
    left: node.position.left + draggedNode.endMousePosition.left - draggedNode.startMousePosition.left,
});

export function ComponentGraphCanvas({ globalMenu, nodes, edges, onNodesChange = () => {}, onEdgesChange = () => {} }: ComponentGraphCanvasProps) {
    // -----------------------------------------------------------------------------
    // NODE POSITIONS

    const [draggedNode, setDraggedNode] = React.useState<{startMousePosition: Position, endMousePosition: Position, nodeId: string} | null>(null);

    const handleDragStart = (nodeId: string): React.MouseEventHandler<HTMLDivElement> => e => {
        setDraggedNode({
            nodeId,
            startMousePosition: {
                top: e.clientY,
                left: e.clientX,
            },
            endMousePosition: {
                top: e.clientY,
                left: e.clientX
            }
        });
    };

    const handleDragStop = (e: React.MouseEvent<HTMLDivElement>) => {
        if (draggedNode !== null) {
            e.preventDefault();
    
            onNodesChange(nodes.map(node => {
                if (node.id !== draggedNode.nodeId) {
                    return node;
                }

                return {
                    ...node,
                    position: calculateNewNodePosition(node, draggedNode),
                }
            }));

            setDraggedNode(null);
        }
    };

    const handleDrag: React.MouseEventHandler<HTMLDivElement> = e => {
        if (draggedNode !== null) {
            e.preventDefault();

            setDraggedNode(draggedNode => ({
                ...draggedNode!,
                endMousePosition: {
                    top: e.clientY,
                    left: e.clientX
                }
            }));
        }
    };

    const handleDeleteNode = (nodeToDelete: Node) => {
        onNodesChange(nodes.filter(node => node !== nodeToDelete));
    };

    // -----------------------------------------------------------------------------------
    // EDGE CONNECTIONS

    const [createdConnection, setCreatedConnection] = React.useState<{
        inNodeId: string, 
        inPlugIndex: number,
        inPosition: Position;
        outPosition: Position;
    }>();

    const handleStartConnecting = (nodeId: string) => (plugIndex: number, position: Position) => {
        setCreatedConnection({
                inNodeId: nodeId,
                inPlugIndex: plugIndex,
                inPosition: position,
                outPosition: position,
            });
    };

    const handleConnectingDrag: React.MouseEventHandler<HTMLDivElement> = e => {
        if (createdConnection) {
            setCreatedConnection({
                ...createdConnection,
                outPosition: {
                    top: e.clientY,
                    left: e.clientX,
                }
            })
        }
    };

    const handleCancelConnecting = () => {
        setCreatedConnection(undefined);
    };

    const handleStopConnecting = (nodeId: string) => (plugIndex: number) => {
        if (createdConnection) {
            const newConnection = {
                inNodeId: createdConnection.inNodeId,
                inPlugIndex: createdConnection.inPlugIndex,
                outNodeId: nodeId,
                outPlugIndex: plugIndex,
            };

            if (!edges.some(edge => edge.inNodeId === newConnection.inNodeId && edge.outNodeId === newConnection.outNodeId && edge.inPlugIndex === newConnection.inPlugIndex && edge.outPlugIndex === newConnection.outPlugIndex)) {
                onEdgesChange([...edges, newConnection]);
            }

            setCreatedConnection(undefined);
        }
    };

    // ---------------------------------------------------------------------------------------
    // PLUG POSITIONS

    const [plugPositions, setPlugPositions] = React.useState<{[nodeId: string]: Position[]}>(
        nodes.reduce((positions, node) => ({ ...positions, [node.id]: []}), {})
    );

    const handlePlugPositions = (nodeId: string) => (newPlugPositions: Position[]) => {
        setPlugPositions(plugPositions => ({
            ...plugPositions,
            [nodeId]: newPlugPositions
        }));
    };

    // --------------------------------------------------------------------------------------
    // EDGE MENU

    const [edgeMenu, setEdgeMenu] = React.useState<{position: Position, edge: Edge} | null>(null);

    const handleOpenEdgeMenu = (edge: Edge, position: Position) => {
        setEdgeMenu({edge, position});
    };

    const closeEdgeMenu = () => {
        setEdgeMenu(null);
    }

    const handleDeleteEdge = () => {
        if (edgeMenu !== null) {
            onEdgesChange(edges.filter(edge => edge !== edgeMenu.edge));
            closeEdgeMenu();
        }
    }

    // -------------------------------------------------------------------------------
    // GLOBAL MENU 

    const containerRef = React.useRef<HTMLDivElement>(null);

    const [globalMenuPosition, setGlobalMenuPosition] = React.useState<Position | null>(null);

    const toggleGlobalMenu = (e: React.MouseEvent<HTMLDivElement>) => {
        if(containerRef.current && e.target !== containerRef.current) {
            return;
        }

        if (edgeMenu === null && globalMenuPosition === null) {
            setGlobalMenuPosition({
                top: e.clientY,
                left: e.clientX,
            });            
        } else {
            setGlobalMenuPosition(null);
        }
    }

    const nodePositions = nodes.reduce((positions, node) => ({
        ...positions,
        [node.id]: draggedNode && draggedNode.nodeId === node.id ? calculateNewNodePosition(node, draggedNode) : node.position
    }), {} as { [nodeId: string ]: Position});

    return <div onClick={() => { closeEdgeMenu(); }} 
                onMouseUp={(e) => { handleDragStop(e); toggleGlobalMenu(e); handleCancelConnecting(); }} 
                onMouseMove={e => { handleDrag(e); handleConnectingDrag(e); }} 
                style={{position: 'relative', border: '1px solid red', height: '100%', boxSizing: 'border-box'}}
                ref={containerRef}
            >
        {nodes.map(node => <NodeComponent
            key={node.id}
            node={node} 
            position={nodePositions[node.id]}
            onDelete={handleDeleteNode}
            onDragStart={handleDragStart(node.id)} 
            onStartConnecting={handleStartConnecting(node.id)}
            onStopConnecting={handleStopConnecting(node.id)}
            onPlugPositions={handlePlugPositions(node.id)}
        />)}
        {globalMenuPosition && 
            <div className={css.globalMenu} style={{...globalMenuPosition}}>
                {globalMenu}
            </div>
        }
        {edgeMenu && <EdgeMenu position={edgeMenu.position} onDeleteEdge={handleDeleteEdge} />
        }
        <svg style={{position: 'absolute', top: 0, left: 0, height: '100%', width: '100%', pointerEvents: 'none'}}>
            {createdConnection && <CreatedSVGEdge nodePositions={nodePositions} plugPositions={plugPositions} createdConnection={createdConnection} />}
            {edges.map((edge, i) => <SVGEdge key={i} onOpenEdgeMenu={handleOpenEdgeMenu} onCloseEdgeMenu={closeEdgeMenu} edge={edge} plugPositions={plugPositions} nodePositions={nodePositions} />)}
        </svg>
    </div>;
}
