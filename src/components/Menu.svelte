<script lang="ts">
</script>

<div class="wrapper">
	<slot />
</div>

<style>
	.wrapper {
		border-radius: 8px;
		border-top-left-radius: 0px;
		border: 1px solid var(--neutral-500);
		background-color: var(--neutral-900);

		display: flex;
		flex-direction: column;
		gap: 8px;
		padding: 8px;

		max-width: 140px;
		box-shadow: 3px 4px 19px -5px rgba(0, 0, 0, 0.6);
	}
</style>
