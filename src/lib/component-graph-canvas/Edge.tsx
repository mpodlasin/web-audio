import React from 'react';
import { Position } from "./Position";

export interface Edge {
    inNodeIndex: number,
    inPlugIndex: number,
    outNodeIndex: number,
    outPlugIndex: number,
}

export interface EdgeMenuProps {
    position: Position;
    onDeleteEdge(): void;
}

export const EdgeMenu = ({ onDeleteEdge, position, }: EdgeMenuProps) => {
    return (
        <div style={{border: '1px solid black', position: 'absolute', ...position}}>
            <button onClick={onDeleteEdge}>Delete</button>
        </div>
    );
}

export interface SVGEdgeProps {
    edge: Edge;
    plugPositions: Position[][];
    positions: Position[];
    onOpenEdgeMenu(edge: Edge, position: Position): void;
}

export const SVGEdge = ({ edge, plugPositions, positions, onOpenEdgeMenu }: SVGEdgeProps) => {
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