<script lang="ts">
	import {
		allowedSerializedAudioElementStaticDefinitions,
		type AllowedSerializedAudioElements,
		type SerializedAudioParameter
	} from '../audio/AudioCanvas';
	import Knob from './Knob.svelte';
	import Plug from './Plug.svelte';

	export let node: AllowedSerializedAudioElements;

	const staticDefinition = allowedSerializedAudioElementStaticDefinitions[node.type];

	const parameters = Object.entries(node.parameters ?? {}) as [string, SerializedAudioParameter][];
</script>

<div class="node">
	<div class="header">{node.type}</div>
	<div class="parameters">
		{#each parameters as nodeParameter}
			<Knob parameterName={nodeParameter[0]} parameter={nodeParameter[1]} />
		{/each}
	</div>
	<div class="inputs-and-outputs">
		<div class="inputs">
			{#each staticDefinition.inputs as input}
				<Plug />
			{/each}
		</div>
		<div class="outputs">
			{#each staticDefinition.outputs as output}
				<Plug />
			{/each}
		</div>
	</div>
</div>

<style>
	.node {
		padding: 16px;
		border: 1px solid black;
		display: flex;
		flex-direction: column;
		gap: 16px;
		min-width: 70px;
	}

	.header {
		text-transform: capitalize;
		font-weight: bold;
		text-align: center;
	}

	.parameters {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		gap: 16px;
	}

	.inputs-and-outputs {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.inputs,
	.outputs {
		display: flex;
		flex-grow: 0;
		flex-direction: row;
		gap: 8px;
	}
</style>
