<script lang="ts">
	import { plugsEqual } from '../audio/serialized';
	import { normalizedVector } from '../ui/vectors';
	import type { LineToDisplay } from '../ui/lines';
	interface Props {
		line: LineToDisplay;
		chosenLine: LineToDisplay | null;
		onClick(event: MouseEvent): void;
		onContextMenu(event: MouseEvent): void;
	}

	let { line, chosenLine, onClick, onContextMenu }: Props = $props();

	const cutLineOverlayConstant = 9;

	let vector = $state(normalizedVector(line.from, line.to));

	// svelte-ignore state_referenced_locally
	let x1 = $state(line.from.x + vector.x * cutLineOverlayConstant);
	// svelte-ignore state_referenced_locally
	let y1 = $state(line.from.y + vector.y * cutLineOverlayConstant);
	// svelte-ignore state_referenced_locally
	let x2 = $state(line.to.x - vector.x * cutLineOverlayConstant);
	// svelte-ignore state_referenced_locally
	let y2 = $state(line.to.y - vector.y * cutLineOverlayConstant);

	let visibleX1 = $state(line.from.x);
	let visibleY1 = $state(line.from.y);
	let visibleX2 = $state(line.to.x);
	let visibleY2 = $state(line.to.y);

	$effect(() => {
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
	});
</script>

<line x1={visibleX1} y1={visibleY1} x2={visibleX2} y2={visibleY2} class="visible" />
<line
	onclick={onClick}
	onkeypress={() => {}}
	oncontextmenu={onContextMenu}
	role="link"
	tabindex={0}
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
		stroke: var(--neutral-400);
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
