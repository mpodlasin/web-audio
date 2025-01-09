<script lang="ts">
	import { getDefaultColorForNode, type NodeType } from "../../audio/serialized";

    export let nodeType: NodeType;

    $: color = getDefaultColorForNode(nodeType);
</script>

<span style={`color: ${color}`}>
    <pre><slot /></pre>
</span>

<style>
    pre {
        display: inline-block;
        margin: 0;
    }
</style>