<script lang="ts">
	import Menu from '../components/Menu.svelte';
	import Button from '../components/Button.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatcher = createEventDispatcher();

	const handleClick = (title: string) => () => {
		dispatcher('click', title);
	};
</script>

<Menu>
	<Button title="First" on:click={handleClick('First')} />
	<Button title="Second" on:click={handleClick('Seconds')} />
	<Button title="Third" on:click={handleClick('Third')} />
</Menu>
