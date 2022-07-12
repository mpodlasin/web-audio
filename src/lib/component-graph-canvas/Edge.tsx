import React from 'react';
import { PlugPositions } from './PlugPositions';
import { Position } from "./Position";

export interface Edge {
    inNodeId: string,
    inPlugName: string,
    outNodeId: string,
    outPlugName: string,
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
    plugPositions: {[nodeId: string]: { [plugName: string]: Position }};
    nodePositions: {[nodeId: string]: Position};
    onOpenEdgeMenu(edge: Edge, position: Position): void;
    onCloseEdgeMenu(): void;
}

export const SVGEdge = ({ edge, plugPositions, nodePositions, onOpenEdgeMenu, onCloseEdgeMenu }: SVGEdgeProps) => {
    const [isHoveredOver, setIsHoveredOver] = React.useState(false);

    if (!plugPositions[edge.inNodeId][edge.inPlugName] || !plugPositions[edge.outNodeId][edge.outPlugName]) {
        return null;
    }

    const handleRightClick = (e: React.MouseEvent<SVGLineElement>) => {
        e.preventDefault();

        onOpenEdgeMenu(edge, {top: e.clientY, left: e.clientX});
    };

    const handleClick = (e: React.MouseEvent<SVGLineElement>) => {
        e.stopPropagation();

        onCloseEdgeMenu();
    };

    const x1 = plugPositions[edge.inNodeId][edge.inPlugName].left + nodePositions[edge.inNodeId].left;
    const y1 = plugPositions[edge.inNodeId][edge.inPlugName].top + nodePositions[edge.inNodeId].top;
    const x2 = plugPositions[edge.outNodeId][edge.outPlugName].left + nodePositions[edge.outNodeId].left;
    const y2 = plugPositions[edge.outNodeId][edge.outPlugName].top + nodePositions[edge.outNodeId].top;

    return (
        <>
            <line
                style={{pointerEvents: 'all'}}
                x1={x1} 
                y1={y1} 
                x2={x2} 
                y2={y2} 
                stroke="gray"
            />
            <line
                style={{pointerEvents: 'all', cursor: 'pointer'}}
                onClick={handleClick}
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

export interface CreatedConnection {
    inNodeId: string, 
    inPlugName: string,
    inPosition: Position;
    outPosition: Position;
}

export interface CreatedSVGEdgeProps {
    plugPositions: {[nodeId: string]: PlugPositions};
    nodePositions: {[nodeId: string]: Position};
    createdConnection: CreatedConnection;
}


export const CreatedSVGEdge = ({nodePositions, plugPositions, createdConnection}: CreatedSVGEdgeProps) => {
    return (
        <line 
                x1={plugPositions[createdConnection.inNodeId][createdConnection.inPlugName].left + nodePositions[createdConnection.inNodeId].left} 
                y1={plugPositions[createdConnection.inNodeId][createdConnection.inPlugName].top + nodePositions[createdConnection.inNodeId].top} 
                x2={createdConnection.outPosition.left} y2={createdConnection.outPosition.top} 
                stroke="black" 
            />
    );
};