<script lang="ts">
	import type { SerializedTutorialNode } from "../audio/serialized";
    import Tutorial1 from "./Tutorial/Tutorial1.md";

    const tutorials: Record<string, any> = {
        "Tutorial1": Tutorial1
    };

    export let node: SerializedTutorialNode;

    $: descriptionId = node.descriptionId;

    $: Description = tutorials[descriptionId] ?? Tutorial1;
</script>

<div>
    <Description />
</div>

<style>
    div {
        font-size: 0.8em;
        max-width: 400px;
    }
</style>