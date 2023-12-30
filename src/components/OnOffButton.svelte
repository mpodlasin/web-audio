<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { rewriteStringWithNumber } from '../utils/rewriteStringWithNumber';

	export let label: string;
	export let active: boolean;

	const dispatcher = createEventDispatcher();

	const handleClick = () => {
		dispatcher('change', {
			parameterName: label,
			value: active ? 0 : 1
		});
	};
</script>

<div class="wrapper">
	<button class:active on:click={handleClick} />
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
