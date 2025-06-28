<script lang="ts">
	import {
		nodeTypes,
		type AllowedSerializedAudioElements,
		type NodeType,
		type Plug,
		type Position,
		type SerializedAudioElements
	} from '../audio/AudioCanvas';
	import Node from './Node.svelte';
	import { DISTANCE_THAT_IS_CONSIDERED_DRAG } from '../constants';
	import AddPlus from '../icons/Add_Plus.svg?component';
	import RemoveMinus from '../icons/Remove_Minus.svg?component';

	interface Props {
		id: string;
		order: number;
		node: AllowedSerializedAudioElements;
		instantiatedNode: unknown;
		color: string;
		position: {
			x: number;
			y: number;
		};
		running: boolean;
		draggingLine: boolean;
		selected: boolean;
		audioGraph: SerializedAudioElements;
		hoveringOverPlug: Plug | null;
		onClick(event: MouseEvent): void;
		onDragStart(): void;
		onDrag(event: { id: string; x: number; y: number }): void;
		onContextMenu(event: { id: string; position: Position; nodeType: NodeType }): void;
		onDragEnd(): void;
		onNodeParameterChangeStart(): void;
		onNodeParamterChange(event: { id: string; parameterName: string; value: number }): void;
		onNodeParameterChangeEnd(): void;
		onNodePlugMouseDown(event: { plugId: string; nodeId: string; type: 'input' | 'output' }): void;
		onNodePlugMouseUp(event: {
			plugId: string;
			nodeId: string;
			type: 'input' | 'output';
			event: MouseEvent;
		}): void;
		onNodeKnobMouseUp(event: { nodeId: string; parameterName: string; event: MouseEvent }): void;
		onKnobCreated(knob: HTMLElement): void;
		onCommentChanged(event: { nodeId: string; comment: string }): void;
		onPlugCreated(plug: HTMLElement): void;
		onNodeCreated(node: HTMLElement): void;
		onTutorialSizeChange(event: { nodeId: string; size: number }): void;
	}

	let {
		id,
		node,
		order,
		instantiatedNode,
		color,
		position,
		running,
		draggingLine,
		selected,
		audioGraph,
		hoveringOverPlug,
		onTutorialSizeChange,
		onDragStart,
		onDrag,
		onDragEnd,
		onContextMenu,
		onClick,
		onCommentChanged,
		onKnobCreated,
		onNodeKnobMouseUp,
		onNodeParameterChangeEnd,
		onNodeParameterChangeStart,
		onNodeParamterChange,
		onNodePlugMouseDown,
		onNodePlugMouseUp,
		onPlugCreated,
		onNodeCreated
	}: Props = $props();

	let htmlNode: HTMLElement | undefined = $state();
	let sentNode = $state(false);

	$effect(() => {
		htmlNode && !sentNode && onNodeCreated(htmlNode);
		sentNode = true;
	});

	let internalClickPosition = {
		x: 0,
		y: 0
	};

	let lastDragPosition: Position | null = null;
	let draggedDistance = 0;

	let resizable = $derived(node.type === 'tutorial');

	let size = $state(1);

	$effect(() => {
		if (node.type === 'tutorial') {
			size = node.size;
		}
	});

	const onMakeStuffBigger = () => {
		size += 0.1;
		onTutorialSizeChange({ nodeId: id, size });
	};

	const onMakeStuffSmaller = () => {
		size -= 0.1;
		onTutorialSizeChange({ nodeId: id, size });
	};

	const handlePointerDown = (event: PointerEvent) => {
		event.stopPropagation();
		event.preventDefault();

		if (event.button === 0) {
			const rect = (event.currentTarget as HTMLDivElement).getBoundingClientRect();
			internalClickPosition = {
				x: event.clientX - rect.left,
				y: event.clientY - rect.top
			};

			onDragStart();

			window.addEventListener('pointermove', handlePointerMove);
		}
	};

	const handlePointerMove = (event: PointerEvent) => {
		event.preventDefault();
		event.stopPropagation();

		if (!lastDragPosition) {
			lastDragPosition = {
				x: event.clientX,
				y: event.clientY
			};
		}

		draggedDistance +=
			Math.abs(event.clientX - lastDragPosition.x) + Math.abs(event.clientY - lastDragPosition.y);

		lastDragPosition = {
			x: event.clientX,
			y: event.clientY
		};

		onDrag({
			id,
			x: event.clientX - internalClickPosition.x,
			y: event.clientY - internalClickPosition.y
		});
	};

	const handlePointerUp = (event: PointerEvent) => {
		event.preventDefault();
		event.stopPropagation();

		window.removeEventListener('pointermove', handlePointerMove);

		const notDragged = draggedDistance < DISTANCE_THAT_IS_CONSIDERED_DRAG;

		draggedDistance = 0;
		lastDragPosition = null;

		if (notDragged) {
			onContextMenu({
				id,
				position: { x: event.clientX, y: event.clientY },
				nodeType: node.type
			});
		}

		onDragEnd();
	};
</script>

<div
	data-order={order}
	onpointerdown={handlePointerDown}
	onpointerup={handlePointerUp}
	oncontextmenu={(e) => e.preventDefault()}
	onclick={onClick}
	onkeydown={() => {}}
	class="wrapper"
	class:selected
	style="position: absolute; left: {position.x}px; top: {position.y}px; transform: scale({size});"
	role="cell"
	tabindex={0}
	bind:this={htmlNode}
>
	<Node
		{id}
		{node}
		nodeOrder={order}
		{instantiatedNode}
		{running}
		{draggingLine}
		{color}
		{audioGraph}
		{hoveringOverPlug}
		{onCommentChanged}
		{onKnobCreated}
		{onNodeKnobMouseUp}
		{onNodeParameterChangeEnd}
		{onNodeParameterChangeStart}
		{onNodeParamterChange}
		{onNodePlugMouseDown}
		{onNodePlugMouseUp}
		{onPlugCreated}
	/>
	{#if resizable}
		<div class="resize">
			<button
				class="minus"
				onclick={onMakeStuffSmaller}
				onpointerdown={(e) => e.stopPropagation()}
				onkeypress={() => {}}
			>
				<RemoveMinus />
			</button>
			<button
				class="plus"
				onclick={onMakeStuffBigger}
				onpointerdown={(e) => e.stopPropagation()}
				onkeypress={() => {}}><AddPlus /></button
			>
		</div>
	{/if}
</div>

<style>
	.wrapper {
		border-radius: 8px;
		position: relative;

		transform-origin: top left;
	}

	.selected {
		outline: 1px solid var(--neutral-300);
	}

	.resize {
		display: flex;
		gap: 8px;
		align-items: center;

		position: absolute;
		top: 12px;
		right: 12px;
	}

	.minus,
	.plus {
		cursor: pointer;
		background: none;
		color: inherit;
		border: none;
		padding: 0;
		font: inherit;
		cursor: pointer;
		outline: inherit;
		padding: 8px 8px 4px 8px;
	}
</style>
