<script lang="ts">
	import type { Position } from '../audio/serialized';

	interface Props {
		draggingLine: boolean;
		nodeId: string;
		plugId: string;
		type: 'input' | 'output';
		position: Position;
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

	let { nodeId, plugId, position, onPointerDown, onPointerUp, type, draggingLine }: Props =
		$props();

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
</script>

<div
	class:draggingLine
	data-node-id={nodeId}
	data-plug-id={plugId}
	style="top: {position.y}px; left: {position.x}px;"
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
