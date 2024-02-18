<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import {
		allowedSerializedAudioElementStaticDefinitions,
		type AllowedSerializedAudioElements,
		type SerializedAudioParameter,
		CustomOscilloscopeNode,
		isCustomAudioNode,
		readableNames,
		getCategoryReadableName,
		EmptyCustomAudioNode,
		type SerializedAudioElements
	} from '../audio/AudioCanvas';
	import Knob from './Knob.svelte';
	import Plug from './Plug.svelte';
	import OscilloscopeNode from './OscilloscopeNode.svelte';
	import OnOffButton from './OnOffButton.svelte';
	import TutorialNode from './TutorialNode.svelte';

	export let id: string;
	export let node: AllowedSerializedAudioElements;
	export let instantiatedNode: unknown;
	export let running: boolean;
	export let draggingLine: boolean;
	export let color: string | undefined;
	export let audioGraph: SerializedAudioElements;

	$: staticDefinition = allowedSerializedAudioElementStaticDefinitions[node.type];
	$: showCategory = staticDefinition.showCategory ?? false;
	$: parameters = Object.entries(node.parameters ?? {}) as [string, SerializedAudioParameter][];
	$: audioParams = parameters.flatMap(([name]) => {
		if (isCustomAudioNode(instantiatedNode)) {
			return [[name, instantiatedNode.getParameter(name).analyser] as const];
		} else {
			return [];
		}
	});

	$: isSpecialNode =
		(node.type === 'oscilloscope' && instantiatedNode instanceof CustomOscilloscopeNode) ||
		(node.type === 'tutorial' && instantiatedNode instanceof EmptyCustomAudioNode);

	let highlightedParameter = '';

	if (isCustomAudioNode(instantiatedNode)) {
		instantiatedNode.onHighlightParameter((parameterName) => {
			highlightedParameter = parameterName;
		});
	}

	const dispatcher = createEventDispatcher();

	$: categoryName = showCategory ? getCategoryReadableName(node.type) ?? '' : '';

	const handleParameterChangeStart = () => {
		dispatcher('nodeParameterChangeStart');
	};

	const handleParameterChange = (event: CustomEvent<{ parameterName: string; value: number }>) => {
		const parameterName = event.detail.parameterName;
		const value = event.detail.value;

		dispatcher('nodeParameterChange', { id, parameterName, value });
	};

	const handlePlugClick = (event: CustomEvent<{ id: string; type: string }>) => {
		const plugId = event.detail.id;
		const type = event.detail.type;

		dispatcher('nodePlugClick', { id: plugId, type, nodeId: id });
	};

	const handlePlugUp = (event: CustomEvent<{ id: string; type: string; event: PointerEvent }>) => {
		const plugId = event.detail.id;
		const type = event.detail.type;
		const underlyingEvent = event.detail.event;

		dispatcher('nodePlugUp', { id: plugId, type, nodeId: id, event: underlyingEvent });
	};

	let element: HTMLDivElement;

	const handleKnobMouseUp = (
		event: CustomEvent<{ parameterName: string; event: PointerEvent }>
	) => {
		dispatcher('knobMouseUp', {
			nodeId: id,
			parameterName: event.detail.parameterName,
			event: event.detail.event
		});
	};
</script>

<div class="node" bind:this={element} style={color ? `--primary-500: ${color};` : ''} data-node>
	<div class="header">
		{#if categoryName}
			<span class="categoryName">{categoryName} / </span>
		{/if}
		{readableNames[node.type]}
	</div>
	{#if !isSpecialNode}
		<div class="parameters">
			{#each parameters as nodeParameter (nodeParameter[0])}
				<div class="parameter-wrapper" class:highlight={highlightedParameter === nodeParameter[0]}>
					{#if staticDefinition.parameters[nodeParameter[0]]?.binary}
						<OnOffButton
							active={nodeParameter[1].base === 1}
							label={nodeParameter[0]}
							on:change={handleParameterChange}
						/>
					{:else}
						<Knob
							audioParamAnalyser={audioParams.find((a) => a[0] === nodeParameter[0])?.[1]}
							parameterName={nodeParameter[0]}
							parameter={nodeParameter[1]}
							defaultValue={staticDefinition.parameters[nodeParameter[0]]?.defaultValue ?? 0}
							minValue={staticDefinition.parameters[nodeParameter[0]]?.minValue ?? 0}
							maxValue={staticDefinition.parameters[nodeParameter[0]]?.maxValue ?? Infinity}
							unit={staticDefinition.parameters[nodeParameter[0]]?.unit ?? null}
							polarity={staticDefinition.parameters[nodeParameter[0]]?.polarity ?? 'uni'}
							linear={staticDefinition.parameters[nodeParameter[0]]?.linear}
							{draggingLine}
							nodeId={id}
							on:change={handleParameterChange}
							on:mousedown={handleParameterChangeStart}
							on:mouseup={handleKnobMouseUp}
							on:knobCreated
						/>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
	{#if node.type === 'oscilloscope' && instantiatedNode instanceof CustomOscilloscopeNode}
		<div class="special">
			<OscilloscopeNode
				{id}
				serializedNode={node}
				oscilloscopeNode={instantiatedNode}
				{running}
				on:nodeParameterChange
			/>
		</div>
	{/if}
	{#if node.type === 'tutorial' && instantiatedNode instanceof EmptyCustomAudioNode}
		<TutorialNode {node} {audioGraph} />
	{/if}
	<div class="inputs-and-outputs">
		<div class="inputs">
			{#each staticDefinition.inputs as input (input.id)}
				<Plug
					type="input"
					id={input.id}
					nodeId={id}
					staticDefinition={input}
					on:click={handlePlugClick}
					on:up={handlePlugUp}
					on:plugCreated
				/>
			{/each}
		</div>
		<div class="outputs">
			{#each staticDefinition.outputs as output (output.id)}
				<Plug
					type="output"
					id={output.id}
					nodeId={id}
					staticDefinition={output}
					on:click={handlePlugClick}
					on:up={handlePlugUp}
					on:plugCreated
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
		background-color: var(--neutral-900);
		border: 1px solid var(--primary-500);
		border-radius: 8px;
		box-shadow: 3px 4px 19px -5px rgba(0, 0, 0, 0.6);
	}

	.header {
		text-transform: capitalize;
		font-weight: bold;
		text-align: center;
		font-size: 12px;

		color: var(--primary-500);
		text-transform: uppercase;
		white-space: nowrap;
	}

	.parameters {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
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

	.categoryName {
		color: var(--neutral-500);
	}

	.parameter-wrapper {
		padding: 4px;
		padding-bottom: 8px;
		border-bottom: 1px solid transparent;
		transition: border-bottom-color 0.1s;
	}

	.highlight {
		border-bottom-color: var(--primary-500);
	}
</style>
