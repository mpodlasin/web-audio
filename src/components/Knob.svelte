<script lang="ts">
	import type { SerializedAudioParameter } from '../audio/AudioCanvas';

	export let parameterName: string;
	export let parameter: SerializedAudioParameter;

	const numberParameter = typeof parameter === 'number' ? parameter : null;
	const inputParameter = typeof parameter === 'object' ? parameter : null;
</script>

<div class="wrapper">
	<div>{parameterName}</div>
	<div class="knob" />
</div>

<style>
	.wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 16px;
	}
	.knob {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background-color: #333;
	}
</style>
