<script lang="ts">
	import type { SerializedAudioParameter } from "../audio/AudioCanvas";

    export let parameterName: string;
    export let parameter: SerializedAudioParameter;

    const numberParameter = typeof parameter === "number" ? parameter : null;
    const inputParameter = typeof parameter === "object" ? parameter : null;
</script>

<div>
    <label for={parameterName}>{parameterName}</label>
    {#if numberParameter}
        <input type="range" id={parameterName} value={numberParameter} />
    {:else if inputParameter}
        <div>connected</div>
    {/if}
</div>