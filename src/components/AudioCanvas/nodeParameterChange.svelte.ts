import type { AudioGraph } from './audioGraph.svelte';

export class NodeParameterChange {
	constructor(private audioGraphStore: AudioGraph) {}

	handleNodeParameterChangeStart = () => {
		this.audioGraphStore.startTemporaryAction();
	};

	handleNodeParameterChange = (event: { id: string; parameterName: string; value: number }) => {
		const { id, parameterName, value } = event;

		this.audioGraphStore.changeParameter(id, parameterName, value);
	};

	handleNodeParameterChangeEnd = () => {
		this.audioGraphStore.endTemporaryAction();
	};
}
