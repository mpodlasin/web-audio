<script lang="ts">
	import { loadCustomNodes } from '../../audio/web-audio/utils';

	const customNodesPromise = loadCustomNodes();
</script>

<div>
	{#await customNodesPromise}
		<p>Loading...</p>
	{:then}
		<slot />
	{:catch error}
		<p>{error.message}</p>
	{/await}
</div>

<style>
	div {
		margin: auto;
		max-width: 800px;
	}
</style>
