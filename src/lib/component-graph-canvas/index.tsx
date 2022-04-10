import React from "react";

interface ComponentGraphCanvasProps {
    children?: React.ReactElement[];
}

export function ComponentGraphCanvas({ children }: ComponentGraphCanvasProps) {
    const [positions, setPositions] = React.useState(React.Children.map(children, () => ({ top: 0, left: 0 })) ?? []);
    const [dragging, setDragging] = React.useState<boolean[]>(React.Children.map(children, () => false) ?? []);

    const handleDragStart = (i: number) => () => {
        setDragging(dragging => {
            const draggingCopy = [...dragging];

            draggingCopy[i] = true;

            return draggingCopy;
        })
    };

    const handleDragStop = () => {
        setDragging(React.Children.map(children, () => false) ?? []);
    }

    const handleDrag: React.MouseEventHandler<HTMLDivElement> = e => {
        if (dragging.some(d => d === true)) {
            const draggedIndex = dragging.indexOf(true);

            setPositions(positions => {
                const positionsCopy = [...positions];

                positionsCopy[draggedIndex] = {top: e.clientY, left: e.clientX};

                return positionsCopy;
            });
        }
    };

    return <div onMouseUp={handleDragStop} onMouseMove={handleDrag} style={{position: 'relative', border: '1px solid red', height: '100%', boxSizing: 'border-box'}}>{React.Children.map(children, (child, i) => 
        <div onMouseDown={handleDragStart(i)} style={{border: '1px solid gray', position: 'absolute', ...positions[i]}}>{child}</div>
    )}</div>;
}