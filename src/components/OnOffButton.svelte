<script lang="ts">
	import { createEventDispatcher } from 'svelte';

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

<div>
	<button class:active on:click={handleClick} />
	<div class="label">{label}</div>
</div>

<style>
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
		padding-top: 4px;
	}
</style>
