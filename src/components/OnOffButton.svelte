<script lang="ts">
	import { rewriteStringWithNumber } from '../utils/rewriteStringWithNumber';

	interface Props {
		label: string;
		active: boolean;
		onChange(event: { parameterName: string; value: 0 | 1 }): void;
	}

	let { label, active, onChange }: Props = $props();

	const handleClick = (event: MouseEvent) => {
		event.stopPropagation();
		event.preventDefault();

		onChange({
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
		onclick={handleClick}
		onpointerup={ignorePointerEvent}
		onpointerdown={ignorePointerEvent}
		aria-label="On/Off Button"
	></button>
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
