import React from "react";
import { Edge, SVGEdge, EdgeMenu } from "./Edge";
import { Node, NodeComponent } from "./Node";
import { Position } from "./Position";

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

export function ComponentGraphCanvas({ globalMenu, nodes, edges, onNodesChange = () => {}, onEdgesChange = () => {} }: ComponentGraphCanvasProps) {
    // -----------------------------------------------------------------------------
    // NODE POSITIONS

    const [isDraggingNode, setIsDraggingNode] = React.useState(false);
    const [nodePositions, setNodePositions] = React.useState(nodes.map(node => node.position));
    const [internalElementPositions, setInternalElementPositions] = React.useState<(null | Position)[]>(nodes.map(() => null));

    const handleDragStart = (i: number): React.MouseEventHandler<HTMLDivElement> => e => {
        setIsDraggingNode(true);

        const internalElementPosition = {
            top: e.clientY - e.currentTarget.getBoundingClientRect().top,
            left: e.clientX - e.currentTarget.getBoundingClientRect().left,
        };

        setInternalElementPositions(internalElementPositions => {
            const internalElementPositionsCopy = [...internalElementPositions];

            internalElementPositionsCopy[i] = internalElementPosition;

            return internalElementPositionsCopy;
        });
    };

    const handleDragStop = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isDraggingNode) {
            e.preventDefault();
            setIsDraggingNode(false);
            setInternalElementPositions(nodes.map(() => null));
    
            onNodesChange(nodes.map((node, i) => ({
                ...node,
                position: nodePositions[i],
            })))  
        }
    }

    const handleDrag: React.MouseEventHandler<HTMLDivElement> = e => {
        if (internalElementPositions.some(internalElementPosition => internalElementPosition !== null)) {
            e.preventDefault();

            const draggedIndex = internalElementPositions.findIndex(internalElementPosition => internalElementPosition !== null);

            setNodePositions(positions => {
                const positionsCopy = [...positions];

                const internalElementPosition = internalElementPositions[draggedIndex] || { top: 0, left: 0 };

                positionsCopy[draggedIndex] = {
                    top: e.clientY - internalElementPosition.top,
                    left: e.clientX - internalElementPosition.left,
                };

                return positionsCopy;
            });
        }
    };

    const handleDeleteNode = (nodeToDelete: Node) => {
        onNodesChange(nodes.filter(node => node !== nodeToDelete));
    };

    // -----------------------------------------------------------------------------------
    // EDGE CONNECTIONS

    const [createdConnection, setCreatedConnection] = React.useState<{
        inNodeIndex: number, 
        inPlugIndex: number,
        inPosition: Position;
        outPosition: Position;
    }>();

    const handleStartConnecting = (nodeIndex: number) => (plugIndex: number, position: Position) => {
        setCreatedConnection({
                inNodeIndex: nodeIndex,
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

    const handleStopConnecting = (nodeIndex: number) => (plugIndex: number) => {

        if (createdConnection) {
            const newConnection = {
                inNodeIndex: createdConnection.inNodeIndex,
                inPlugIndex: createdConnection.inPlugIndex,
                outNodeIndex: nodeIndex,
                outPlugIndex: plugIndex,
            };

            if (!edges.some(edge => edge.inNodeIndex === newConnection.inNodeIndex && edge.outNodeIndex === newConnection.outNodeIndex && edge.inPlugIndex === newConnection.inPlugIndex && edge.outPlugIndex === newConnection.outPlugIndex)) {
                onEdgesChange([...edges, newConnection]);
            }

            setCreatedConnection(undefined);
        }
    };

    // ---------------------------------------------------------------------------------------
    // PLUG POSITIONS

    const [plugPositions, setPlugPositions] = React.useState<Position[][]>(nodes.map(() => []));

    const handlePlugPositions = (nodeIndex: number) => (newPlugPositions: Position[]) => {
        setPlugPositions(plugPositions => {
            const plugPositionsCopy = [...plugPositions];

            plugPositionsCopy[nodeIndex] = newPlugPositions;

            return plugPositionsCopy;
        });
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

    const [globalMenuPosition, setGlobalMenuPosition] = React.useState<Position | null>(null);

    const toggleGlobalMenu = (e: React.MouseEvent<HTMLDivElement>) => {
        if (globalMenuPosition === null) {
            setGlobalMenuPosition({
                top: e.clientY,
                left: e.clientX,
            });            
        } else {
            setGlobalMenuPosition(null);
        }
    }

    return <div onClick={(e) => { closeEdgeMenu(); toggleGlobalMenu(e); }} 
                onMouseUp={(e) => { handleDragStop(e); handleCancelConnecting(); }} 
                onMouseMove={e => { handleDrag(e); handleConnectingDrag(e); }} 
                style={{position: 'relative', border: '1px solid red', height: '100%', boxSizing: 'border-box'}}
            >
        {nodes.map((node, i) => <NodeComponent
            key={i}
            node={node} 
            position={nodePositions[i]} 
            onDelete={handleDeleteNode}
            onDragStart={handleDragStart(i)} 
            onStartConnecting={handleStartConnecting(i)}
            onStopConnecting={handleStopConnecting(i)}
            onPlugPositions={handlePlugPositions(i)}
        />)}
        {globalMenuPosition && 
            <div style={{zIndex: 1, border: '1px solid black', backgroundColor: 'white', position: 'absolute', ...globalMenuPosition}}>
                {globalMenu}
            </div>
        }
        {edgeMenu && <EdgeMenu position={edgeMenu.position} onDeleteEdge={handleDeleteEdge} />
        }
        <svg style={{position: 'absolute', top: 0, left: 0, height: '100%', width: '100%', pointerEvents: 'none'}}>
            {createdConnection && <line 
                x1={plugPositions[createdConnection.inNodeIndex][createdConnection.inPlugIndex].left + nodePositions[createdConnection.inNodeIndex].left} 
                y1={plugPositions[createdConnection.inNodeIndex][createdConnection.inPlugIndex].top + nodePositions[createdConnection.inNodeIndex].top} 
                x2={createdConnection.outPosition.left} y2={createdConnection.outPosition.top} 
                stroke="black" 
            />}
            {edges.map((edge, i) => <SVGEdge key={i} onOpenEdgeMenu={handleOpenEdgeMenu} onCloseEdgeMenu={closeEdgeMenu} edge={edge} plugPositions={plugPositions} positions={nodePositions} />)}
        </svg>
    </div>;
}
