import React from 'react';
import { Position } from './Position';
import css from './Node.module.css';

export interface Plug {
    type: string;
    name: string;
}

export interface Node {
    id: string;
    name: string;
    position: Position;
    component: React.ReactNode;
    inPlugs: Plug[];
    outPlugs: Plug[];
    headerColor: string;
}

export interface NodeComponentProps {
    node: Node;
    position: Position;
    onDelete(nodeToDelete: Node): void;
    onDragStart(e: React.MouseEvent<HTMLDivElement>): void;
    onStartConnecting(plugIndex: number, position: Position): void;
    onStopConnecting(plugIndex: number, position: Position): void;
    onPlugPositions(plugPositions: Position[]): void;
}

export const NodeComponent = ({ node, position, onDragStart, onStartConnecting, onStopConnecting, onPlugPositions, onDelete }: NodeComponentProps) => {
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

    const handleDelete = () => {
        onDelete(node);
    };

    return (
        <div ref={ref} style={{...position}} className={css.container}>
            <div onMouseDown={onDragStart} className={css.header} style={{backgroundColor: node.headerColor}}>
                <span>{node.name}</span>
                <button className={css.closeButton} onClick={handleDelete}>X</button>
            </div>
            <div className={css.contentWithPlugs}>
                <div className={css.inputPlugs}>
                    {node.inPlugs.map((_, i) => <NodePlug key={i} onPosition={handlePosition(i)} onStartConnecting={position => onStartConnecting(i, position)} onStopConnecting={position => onStopConnecting(i, position)} />)}
                </div>
                <div className={css.content}>{node.component}</div>
                <div className={css.outputPlugs}>
                    {node.outPlugs.map((_, i) => <NodePlug key={i} onPosition={handlePosition(node.inPlugs.length + i)} onStartConnecting={position => onStartConnecting(node.inPlugs.length + i, position)} onStopConnecting={position => onStopConnecting(node.inPlugs.length + i, position)} />)}
                </div>
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
                top: ref.current.getBoundingClientRect().top + 6,
                left: ref.current.getBoundingClientRect().left + 6,
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
            className={css.nodePlug}
            />
    );
}