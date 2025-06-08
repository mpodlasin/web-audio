<script lang="ts">
	import type { Position } from '../audio/serialized';
	import Menu from './Menu.svelte';

	interface Props {
		position: Position;
		onClose(): void;
		children?: import('svelte').Snippet;
	}

	let { position, children, onClose }: Props = $props();

	const handleMenuClick = (event: MouseEvent) => {
		event.stopPropagation();
	};

	const handleBackgroundClick = () => {
		onClose();
	};
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div class="background" onmousedown={handleBackgroundClick} onkeypress={() => {}} role="region">
	<div
		class="menu"
		style="left: {position.x}px; top: {position.y}px;"
		onmousedown={handleMenuClick}
		onkeypress={() => {}}
		role="menu"
		tabindex={0}
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
