import React from "react";
import internal from "stream";

interface ComponentGraphCanvasProps {
    children?: React.ReactElement[];
}

export function ComponentGraphCanvas({ children }: ComponentGraphCanvasProps) {
    const [positions, setPositions] = React.useState(React.Children.map(children, () => ({ top: 0, left: 0 })) ?? []);
    const [dragging, setDragging] = React.useState<boolean[]>(React.Children.map(children, () => false) ?? []);
    const [internalElementPositions, setInternalElementPositions] = React.useState<(null | { top: number; left: number })[]>(React.Children.map(children, () => null) ?? []);

    const handleDragStart = (i: number): React.MouseEventHandler<HTMLDivElement> => e => {
        const target = e.target as HTMLElement;
        if (!target.classList.contains('wrapper')) return;

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
        setDragging(React.Children.map(children, () => false) ?? []);
    }

    const handleDrag: React.MouseEventHandler<HTMLDivElement> = e => {
        const target = e.target as HTMLElement;
        if (target.classList.contains('wrapper')) {
            e.preventDefault();
        }

        if (dragging.some(d => d === true)) {
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

    return <div onMouseUp={handleDragStop} onMouseMove={handleDrag} style={{position: 'relative', border: '1px solid red', height: '100%', boxSizing: 'border-box'}}>{React.Children.map(children, (child, i) => 
        <div className="wrapper" onMouseDown={handleDragStart(i)} style={{border: '1px solid gray', position: 'absolute', padding: 20, cursor: 'move', ...positions[i]}}>
            <div style={{cursor: 'initial', border: '1px solid lightgray', padding: 20}}>{child}</div>
        </div>
    )}</div>;
}