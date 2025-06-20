<script lang="ts">
	import { plugsEqual } from '../audio/serialized';
	import { calculateBezierPath } from '../ui/bezierCurves';
	import type { LineToDisplay } from '../ui/lines';

	interface Props {
		line: LineToDisplay;
		chosenLine: LineToDisplay | null;
		onClick(event: MouseEvent): void;
		onContextMenu(event: MouseEvent): void;
	}

	let { line, chosenLine, onClick, onContextMenu }: Props = $props();

	// Calculate Bézier curve paths
	let visiblePath = $derived(calculateBezierPath(line.from, line.to));
	let interactivePath = $derived(calculateBezierPath(line.from, line.to));
</script>

<path d={visiblePath} class="visible" />
<path
	onclick={onClick}
	onkeypress={() => {}}
	oncontextmenu={onContextMenu}
	role="link"
	tabindex={0}
	d={interactivePath}
	stroke="transparent"
	stroke-width="7"
	stroke-linecap="round"
	fill="none"
	class="invisible"
	class:chosen={chosenLine
		? plugsEqual(chosenLine.line[0], line.line[0]) && plugsEqual(chosenLine.line[1], line.line[1])
		: false}
/>

<style>
	path {
		pointer-events: all;
		fill: none;
	}

	path.visible {
		stroke: var(--neutral-400);
		stroke-width: 2;
		pointer-events: none;
	}

	path.invisible {
		transition: stroke 0.2s;
		opacity: 0.5;
	}

	path.invisible:hover,
	path.chosen {
		stroke: var(--primary-500);
	}
</style>
