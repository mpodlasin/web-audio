<script lang="ts">
	import type { AllowedSerializedAudioElements } from "../audio/AudioCanvas";
	import Knob from "./Knob.svelte";

    export let nodeId: string;
	export let node: AllowedSerializedAudioElements;
</script>

<div>
    <div>{node.type} - {nodeId}</div>
    {#each Object.entries(node.parameters ?? {}) as nodeParameter}
        <Knob parameterName={nodeParameter[0]} parameter={1} />
    {/each}
    {#each node.inputs ?? [] as nodeInput}
        <div>
            {#if typeof nodeInput === "string"}
                {nodeInput}
            {:else}
                {nodeInput.id} - {nodeInput.output}
            {/if}
        </div>
    {/each}
</div>