<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import {
		allowedSerializedAudioElementStaticDefinitions,
		type AllowedSerializedAudioElements,
		type SerializedAudioParameter
	} from '../audio/AudioCanvas';
	import Knob from './Knob.svelte';
	import Plug from './Plug.svelte';

	export let id: string;
	export let node: AllowedSerializedAudioElements;

	$: staticDefinition = allowedSerializedAudioElementStaticDefinitions[node.type];
	$: parameters = Object.entries(node.parameters ?? {}) as [string, SerializedAudioParameter][];

	const dispatcher = createEventDispatcher();

	let inputPlugPositions: Record<string, { x: number; y: number }> = {};
	let outputPlugPositions: Record<string, { x: number; y: number }> = {};
	let parameterKnobPositions: Record<string, { x: number; y: number }> = {};

	const handlePlug = (event: any) => {
		const id = event.detail.id;
		const x = event.detail.x;
		const y = event.detail.y;
		const type = event.detail.type;

		if (type === 'input') {
			inputPlugPositions[id] = { x, y };
		} else {
			outputPlugPositions[id] = { x, y };
		}
	};

	const handleKnob = (event: any) => {
		const id = event.detail.parameterName;
		const x = event.detail.x;
		const y = event.detail.y;

		parameterKnobPositions[id] = { x, y };
	};

	$: {
		dispatcher('nodePlugAndKnobPositions', {
			id,
			inputPlugPositions,
			outputPlugPositions,
			parameterKnobPositions
		});
	}

	const handleParameterChange = (event: any) => {
		const parameterName = event.detail.parameterName;
		const value = event.detail.value;

		dispatcher('nodeParameterChange', { id, parameterName, value });
	};

	const handlePlugClick = (event: any) => {
		const plugId = event.detail.id;
		const type = event.detail.type;

		dispatcher('nodePlugClick', { id: plugId, type, nodeId: id });
	};

	const handlePlugUp = (event: any) => {
		const plugId = event.detail.id;
		const type = event.detail.type;

		dispatcher('nodePlugUp', { id: plugId, type, nodeId: id });
	};
</script>

<div class="node">
	<div class="header">{node.type}</div>
	<div class="parameters">
		{#each parameters as nodeParameter (nodeParameter[0])}
			<Knob
				parameterName={nodeParameter[0]}
				parameter={nodeParameter[1]}
				on:knob={handleKnob}
				minValue={staticDefinition.parameters[nodeParameter[0]]?.minValue ?? 0}
				maxValue={staticDefinition.parameters[nodeParameter[0]]?.maxValue ?? Infinity}
				unit={staticDefinition.parameters[nodeParameter[0]]?.unit ?? null}
				on:change={handleParameterChange}
			/>
		{/each}
	</div>
	<div class="inputs-and-outputs">
		<div class="inputs">
			{#each staticDefinition.inputs as input (input)}
				<Plug
					type="input"
					id={input}
					on:plug={handlePlug}
					on:click={handlePlugClick}
					on:up={handlePlugUp}
				/>
			{/each}
		</div>
		<div class="outputs">
			{#each staticDefinition.outputs as output (output)}
				<Plug
					type="output"
					id={output}
					on:plug={handlePlug}
					on:click={handlePlugClick}
					on:up={handlePlugUp}
				/>
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
