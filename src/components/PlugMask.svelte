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
	}

	let {
		nodeId,
		plugId,
		position,
		onPointerDown,
		onPointerUp,
		type,
		draggingLine,
		onHoveringOver
	}: Props = $props();

	const handlePointerDown = (event: MouseEvent) => {
		event.stopPropagation();
		event.preventDefault();

		onPointerDown({ nodeId, plugId, type, event });
	};

	const handlePointerUp = (event: MouseEvent) => {
		event.stopPropagation();
		event.preventDefault();

		onPointerUp({ nodeId, plugId, type, event });
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
	onpointerdown={handlePointerDown}
	onpointerup={handlePointerUp}
></div>

<style>
	div {
		width: 30px;
		height: 30px;
		transform: translateX(-50%) translateY(-50%);
		position: absolute;
		z-index: 100;
	}

	.draggingLine {
		pointer-events: none;
	}
</style>
