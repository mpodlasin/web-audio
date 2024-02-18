<script lang="ts">
	import { plugsEqual } from '../audio/serialized';
	import { normalizedVector } from '../ui/vectors';
	import type { LineToDisplay } from '../ui/lines';
	export let line: LineToDisplay;
	export let chosenLine: LineToDisplay | null;

	const cutLineOverlayConstant = 9;

	let vector = normalizedVector(line.from, line.to);

	let x1 = line.from.x + vector.x * cutLineOverlayConstant;
	let y1 = line.from.y + vector.y * cutLineOverlayConstant;
	let x2 = line.to.x - vector.x * cutLineOverlayConstant;
	let y2 = line.to.y - vector.y * cutLineOverlayConstant;

	let visibleX1 = line.from.x;
	let visibleY1 = line.from.y;
	let visibleX2 = line.to.x;
	let visibleY2 = line.to.y;

	$: {
		if (
			line.from.x !== visibleX1 ||
			line.from.y !== visibleY1 ||
			line.to.x !== visibleX2 ||
			line.to.y !== visibleY2
		) {
			vector = normalizedVector(line.from, line.to);

			x1 = line.from.x + vector.x * cutLineOverlayConstant;
			y1 = line.from.y + vector.y * cutLineOverlayConstant;
			x2 = line.to.x - vector.x * cutLineOverlayConstant;
			y2 = line.to.y - vector.y * cutLineOverlayConstant;

			visibleX1 = line.from.x;
			visibleY1 = line.from.y;
			visibleX2 = line.to.x;
			visibleY2 = line.to.y;
		}
	}
</script>

<line x1={visibleX1} y1={visibleY1} x2={visibleX2} y2={visibleY2} class="visible" />
<line
	on:click
	on:keypress={() => {}}
	{x1}
	{y1}
	{x2}
	{y2}
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
