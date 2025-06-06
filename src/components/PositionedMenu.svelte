<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Position } from '../audio/serialized';
	import Menu from './Menu.svelte';

	interface Props {
		position: Position;
		children?: import('svelte').Snippet;
	}

	let { position, children }: Props = $props();

	const dispatcher = createEventDispatcher();

	const handleMenuClick = (event: MouseEvent) => {
		event.stopPropagation();
	};

	const handleBackgroundClick = () => {
		dispatcher('close');
	};
</script>

<div class="background" onmousedown={handleBackgroundClick} onkeypress={() => {}}>
	<div
		class="menu"
		style="left: {position.x}px; top: {position.y}px;"
		onmousedown={handleMenuClick}
		onkeypress={() => {}}
	>
		<Menu>
			{@render children?.()}
		</Menu>
	</div>
</div>

<style>
	.background {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 100;
	}

	.menu {
		position: absolute;
	}
</style>
