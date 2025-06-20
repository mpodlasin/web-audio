export default class SelectingNodes {
	// let selectedNodeIds: string[] = $state([]);
	// let selectNodesStartPosition: Position | null = $state(null);
	// let selectNodesEndPosition: Position | null = $state(null);
	// const handleStartSelectingNodes = (event: PointerEvent) => {
	// 	event.preventDefault();
	// 	if (isAlternativeKey(event)) {
	// 		if (!event.shiftKey) {
	// 			selectedNodeIds = [];
	// 		}
	// 		selectNodesStartPosition = {
	// 			x: event.clientX,
	// 			y: event.clientY
	// 		};
	// 	}
	// };
	// const handleCanvasDoubleClick = (event: MouseEvent) => {
	// 	if (event.detail === 2) {
	// 		selectedNodeIds = [];
	// 	}
	// };
	// const handleSelectNodesDrag = (event: PointerEvent) => {
	// 	if (!selectNodesStartPosition) return;
	// 	selectNodesEndPosition = {
	// 		x: event.clientX,
	// 		y: event.clientY
	// 	};
	// };
	// const handleSelectNodeClick = (id: string) => (event: MouseEvent) => {
	// 	event.preventDefault();
	// 	if (isAlternativeKey(event)) {
	// 		if (event.shiftKey) {
	// 			if (selectedNodeIds.some((selectedId) => selectedId === id)) {
	// 				selectedNodeIds = selectedNodeIds.filter((selectedId) => selectedId !== id);
	// 			} else {
	// 				selectedNodeIds = [...selectedNodeIds, id];
	// 			}
	// 		} else {
	// 			selectedNodeIds = [id];
	// 		}
	// 	}
	// };
	// const handleSelectNodesEnd = () => {
	// 	selectNodesStartPosition = null;
	// 	selectNodesEndPosition = null;
	// };
	// $effect(() => {
	// 	if (selectNodesStartPosition && selectNodesEndPosition) {
	// 		const filteredIds = Object.entries(audioGraph)
	// 			.filter(([_, node]) => {
	// 				const x = node.ui?.position.x ?? 0;
	// 				const y = node.ui?.position.y ?? 0;
	// 				if (!selectNodesEndPosition) {
	// 					return false;
	// 				}
	// 				if (!selectNodesStartPosition) {
	// 					return false;
	// 				}
	// 				return (
	// 					x < selectNodesEndPosition.x &&
	// 					y < selectNodesEndPosition?.y &&
	// 					selectNodesStartPosition?.x < x &&
	// 					selectNodesStartPosition?.y < y
	// 				);
	// 			})
	// 			.map(([id]) => id)
	// 			.filter((id) => !selectedNodeIds.some((selectedId) => selectedId === id));
	// 		selectedNodeIds = [...selectedNodeIds, ...filteredIds];
	// 	}
	// });
	// let copiedNodes: string[] = [];
	// const handleCanvasPointerDown = (event: PointerEvent) => {
	// 	handleStartSelectingNodes(event);
	// 	handleDragCanvasStart(event);
	// };
	// const handleCanvasPointerMove = (event: PointerEvent) => {
	// 	handleSelectNodesDrag(event);
	// 	handleDragCanvas(event);
	// };
}
