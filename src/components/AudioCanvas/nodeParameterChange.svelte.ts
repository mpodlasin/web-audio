import type { AudioGraph } from './audioGraph.svelte';

export class NodeParameterChange {
	changingParameter = $state(false);

	constructor(private audioGraphStore: AudioGraph) {}

	handleNodeParameterChangeStart = () => {
		this.changingParameter = true;
		this.audioGraphStore.startTemporaryAction();
	};

	handleNodeParameterChange = (event: { id: string; parameterName: string; value: number }) => {
		const { id, parameterName, value } = event;

		this.audioGraphStore.changeParameter(id, parameterName, value);
	};

	handleNodeParameterChangeEnd = () => {
		this.changingParameter = false;
		this.audioGraphStore.endTemporaryAction();
	};
}
