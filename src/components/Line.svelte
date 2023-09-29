<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { plugsEqual } from '../audio/serialized';
	import { normalizedVector } from '../ui/vectors';
	import type { Plug } from '../audio/serialized';
	import type { LineToDisplay } from '../ui/lines';
	export let line: LineToDisplay;
	export let lineMenuPlugs: [Plug, Plug] | null;

	const dispatcher = createEventDispatcher();

	const cutLineOverlayConstant = 9;
</script>

<line x1={line.from.x} y1={line.from.y} x2={line.to.x} y2={line.to.y} class="visible" />
<line
	on:contextmenu
	x1={line.from.x + normalizedVector(line.from, line.to).x * cutLineOverlayConstant}
	y1={line.from.y + normalizedVector(line.from, line.to).y * cutLineOverlayConstant}
	x2={line.to.x - normalizedVector(line.from, line.to).x * cutLineOverlayConstant}
	y2={line.to.y - normalizedVector(line.from, line.to).y * cutLineOverlayConstant}
	stroke="transparent"
	stroke-width="7"
	stroke-linecap="round"
	class="invisible"
	class:chosen={lineMenuPlugs
		? plugsEqual(lineMenuPlugs[0], line.line[0]) && plugsEqual(lineMenuPlugs[1], line.line[1])
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
