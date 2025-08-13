<script lang="ts">
	import { plugsEqual } from '../audio/serialized';
	import { calculateBezierPath } from '../ui/bezierCurves';
	import type { LineToDisplay } from '../ui/lines';

	interface Props {
		line: LineToDisplay;
		chosenLine: LineToDisplay | null;
		stopSelection: boolean;
		onClick(event: MouseEvent): void;
		onContextMenu(event: MouseEvent): void;
	}

	let { line, chosenLine, stopSelection, onClick, onContextMenu }: Props = $props();

	let hovering = $state(false);

	let chosen = $derived(
		chosenLine
			? plugsEqual(chosenLine.line[0], line.line[0]) && plugsEqual(chosenLine.line[1], line.line[1])
			: false
	);

	const toggleHover = () => {
		hovering = !hovering;
	};

	// Calculate Bézier curve paths
	let bezierPath = $derived(calculateBezierPath(line.from, line.to));
</script>

<path d={bezierPath} class="visible" />
<path d={bezierPath} class="highlighted" class:hovering class:chosen class:stopSelection />
<path
	onclick={onClick}
	onkeypress={() => {}}
	oncontextmenu={onContextMenu}
	onpointerenter={toggleHover}
	onpointerleave={toggleHover}
	role="link"
	tabindex={0}
	d={bezierPath}
	stroke="transparent"
	stroke-linecap="round"
	fill="none"
	class="invisible"
	class:stopSelection
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
		stroke-width: 30;
		stroke: pink;
		opacity: 0;
	}

	path.stopSelection {
		display: none;
	}

	path.highlighted {
		stroke-width: 7;
		transition: stroke 0.2s;
		opacity: 0.4;
		stroke-linecap: round;
	}

	path.hovering,
	path.chosen {
		stroke: var(--primary-500);
	}
</style>
