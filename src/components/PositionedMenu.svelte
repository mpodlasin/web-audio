<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Position } from '../audio/serialized';
	import Menu from './Menu.svelte';

	export let position: Position;

	const dispatcher = createEventDispatcher();

	const handleMenuClick = (event: MouseEvent) => {
		event.stopPropagation();
	};

	const handleBackgroundClick = () => {
		dispatcher('close');
	};
</script>

<div class="background" on:click={handleBackgroundClick} on:keypress={() => {}}>
	<div
		class="menu"
		style="left: {position.x}px; top: {position.y}px;"
		on:click={handleMenuClick}
		on:keypress={() => {}}
	>
		<Menu>
			<slot />
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
	}

	.menu {
		position: absolute;
	}
</style>
