<script lang="ts">
	import {
		allowedSerializedAudioElementStaticDefinitions,
		type AllowedSerializedAudioElements,
		type SerializedAudioParameter,
		CustomOscilloscopeNode,
		isCustomAudioNode,
		readableNames,
		getCategoryReadableName,
		EmptyCustomAudioNode,
		type SerializedAudioElements,
		CustomValueNode,
		CustomSpectrumNode,

		type Plug as PlugObject

	} from '../audio/AudioCanvas';
	import Knob from './Knob.svelte';
	import OscilloscopeNode from './OscilloscopeNode.svelte';
	import OnOffButton from './OnOffButton.svelte';
	import TutorialNode from './TutorialNode.svelte';
	import ValueNode from './ValueNode.svelte';
	import CommentNode from './CommentNode.svelte';
	import SpectrumNode from './SpectrumNode.svelte';
	import Plug from './Plug.svelte';

	interface Props {
		id: string;
		node: AllowedSerializedAudioElements;
		instantiatedNode: unknown;
		running: boolean;
		draggingLine: boolean;
		color: string;
		audioGraph: SerializedAudioElements;
		hoveringOverPlug: PlugObject | null;
		onNodeParameterChangeStart?(): void;
		onNodeParamterChange?(event: { id: string; parameterName: string; value: number }): void;
		onNodeParameterChangeEnd?(): void;
		onNodePlugMouseDown?(event: { plugId: string; nodeId: string; type: 'input' | 'output' }): void;
		onNodePlugMouseUp?(event: {
			plugId: string;
			nodeId: string;
			type: 'input' | 'output';
			event: MouseEvent;
		}): void;
		onNodeKnobMouseUp?(event: { nodeId: string; parameterName: string; event: MouseEvent }): void;
		onKnobCreated?(knob: HTMLElement): void;
		onCommentChanged?(event: { nodeId: string; comment: string }): void;
		onPlugCreated?(plug: HTMLElement): void;
	}

	let {
		id,
		node,
		instantiatedNode,
		running,
		draggingLine,
		color,
		audioGraph,
		hoveringOverPlug,
		onNodeParameterChangeEnd,
		onNodeParameterChangeStart,
		onNodeParamterChange,
		onNodePlugMouseDown,
		onNodePlugMouseUp,
		onNodeKnobMouseUp,
		onKnobCreated,
		onCommentChanged,
		onPlugCreated
	}: Props = $props();

	let staticDefinition = $derived(allowedSerializedAudioElementStaticDefinitions[node.type]);
	let showCategory = $derived(staticDefinition.showCategory ?? false);
	let parameters = $derived(
		Object.entries(node.parameters ?? {}) as [string, SerializedAudioParameter][]
	);
	let audioParams = $derived(
		parameters.flatMap(([name]) => {
			if (isCustomAudioNode(instantiatedNode)) {
				return [[name, instantiatedNode.getParameter(name).analyser] as const];
			} else {
				return [];
			}
		})
	);

	let isSpecialNode = $derived(
		(node.type === 'oscilloscope' && instantiatedNode instanceof CustomOscilloscopeNode) ||
			(node.type === 'tutorial' && instantiatedNode instanceof EmptyCustomAudioNode)
	);

	let highlightedParameter = $state('');

	if (isCustomAudioNode(instantiatedNode)) {
		instantiatedNode.onHighlightParameter((parameterName) => {
			highlightedParameter = parameterName;
		});
	}

	let categoryName = $derived(showCategory ? (getCategoryReadableName(node.type) ?? '') : '');

	const handleParameterChangeStart = () => {
		onNodeParameterChangeStart?.();
	};

	const handleParameterChange = (event: { parameterName: string; value: number }) => {
		const parameterName = event.parameterName;
		const value = event.value;

		onNodeParamterChange?.({ id, parameterName, value });
	};

	const handleParameterChangeEnd = () => {
		onNodeParameterChangeEnd?.();
	};

	const handlePlugDown = (event: { id: string; type: 'input' | 'output' }) => {
		const plugId = event.id;
		const type = event.type;

		onNodePlugMouseDown?.({ plugId, nodeId: id, type });
	};

	const handlePlugUp = (event: { id: string; type: 'input' | 'output'; event: PointerEvent }) => {
		const plugId = event.id;
		const type = event.type;
		const underlyingEvent = event.event;

		onNodePlugMouseUp?.({ plugId, type, nodeId: id, event: underlyingEvent });
	};

	let element: HTMLDivElement | undefined = $state();

	const handleKnobMouseUp = (event: { parameterName: string; event: PointerEvent }) => {
		onNodeKnobMouseUp?.({
			nodeId: id,
			parameterName: event.parameterName,
			event: event.event
		});
		handleParameterChangeEnd();
	};
	const handleOnOffButtonChange = (event: { parameterName: string; value: number }) => {
		handleParameterChangeStart();
		handleParameterChange(event);
		handleParameterChangeEnd();
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
							onChange={handleOnOffButtonChange}
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
							discrete={staticDefinition.parameters[nodeParameter[0]]?.discrete}
							{draggingLine}
							nodeId={id}
							onChange={handleParameterChange}
							onMouseDown={handleParameterChangeStart}
							onMouseUp={handleKnobMouseUp}
							{onKnobCreated}
						/>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
	{#if node.type === 'oscilloscope' && instantiatedNode instanceof CustomOscilloscopeNode}
		<div class="special">
			<OscilloscopeNode {id} serializedNode={node} oscilloscopeNode={instantiatedNode} {running} />
		</div>
	{/if}
	{#if node.type === 'spectrum' && instantiatedNode instanceof CustomSpectrumNode}
		<div class="special">
			<SpectrumNode oscilloscopeNode={instantiatedNode} {running} />
		</div>
	{/if}
	{#if node.type === 'value' && instantiatedNode instanceof CustomValueNode}
		<div class="special">
			<ValueNode valueNode={instantiatedNode} {running} />
		</div>
	{/if}
	{#if node.type === 'tutorial' && instantiatedNode instanceof EmptyCustomAudioNode}
		<TutorialNode {node} {audioGraph} />
	{/if}
	{#if node.type === 'comment' && instantiatedNode instanceof EmptyCustomAudioNode}
		<CommentNode {id} {node} {onCommentChanged} />
	{/if}
	<div class="inputs-and-outputs">
		<div class="inputs">
			{#each staticDefinition.inputs as input (input.id + ' - ' + id)}
				<Plug
					type="input"
					id={input.id}
					nodeId={id}
					staticDefinition={input}
					onPlugMouseDown={handlePlugDown}
					onPlugMouseUp={handlePlugUp}
					hoveredOver={hoveringOverPlug?.nodeId === id && hoveringOverPlug.id === input.id && hoveringOverPlug.type === 'input'}
					{onPlugCreated}
				/>
			{/each}
		</div>
		<div class="outputs">
			{#each staticDefinition.outputs as output (output.id + ' - ' + id)}
				<Plug
					type="output"
					id={output.id}
					nodeId={id}
					staticDefinition={output}
					onPlugMouseDown={handlePlugDown}
					onPlugMouseUp={handlePlugUp}
					hoveredOver={hoveringOverPlug?.nodeId === id && hoveringOverPlug.id === output.id && hoveringOverPlug.type === 'output'}
					{onPlugCreated}
				/>
			{/each}
		</div>
	</div>
</div>

<style>
	.node {
		padding: 8px 0 0 0;
		display: flex;
		flex-direction: column;
		gap: 8px;
		min-width: 70px;
		background-color: var(--neutral-900);
		border-radius: 8px;
		box-shadow: 3px 4px 19px -5px rgba(0, 0, 0, 0.6);
		border: 1px solid var(--primary-500);
	}

	.header {
		text-transform: capitalize;
		font-weight: 400;
		text-align: center;
		font-size: 12px;
		font-family: var(--primary-font);

		padding: 4px;

		color: var(--primary-500);
		text-transform: uppercase;
		white-space: nowrap;
	}

	.parameters {
		padding: 0 8px;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		gap: 4px;
	}

	.inputs-and-outputs {
		display: flex;
		flex-direction: row;
		justify-content: space-between;

		gap: 16px;
	}

	.inputs,
	.outputs {
		display: flex;
		flex-grow: 0;
		flex-direction: row;
	}

	.categoryName {
		color: var(--neutral-400);
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
