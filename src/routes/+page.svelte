<script lang="ts">
	import { loadCustomNodes } from '../audio/web-audio/utils';
	import AudioCanvas from '../components/AudioCanvas.svelte';

	const customNodesPromise = loadCustomNodes();
</script>

{#await customNodesPromise}
	Loading...
{:then}
	<AudioCanvas />
{/await}
