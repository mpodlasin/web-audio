import React from "react";
import { Edge, SVGEdge, EdgeMenu, CreatedSVGEdge } from "./Edge";
import { Node, NodeComponent } from "./Node";
import { Position } from "./Position";

import css from './index.module.css';
import { PlugPositions } from "./PlugPositions";

export { type Edge } from './Edge';
export { type Node, type Plug } from './Node';
export { type Position } from './Position';

export interface GlobalMenuProps {
    onClose(): void;
    position: Position;
}

export interface ComponentGraphCanvasProps {
    globalMenu: (props: GlobalMenuProps) => React.ReactNode;
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
    // BACKGROUND POSITION 

    const [backgroundPosition, setBackgroundPosition] = React.useState<Position>({
        top: 0,
        left: 0,
    });
    const [draggedBackgroundMousePosition, setDraggedBackgroundMousePosiiton] = React.useState<{startMousePosition: Position, endMousePosition: Position} | null>(null);

    const displayedBackgroundPosition = draggedBackgroundMousePosition === null ? backgroundPosition : {
        top: backgroundPosition.top - (draggedBackgroundMousePosition.startMousePosition.top - draggedBackgroundMousePosition.endMousePosition.top),
        left: backgroundPosition.left - (draggedBackgroundMousePosition.startMousePosition.left - draggedBackgroundMousePosition.endMousePosition.left),
    };

    const startBackgroundPositionDrag = (e: React.MouseEvent<HTMLDivElement>) => {
        setDraggedBackgroundMousePosiiton({
            startMousePosition: {
                top: e.clientY,
                left: e.clientX,
            },
            endMousePosition: {
                top: e.clientY,
                left: e.clientX,
            }
        })
    }

    const onBackgroundPositionDrag = (e: React.MouseEvent<HTMLDivElement>) => {
        setDraggedBackgroundMousePosiiton(position => (position !== null ? {
            ...position,
            endMousePosition: {
                top: e.clientY,
                left: e.clientX,
            }
        } : null));
    }

    const stopBackgroundPositionDrag = () => {
        if (draggedBackgroundMousePosition) {
            setBackgroundPosition(position => ({
                top: position.top - (draggedBackgroundMousePosition.startMousePosition.top - draggedBackgroundMousePosition.endMousePosition.top),
                left: position.left - (draggedBackgroundMousePosition.startMousePosition.left - draggedBackgroundMousePosition.endMousePosition.left),
            }))
            setDraggedBackgroundMousePosiiton(null);
        }
    }

    // -----------------------------------------------------------------------------
    // NODE POSITIONS

    const [draggedNode, setDraggedNode] = React.useState<{startMousePosition: Position, endMousePosition: Position, nodeId: string} | null>(null);

    const handleDragStart = (nodeId: string): React.MouseEventHandler<HTMLDivElement> => e => {
        e.stopPropagation();
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
        inPlugName: string,
        inPosition: Position;
        outPosition: Position;
    }>();

    const handleStartConnecting = (nodeId: string) => (plugName: string, position: Position) => {
        setCreatedConnection({
                inNodeId: nodeId,
                inPlugName: plugName,
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

    const handleStopConnecting = (nodeId: string) => (plugName: string) => {
        if (createdConnection) {
            const newConnection = {
                inNodeId: createdConnection.inNodeId,
                inPlugName: createdConnection.inPlugName,
                outNodeId: nodeId,
                outPlugName: plugName,
            };

            if (!edges.some(edge => edge.inNodeId === newConnection.inNodeId && edge.outNodeId === newConnection.outNodeId && edge.inPlugName === newConnection.inPlugName && edge.outPlugName === newConnection.outPlugName)) {
                onEdgesChange([...edges, newConnection]);
            }

            setCreatedConnection(undefined);
        }
    };

    // ---------------------------------------------------------------------------------------
    // PLUG POSITIONS

    const [plugPositions, setPlugPositions] = React.useState<{[nodeId: string]: PlugPositions}>(
        nodes.reduce((positions, node) => ({ ...positions, [node.id]: {}}), {})
    );
    
    const handlePlugPositions = (nodeId: string) => (newPlugPositions: PlugPositions) => {
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
        e.preventDefault();
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

    const closeGlobalMenu = () => {
        setGlobalMenuPosition(null);
    }

    const addPositions = (positionA: Position, positionB: Position): Position => {
        return {
            top: positionA.top + positionB.top,
            left: positionA.left + positionB.left,
        }
    }

    const substractPositions = (positionA: Position, positionB: Position): Position => {
        return {
            top: positionA.top - positionB.top,
            left: positionA.left - positionB.left,
        };
    }

    const nodePositions = nodes.reduce((positions, node) => ({
        ...positions,
        [node.id]: addPositions(draggedNode && draggedNode.nodeId === node.id ? calculateNewNodePosition(node, draggedNode) : node.position, displayedBackgroundPosition)
    }), {} as { [nodeId: string ]: Position});

    return <div onClick={() => { closeEdgeMenu(); }} 
                onMouseDown={(e) => { startBackgroundPositionDrag(e); closeGlobalMenu(); }}
                onMouseUp={(e) => { handleDragStop(e); handleCancelConnecting(); stopBackgroundPositionDrag(); }} 
                onContextMenu={toggleGlobalMenu}
                onMouseMove={e => { e.preventDefault(); handleDrag(e); handleConnectingDrag(e); onBackgroundPositionDrag(e); }}
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
                {globalMenu({ position: substractPositions(globalMenuPosition, backgroundPosition), onClose: closeGlobalMenu })}
            </div>
        }
        {edgeMenu && <EdgeMenu position={edgeMenu.position} onDeleteEdge={handleDeleteEdge} />
        }
        <svg style={{zIndex: 100, position: 'absolute', top: 0, left: 0, height: '100%', width: '100%', pointerEvents: 'none'}}>
            {createdConnection && <CreatedSVGEdge nodePositions={nodePositions} plugPositions={plugPositions} createdConnection={createdConnection} />}
            {edges.map((edge, i) => <SVGEdge key={i} onOpenEdgeMenu={handleOpenEdgeMenu} onCloseEdgeMenu={closeEdgeMenu} edge={edge} plugPositions={plugPositions} nodePositions={nodePositions} />)}
        </svg>
    </div>;
}
