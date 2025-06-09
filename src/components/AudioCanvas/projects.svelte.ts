import { goto } from '$app/navigation';

export default function projects({
	tutorialMode,
	onNewProject,
	onProjectChange
}: {
	tutorialMode: boolean;
	onNewProject?(): void;
	onProjectChange?(projectName: string): void;
}) {
	let showProjectsModal = $state(false);

	const handleProjectNameClick = () => {
		if (tutorialMode) {
			goto('/learn');
			return;
		}

		showProjectsModal = true;
	};

	const handleCloseProjectsModal = () => {
		showProjectsModal = false;
	};

	const handleNewProject = () => {
		showProjectsModal = false;
		onNewProject?.();
	};

	const handleProjectChange = (projectName: string) => {
		showProjectsModal = false;
		onProjectChange?.(projectName);
	};

	return {
		showProjectsModal,
		handleProjectNameClick,
		handleCloseProjectsModal,
		handleNewProject,
		handleProjectChange
	};
}
