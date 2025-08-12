<script lang="ts">
	import { goto } from '$app/navigation';
	import { example1 } from '../../../examples/example1';
	import { type Projects } from '../../../ui/project';
	import { localStorageItem } from '../../../utils/localStorage.svelte';

	let { data } = $props();

	const title = data.title;

	const projectsItem = localStorageItem('audioGraph', {} as Projects);
	const projects = $derived(projectsItem.value);

	$effect(() => {
		if (!projects[title]) {
			projects[title] = {
				...example1,
				created: new Date().toISOString(),
				lastChanged: new Date().toISOString()
			};
		}
	});

	goto('/playground');
</script>
