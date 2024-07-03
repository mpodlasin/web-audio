<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { rewriteStringWithNumber } from '../utils/rewriteStringWithNumber';

	export let label: string;
	export let active: boolean;

	const dispatcher = createEventDispatcher();

	const handleClick = (event: MouseEvent) => {
		event.stopPropagation();
		event.preventDefault();

		dispatcher('change', {
			parameterName: label,
			value: active ? 0 : 1
		});
	};

	const ignorePointerEvent = (event: PointerEvent) => {
		event.stopPropagation();
		event.preventDefault();
	};
</script>

<div class="wrapper">
	<button
		class:active
		on:click={handleClick}
		on:pointerup={ignorePointerEvent}
		on:pointerdown={ignorePointerEvent}
	/>
	<div class="label">{rewriteStringWithNumber(label)}</div>
</div>

<style>
	.wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
	}

	button {
		border: 1px solid var(--neutral-500);
		height: 20px;
		width: 20px;
		border-radius: 4px;
		background-color: var(--neutral-900);
		cursor: pointer;
	}

	.active {
		background-color: var(--primary-500);
		border: 1px solid var(--primary-500);
	}

	.label {
		text-align: center;
		font-size: 10px;
		white-space: nowrap;
	}
</style>
