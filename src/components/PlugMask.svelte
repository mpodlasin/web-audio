<script lang="ts">
	import type { Plug, Position } from '../audio/serialized';

	interface Props {
		draggingLine: boolean;
		nodeId: string;
		plugId: string;
		type: 'input' | 'output';
		position: Position;
		onHoveringOver(plug: Plug | null): void;
		onPointerDown(event: {
			nodeId: string;
			plugId: string;
			type: 'input' | 'output';
			event: MouseEvent;
		}): void;
		onPointerUp(event: {
			nodeId: string;
			plugId: string;
			type: 'input' | 'output';
			event: MouseEvent;
		}): void;
		onPointerMove(event: PointerEvent): void;
	}

	let {
		nodeId,
		plugId,
		position,
		type,
		draggingLine,
		onPointerDown,
		onPointerUp,
		onPointerMove,
		onHoveringOver
	}: Props = $props();

	const handlePointerDown = (event: PointerEvent) => {
		event.stopPropagation();
		event.preventDefault();

		onPointerDown({ nodeId, plugId, type, event });
	};

	const handlePointerUp = (event: PointerEvent) => {
		event.stopPropagation();
		event.preventDefault();

		onPointerUp({ nodeId, plugId, type, event });
	};

	const handlePointerMove = (event: PointerEvent) => {
		event.preventDefault();
		event.stopPropagation();

		onPointerMove(event);
	};

	const handlePointerEnter = () => {
		onHoveringOver({ nodeId, type, id: plugId });
	};

	const handlePointerLeave = () => {
		onHoveringOver(null);
	};
</script>

<div
	class:draggingLine
	data-node-id={nodeId}
	data-plug-id={plugId}
	style="top: {position.y}px; left: {position.x}px;"
	onpointerenter={handlePointerEnter}
	onpointerleave={handlePointerLeave}
	onpointermove={handlePointerMove}
	onpointerdown={handlePointerDown}
	onpointerup={handlePointerUp}
></div>

<style>
	div {
		width: 30px;
		height: 30px;
		transform: translateX(-50%) translateY(-50%);
		position: absolute;
		background-color: blue;
		opacity: 0;
		z-index: 10;
	}

	.draggingLine {
		pointer-events: none;
	}
</style>
