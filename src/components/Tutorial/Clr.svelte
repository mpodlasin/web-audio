<script lang="ts">
	import { getDefaultColorForNode, type NodeType } from '../../audio/serialized';

	interface Props {
		nodeType: NodeType;
		children?: import('svelte').Snippet;
	}

	let { nodeType, children }: Props = $props();

	let color = $derived(getDefaultColorForNode(nodeType));
</script>

<span style={`color: ${color}`}>
	<pre>{@render children?.()}</pre>
</span>

<style>
	pre {
		display: inline-block;
		margin: 0;
	}
</style>
