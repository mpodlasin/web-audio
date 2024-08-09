<script lang="ts">
	import { goto } from "$app/navigation";
	import { createProject, type Projects } from "../../../ui/project";

	export let data;

	const title = data.title;

	const audioGraphLocalStorageKey = 'audioGraph';

	const projectsString = localStorage.getItem(audioGraphLocalStorageKey);

	let projects: Projects =
		projectsString !== null
			? JSON.parse(projectsString)
			: {};

	if (!projects[title]) {
		projects[title] = createProject(title);

		localStorage.setItem(audioGraphLocalStorageKey, JSON.stringify(projects));
	}

	goto('/playground');
</script>
