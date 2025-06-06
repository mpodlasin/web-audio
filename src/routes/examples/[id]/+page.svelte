<script lang="ts">
	import { goto } from '$app/navigation';
	import { example1 } from '../../../examples/example1';
	import { type Projects } from '../../../ui/project';

	let { data } = $props();

	const title = data.title;

	const audioGraphLocalStorageKey = 'audioGraph';

	const projectsString = localStorage.getItem(audioGraphLocalStorageKey);

	let projects: Projects = projectsString !== null ? JSON.parse(projectsString) : {};

	if (!projects[title]) {
		projects[title] = {
			...example1,
			created: new Date().toISOString(),
			lastChanged: new Date().toISOString()
		};

		localStorage.setItem(audioGraphLocalStorageKey, JSON.stringify(projects));
	}

	goto('/playground');
</script>
