import React from "react";

interface Plug {
    type: string;
    name: string;
}

interface Position {
    top: number;
    left: number;
}

interface ComponentGraphCanvasPropsNode {
    name: string;
    component: React.ReactNode;
    inPlugs: Plug[];
    outPlugs: Plug[];
}

interface ComponentGraphCanvasProps {
    nodes: ComponentGraphCanvasPropsNode[];
}

export function EdgeEnd() {
    return <div style={{border: '1px solid black', backgroundColor: 'lightgray', height: '1rem', width: '1rem'}}></div>
}

export function ComponentGraphCanvas({ nodes }: ComponentGraphCanvasProps) {
    const [positions, setPositions] = React.useState(nodes.map(() => ({ top: 0, left: 0 })));
    const [plugPositions, setPlugPositions] = React.useState<Position[][]>(nodes.map(() => []));
    const [dragging, setDragging] = React.useState<boolean[]>(nodes.map(() => false));
    const [internalElementPositions, setInternalElementPositions] = React.useState<(null | { top: number; left: number })[]>(nodes.map(() => null));

    const handleDragStart = (i: number): React.MouseEventHandler<HTMLDivElement> => e => {
        setDragging(dragging => {
            const draggingCopy = [...dragging];

            draggingCopy[i] = true;

            return draggingCopy;
        });

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
        setDragging(nodes.map(() => false));
    }

    const handleDrag: React.MouseEventHandler<HTMLDivElement> = e => {
        if (dragging.some(d => d === true)) {
            e.preventDefault();

            const draggedIndex = dragging.indexOf(true);

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


    const [connections, setConnections] = React.useState<{
        inNodeIndex: number,
        inPlugIndex: number,
        outNodeIndex: number,
        outPlugIndex: number,
    }[]>([]);

    const handleStopConnecting = (nodeIndex: number) => (plugIndex: number, position: Position) => {

        if (createdConnection) {
            setConnections(connections => [...connections, {
                inNodeIndex: createdConnection.inNodeIndex,
                inPlugIndex: createdConnection.inPlugIndex,
                outNodeIndex: nodeIndex,
                outPlugIndex: plugIndex,
            }]);

            setCreatedConnection(undefined);
        }
    };

    const handlePlugPositions = (nodeIndex: number) => (newPlugPositions: Position[]) => {
        setPlugPositions(plugPositions => {
            const plugPositionsCopy = [...plugPositions];

            plugPositionsCopy[nodeIndex] = newPlugPositions;

            return plugPositionsCopy;
        });
    };

    return <div onMouseUp={() => { handleDragStop(); handleCancelConnecting(); }} onMouseMove={e => { handleDrag(e); handleConnectingDrag(e); }} style={{position: 'relative', border: '1px solid red', height: '100%', boxSizing: 'border-box'}}>
        {nodes.map((node, i) => <ComponentGraphCanvasNode
            key={i}
            node={node} 
            position={positions[i]} 
            onDragStart={handleDragStart(i)} 
            onStartConnecting={handleStartConnecting(i)}
            onStopConnecting={handleStopConnecting(i)}
            onPlugPositions={handlePlugPositions(i)}
        />)}
        <svg style={{width: '100%', height: '100%', pointerEvents: 'none'}}>
            {createdConnection && <line x1={plugPositions[createdConnection.inNodeIndex][createdConnection.inPlugIndex].left + positions[createdConnection.inNodeIndex].left} y1={plugPositions[createdConnection.inNodeIndex][createdConnection.inPlugIndex].top + positions[createdConnection.inNodeIndex].top} x2={createdConnection.outPosition.left} y2={createdConnection.outPosition.top} stroke="black" />}
            {connections.map(connection => <line 
                x1={plugPositions[connection.inNodeIndex][connection.inPlugIndex].left + positions[connection.inNodeIndex].left} 
                y1={plugPositions[connection.inNodeIndex][connection.inPlugIndex].top + positions[connection.inNodeIndex].top} 
                x2={plugPositions[connection.outNodeIndex][connection.outPlugIndex].left + positions[connection.outNodeIndex].left} 
                y2={plugPositions[connection.outNodeIndex][connection.outPlugIndex].top + positions[connection.outNodeIndex].top} 
                stroke="black"
            />)}
        </svg>
    </div>;
}

interface ComponentGraphCanvasNodeProps {
    node: ComponentGraphCanvasPropsNode;
    position: Position;
    onDragStart(e: React.MouseEvent<HTMLDivElement>): void;
    onStartConnecting(plugIndex: number, position: Position): void;
    onStopConnecting(plugIndex: number, position: Position): void;
    onPlugPositions(plugPositions: Position[]): void;
}

const ComponentGraphCanvasNode = ({ node, position, onDragStart, onStartConnecting, onStopConnecting, onPlugPositions }: ComponentGraphCanvasNodeProps) => {
    const [plugPositions, setPlugPositions] = React.useState<Position[]>([]);

    const handlePosition = (i: number) => (plugPosition: Position) => {
            setPlugPositions(plugPositions => {
                const plugPositionsCopy = [...plugPositions];
    
                plugPositionsCopy[i] = plugPosition;
    
                return plugPositionsCopy;
            });
    };

    React.useEffect(() => {
        if (plugPositions.length > 0 && plugPositions.every(plugPosition => plugPosition !== undefined)) {
            onPlugPositions(plugPositions);
        }
    }, [plugPositions]);

    return (
        <div style={{border: '1px solid gray', position: 'absolute', ...position, }}>
            <div onMouseDown={onDragStart} style={{padding: '5px 10px', borderBottom: '1px solid black', cursor: 'move'}}>{node.name}</div>
            <div style={{padding: '10px 10px'}}>
                {node.inPlugs.map((_, i) => <NodePlug onPosition={handlePosition(i)} onStartConnecting={position => onStartConnecting(i, position)} onStopConnecting={position => onStopConnecting(i, position)} />)}
            </div>
            <div style={{cursor: 'initial', padding: 10}}>{node.component}</div>
            <div style={{padding: '10px 10px'}}>
                {node.inPlugs.map((_, i) => <NodePlug onPosition={handlePosition(node.inPlugs.length + i)} onStartConnecting={position => onStartConnecting(node.inPlugs.length + i, position)} onStopConnecting={position => onStopConnecting(node.inPlugs.length + i, position)} />)}
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
                top: ref.current.getBoundingClientRect().top,
                left: ref.current.getBoundingClientRect().left,
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
            style={{ backgroundColor: 'lightgray', width: 15, height: 15, borderRadius: 15, border: '1px solid gray' }}
            />
    );
}