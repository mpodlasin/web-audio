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
	<Button title="First" onClick={handleClick('First')} />
	<Button title="Second" onClick={handleClick('Seconds')} />
	<Button title="Third" onClick={handleClick('Third')} />
</Menu>
