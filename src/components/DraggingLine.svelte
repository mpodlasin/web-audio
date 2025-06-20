<script lang="ts">
	import { calculateBezierPath } from '../ui/bezierCurves';
	import type { Position } from '../audio/serialized';

	interface Props {
		startPosition: Position;
		endPosition: Position;
		visible: boolean;
	}

	let { startPosition, endPosition, visible }: Props = $props();

	// Calculate Bézier curve path for the dragging line
	let draggingPath = $derived(
		visible ? calculateBezierPath(startPosition, endPosition) : ''
	);
</script>

{#if visible}
	<path d={draggingPath} class="dragging-line" />
{/if}

<style>
	.dragging-line {
		stroke: var(--neutral-300);
		stroke-width: 2;
		fill: none;
		pointer-events: none;
	}
</style>
