import { goto } from '$app/navigation';

export class Projects {
	public showProjectsModal = $state(false);

	constructor(
		private tutorialMode: boolean,
		private onNewProject?: () => void,
		private onProjectChange?: (projectName: string) => void
	) {}

	handleProjectNameClick = () => {
		if (this.tutorialMode) {
			goto('/learn');
			return;
		}

		this.showProjectsModal = true;
	}


	handleCloseProjectsModal = () => {
		this.showProjectsModal = false;
	}

	handleNewProject = () => {
		this.showProjectsModal = false;
		this.onNewProject?.();
	};

	handleProjectChange = (projectName: string) => {
		this.showProjectsModal = false;
		this.onProjectChange?.(projectName);
	};
}
