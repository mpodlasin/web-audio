import React from 'react';
import { Position } from './Position';
import css from './Node.module.css';
import { PlugPositions } from './PlugPositions';

export interface Plug {
    color: string;
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
    onStartConnecting(plugName: string, position: Position): void;
    onStopConnecting(plugName: string, position: Position): void;
    onPlugPositions(plugPositions: PlugPositions): void;
}

export const NodeComponent = ({ node, position, onDragStart, onStartConnecting, onStopConnecting, onPlugPositions, onDelete }: NodeComponentProps) => {
    const [plugPositions, setPlugPositions] = React.useState<{[plugName: string]: Position}>({});

    const ref = React.useRef<HTMLDivElement>(null);

    const handlePosition = (plugName: string) => (plugPosition: Position) => {
            setPlugPositions(plugPositions => {
                const plugPositionsCopy = {...plugPositions};
    
                if (ref.current) {
                    plugPositionsCopy[plugName] = {
                        top: plugPosition.top - ref.current.getBoundingClientRect().top,
                        left: plugPosition.left - ref.current.getBoundingClientRect().left,
                    };
                }
    
                return plugPositionsCopy;
            });
    };

    React.useEffect(() => {
        if (Object.keys(plugPositions).length === node.inPlugs.length + node.outPlugs.length) {
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
            <div onMouseMove={e => e.stopPropagation()} className={css.contentWithPlugs}>
                <div className={css.inputPlugs}>
                    {node.inPlugs.map((plug, i) => <NodePlug key={plug.name} zIndex={node.inPlugs.length - i} plug={plug} onPosition={handlePosition(plug.name)} onStartConnecting={position => onStartConnecting(plug.name, position)} onStopConnecting={position => onStopConnecting(plug.name, position)} />)}
                </div>
                <div className={css.content}>{node.component}</div>
                <div className={css.outputPlugs}>
                    {node.outPlugs.map((plug, i) => <NodePlug key={plug.name} zIndex={node.outPlugs.length - i} plug={plug} onPosition={handlePosition(plug.name)} onStartConnecting={position => onStartConnecting(plug.name, position)} onStopConnecting={position => onStopConnecting(plug.name, position)} />)}
                </div>
            </div>
        </div>
    );
}

interface NodePlugProps {
    onStartConnecting(position: Position): void;
    onStopConnecting(position: Position): void;
    onPosition(position: Position): void;
    plug: Plug;
    zIndex?: number;
}

const NodePlug = ({ onStartConnecting, onStopConnecting, onPosition, plug, zIndex = 0 }: NodePlugProps) => {
    const [, setPosition] = React.useState<Position>({ top: 0, left: 0});
    const [isHoveredOver, setIsHoveredOver] = React.useState(false);

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
        <div style={{zIndex}} onMouseEnter={() => setIsHoveredOver(true)} onMouseLeave={() => setIsHoveredOver(false)} className={css.nodePlugContainer}>
        <div style={{borderColor: !isHoveredOver ? 'transparent' : undefined}} className={css.nodePlugWrapper}>
            <div
                ref={ref}
                onMouseDown={e => { e.stopPropagation(); onStartConnecting({top: e.clientY, left: e.clientX}); }} 
                onMouseUp={e => onStopConnecting({top: e.clientY, left: e.clientX})}
                className={css.nodePlug}
                style={{backgroundColor: plug.color}}
                />
            <div style={{display: !isHoveredOver ? 'none' : 'block', paddingRight: 8}}>{plug.name}</div>
        </div>
        </div>
    );
}