import React from "react";

export interface Plug {
    type: string;
    name: string;
}

export interface Position {
    top: number;
    left: number;
}

export interface Node {
    id: string;
    name: string;
    position: Position;
    component: React.ReactNode;
    inPlugs: Plug[];
    outPlugs: Plug[];
}

export interface Edge {
    inNodeIndex: number,
    inPlugIndex: number,
    outNodeIndex: number,
    outPlugIndex: number,
}

export interface ComponentGraphCanvasProps {
    nodes: Node[];
    edges: Edge[];
    onNodesChange?(newNodes: Node[]): void;
    onEdgesChange?(newEdges: Edge[]): void;
}

export function EdgeEnd() {
    return <div style={{border: '1px solid black', backgroundColor: 'lightgray', height: '1rem', width: '1rem'}}></div>
}

export function ComponentGraphCanvas({ nodes, edges, onNodesChange = () => {}, onEdgesChange = () => {} }: ComponentGraphCanvasProps) {
    // -----------------------------------------------------------------------------
    // NODE POSITIONS

    const [positions, setPositions] = React.useState(nodes.map(node => node.position));
    const [internalElementPositions, setInternalElementPositions] = React.useState<(null | Position)[]>(nodes.map(() => null));

    const handleDragStart = (i: number): React.MouseEventHandler<HTMLDivElement> => e => {
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

    const handleDragStop = () => {
        setInternalElementPositions(nodes.map(() => null));

        onNodesChange(nodes.map((node, i) => ({
            ...node,
            position: positions[i],
        })))
    }

    const handleDrag: React.MouseEventHandler<HTMLDivElement> = e => {
        if (internalElementPositions.some(internalElementPosition => internalElementPosition !== null)) {
            e.preventDefault();

            const draggedIndex = internalElementPositions.findIndex(internalElementPosition => internalElementPosition !== null);

            setPositions(positions => {
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

    const handleCloseEdgeMenu = () => {
        setEdgeMenu(null);
    }

    const handleDeleteEdge = () => {
        if (edgeMenu !== null) {
            onEdgesChange(edges.filter(edge => edge !== edgeMenu.edge));
            handleCloseEdgeMenu();
        }
    }

    return <div onClick={() => { handleCloseEdgeMenu(); }} onMouseUp={() => { handleDragStop(); handleCancelConnecting(); }} onMouseMove={e => { handleDrag(e); handleConnectingDrag(e); }} style={{position: 'relative', border: '1px solid red', height: '100%', boxSizing: 'border-box'}}>
        {nodes.map((node, i) => <Node
            key={i}
            node={node} 
            position={positions[i]} 
            onDragStart={handleDragStart(i)} 
            onStartConnecting={handleStartConnecting(i)}
            onStopConnecting={handleStopConnecting(i)}
            onPlugPositions={handlePlugPositions(i)}
        />)}
        {edgeMenu && <EdgeMenu position={edgeMenu.position} onDeleteEdge={handleDeleteEdge} />
        }
        <svg style={{width: '100%', height: '100%'}}>
            {createdConnection && <line 
                x1={plugPositions[createdConnection.inNodeIndex][createdConnection.inPlugIndex].left + positions[createdConnection.inNodeIndex].left} 
                y1={plugPositions[createdConnection.inNodeIndex][createdConnection.inPlugIndex].top + positions[createdConnection.inNodeIndex].top} 
                x2={createdConnection.outPosition.left} y2={createdConnection.outPosition.top} 
                stroke="black" 
            />}
            {edges.map((edge, i) => <SVGEdge key={i} onOpenEdgeMenu={handleOpenEdgeMenu} edge={edge} plugPositions={plugPositions} positions={positions} />)}
        </svg>
    </div>;
}

interface EdgeMenuProps {
    position: Position;
    onDeleteEdge(): void;
}

const EdgeMenu = ({ onDeleteEdge, position, }: EdgeMenuProps) => {
    return (
        <div style={{border: '1px solid black', position: 'absolute', ...position}}>
            <button onClick={onDeleteEdge}>Delete</button>
        </div>
    );
}

interface SVGEdgeProps {
    edge: Edge;
    plugPositions: Position[][];
    positions: Position[];
    onOpenEdgeMenu(edge: Edge, position: Position): void;
}

const SVGEdge = ({ edge, plugPositions, positions, onOpenEdgeMenu }: SVGEdgeProps) => {
    const [isHoveredOver, setIsHoveredOver] = React.useState(false);

    if (!plugPositions[edge.inNodeIndex][edge.inPlugIndex] || !plugPositions[edge.outNodeIndex][edge.outPlugIndex]) {
        return null;
    }

    const handleRightClick = (e: React.MouseEvent<SVGLineElement>) => {
        e.preventDefault();

        onOpenEdgeMenu(edge, {top: e.clientY, left: e.clientX});
    };

    const x1 = plugPositions[edge.inNodeIndex][edge.inPlugIndex].left + positions[edge.inNodeIndex].left;
    const y1 = plugPositions[edge.inNodeIndex][edge.inPlugIndex].top + positions[edge.inNodeIndex].top;
    const x2 = plugPositions[edge.outNodeIndex][edge.outPlugIndex].left + positions[edge.outNodeIndex].left;
    const y2 = plugPositions[edge.outNodeIndex][edge.outPlugIndex].top + positions[edge.outNodeIndex].top;

    return (
        <>
            <line
                x1={x1} 
                y1={y1} 
                x2={x2} 
                y2={y2} 
                stroke="black"
            />
            <line
                onContextMenu={handleRightClick}
                onMouseEnter={() => setIsHoveredOver(true)}
                onMouseLeave={() => setIsHoveredOver(false)}
                x1={x1} 
                y1={y1} 
                x2={x2} 
                y2={y2}
                stroke="blue"
                opacity={isHoveredOver ? 0.1 : 0}
                strokeWidth={10}
            />
        </>
    );
}

interface NodeProps {
    node: Node;
    position: Position;
    onDragStart(e: React.MouseEvent<HTMLDivElement>): void;
    onStartConnecting(plugIndex: number, position: Position): void;
    onStopConnecting(plugIndex: number, position: Position): void;
    onPlugPositions(plugPositions: Position[]): void;
}

const Node = ({ node, position, onDragStart, onStartConnecting, onStopConnecting, onPlugPositions }: NodeProps) => {
    const [plugPositions, setPlugPositions] = React.useState<Position[]>([]);

    const ref = React.useRef<HTMLDivElement>(null);

    const handlePosition = (i: number) => (plugPosition: Position) => {
            setPlugPositions(plugPositions => {
                const plugPositionsCopy = [...plugPositions];
    
                if (ref.current) {
                    plugPositionsCopy[i] = {
                        top: plugPosition.top - ref.current.getBoundingClientRect().top,
                        left: plugPosition.left - ref.current.getBoundingClientRect().left,
                    };
                }
    
                return plugPositionsCopy;
            });
    };

    React.useEffect(() => {
        if (plugPositions.length === node.inPlugs.length + node.outPlugs.length) {
            onPlugPositions(plugPositions);
        }
    }, [plugPositions, node.inPlugs.length, node.outPlugs.length]);

    return (
        <div ref={ref} style={{border: '1px solid gray', position: 'absolute', ...position, }}>
            <div onMouseDown={onDragStart} style={{padding: '5px 10px', borderBottom: '1px solid black', cursor: 'move'}}>{node.name}</div>
            <div style={{padding: '10px 10px'}}>
                {node.inPlugs.map((_, i) => <NodePlug key={i} onPosition={handlePosition(i)} onStartConnecting={position => onStartConnecting(i, position)} onStopConnecting={position => onStopConnecting(i, position)} />)}
            </div>
            <div style={{cursor: 'initial', padding: 10}}>{node.component}</div>
            <div style={{padding: '10px 10px'}}>
                {node.outPlugs.map((_, i) => <NodePlug key={i} onPosition={handlePosition(node.inPlugs.length + i)} onStartConnecting={position => onStartConnecting(node.inPlugs.length + i, position)} onStopConnecting={position => onStopConnecting(node.inPlugs.length + i, position)} />)}
            </div>
        </div>
    );
}

interface NodePlugProps {
    onStartConnecting(position: Position): void;
    onStopConnecting(position: Position): void;
    onPosition(position: Position): void;
}

const NodePlug = ({ onStartConnecting, onStopConnecting, onPosition }: NodePlugProps) => {
    const [, setPosition] = React.useState<Position>({ top: 0, left: 0});

    const ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if(ref.current) {
            const newPosition = {
                top: ref.current.getBoundingClientRect().top + 7,
                left: ref.current.getBoundingClientRect().left + 7,
            };

            onPosition(newPosition);
            setPosition(newPosition);
        }
    }, []);

    return (
        <div 
            ref={ref}
            onMouseDown={e => onStartConnecting({top: e.clientY, left: e.clientX})} 
            onMouseUp={e => onStopConnecting({top: e.clientY, left: e.clientX})} 
            style={{ backgroundColor: 'lightgray', width: 14, height: 14, borderRadius: 15, border: '1px solid gray' }}
            />
    );
}