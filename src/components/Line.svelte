<script lang="ts">
	import { plugsEqual } from '../audio/serialized';
	import { normalizedVector } from '../ui/vectors';
	import type { LineToDisplay } from '../ui/lines';
	export let line: LineToDisplay;
	export let chosenLine: LineToDisplay | null;

	const cutLineOverlayConstant = 9;

	$: vector = normalizedVector(line.from, line.to);
</script>

<line x1={line.from.x} y1={line.from.y} x2={line.to.x} y2={line.to.y} class="visible" />
<line
	on:contextmenu
	on:touchstart
	x1={line.from.x + vector.x * cutLineOverlayConstant}
	y1={line.from.y + vector.y * cutLineOverlayConstant}
	x2={line.to.x - vector.x * cutLineOverlayConstant}
	y2={line.to.y - vector.y * cutLineOverlayConstant}
	stroke="transparent"
	stroke-width="7"
	stroke-linecap="round"
	class="invisible"
	class:chosen={chosenLine
		? plugsEqual(chosenLine.line[0], line.line[0]) && plugsEqual(chosenLine.line[1], line.line[1])
		: false}
/>

<style>
	line {
		pointer-events: all;
	}

	line.visible {
		stroke: var(--neutral-300);
		pointer-events: none;
	}

	line.invisible {
		transition: stroke 0.2s;
		opacity: 0.5;
	}

	line.invisible:hover,
	line.chosen {
		stroke: var(--primary-500);
	}
</style>
