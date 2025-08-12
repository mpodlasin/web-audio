import { updateAudioCanvas, type AudioNodeDatabase } from '../../audio/initialized';
import {
	addConnection,
	addConnectionToParameter,
	addNode,
	changeComment,
	changeParameter,
	changeParameterMultiply,
	changeTutorialSize,
	insertExistingNodes,
	removeConnection,
	removeNode,
	type NodeType,
	type Plug,
	type Position,
	type SerializedAudioElements
} from '../../audio/serialized';
import { changeNodeColor } from '../../ui/changeNodeColor';
import { dragNode } from '../../ui/dragNode';
import type { NotificationStore } from './notifications.svelte';

export class AudioGraph {
	audioNodeDatabase: AudioNodeDatabase = $state({});
	audioGraphHistory: SerializedAudioElements[] = $state([{}]);
	temporaryAction = false;
	temporaryGraph: SerializedAudioElements = $state({});
	audioGraph: SerializedAudioElements = $state({});

	tutorialNodeId = $derived(Object.entries(this.audioGraph).find((entry) => entry[1].type === 'tutorial') ?? [])[0];
	tutorialNode = $derived(Object.entries(this.audioGraph).find((entry) => entry[1].type === 'tutorial') ?? [])[1];

	constructor(
		initialAudioGraph: SerializedAudioElements,
		private onChange: (audioGraph: SerializedAudioElements) => void,
		private notificationsStore: NotificationStore
	) {
		this.audioGraphHistory = [initialAudioGraph];
		this.audioGraph = initialAudioGraph;
		this.audioNodeDatabase = updateAudioCanvas(this.audioGraph, {}, {});
	}

	updateAudioGraphHistory = (map: (a: SerializedAudioElements) => SerializedAudioElements) => {
		try {
			if (this.temporaryAction) {
				const prevTemporaryGraph = this.temporaryGraph;
				this.temporaryGraph = map(this.temporaryGraph);

				this.audioNodeDatabase = updateAudioCanvas(
					this.temporaryGraph,
					prevTemporaryGraph,
					this.audioNodeDatabase
				);

				this.audioGraph = this.temporaryGraph;
			} else {
				const newAudioGraphHistory = [
					...this.audioGraphHistory,
					map(this.audioGraphHistory.at(-1) ?? {})
				];

				if (newAudioGraphHistory.length > 100) {
					this.audioGraphHistory = this.audioGraphHistory.slice(
						this.audioGraphHistory.length - 100
					);
				}

				this.audioGraphHistory = newAudioGraphHistory;
				this.audioGraph = this.audioGraphHistory.at(-1) ?? {};

				this.audioNodeDatabase = updateAudioCanvas(
					this.audioGraphHistory.at(-1) ?? {},
					this.audioGraphHistory.at(-2) ?? {},
					this.audioNodeDatabase
				);

				this.onChange(this.audioGraph);
			}
		} catch (error) {
			if (error instanceof Error) {
				this.notificationsStore.error(error.message);
			} else {
				this.notificationsStore.error('Something went wrong!');
			}
		}
	};

	undo = () => {
		const audioGraph = this.audioGraphHistory.at(-1) ?? {};
		const previousAudioGraph = this.audioGraphHistory.at(-2) ?? {};

		const newAudioGraphHistory = this.audioGraphHistory.slice(0, -1);

		if (newAudioGraphHistory.length < 2) return;

		this.audioGraphHistory = newAudioGraphHistory;

		this.audioNodeDatabase = updateAudioCanvas(
			previousAudioGraph,
			audioGraph,
			this.audioNodeDatabase
		);
	};

	startTemporaryAction = () => {
		this.temporaryAction = true;
		this.temporaryGraph = this.audioGraph;
	};

	endTemporaryAction = () => {
		if (!this.temporaryAction) return;

		this.temporaryAction = false;

		this.audioGraphHistory = [...this.audioGraphHistory, this.temporaryGraph];
		this.audioGraph = this.temporaryGraph;
		this.onChange(this.audioGraph);
	};

	addConnectionToParameter = (startingPlug: Plug, endingPlug: Plug) => {
		this.updateAudioGraphHistory((audioGraph) =>
			addConnectionToParameter(audioGraph, startingPlug, endingPlug)
		);
	};

	addConnection = (startingPlug: Plug, endingPlug: Plug) => {
		this.updateAudioGraphHistory((audioGraph) =>
			addConnection(audioGraph, startingPlug, endingPlug)
		);
	};

	removeConnection = (startingPlug: Plug, endingPlug: Plug) => {
		this.updateAudioGraphHistory((audioGraph) =>
			removeConnection(audioGraph, startingPlug, endingPlug)
		);
	};

	changeParameterMultiply = (
		nodeId: string,
		parameterName: string,
		inputId: string,
		mutliply: number
	) => {
		this.updateAudioGraphHistory((audioGraph) =>
			changeParameterMultiply(audioGraph, nodeId, parameterName, inputId, mutliply)
		);
	};

	changeNodeColor = (nodeId: string, color: string) => {
		this.updateAudioGraphHistory((audioGraph) => changeNodeColor(nodeId, color, audioGraph));
	};

	addNode = (type: NodeType, position?: Position, tutorialId?: string) => {
		this.updateAudioGraphHistory((audioGraph) => addNode(audioGraph, type, position, tutorialId));
	};

	removeNode = (nodeId: string) => {
		this.updateAudioGraphHistory((audioGraph) => removeNode(audioGraph, nodeId));
	};

	insertExistingNodes = (ids: string[], position: Position) => {
		this.updateAudioGraphHistory((audioGraph) => insertExistingNodes(audioGraph, ids, position));
	};

	dragNode = (event: { id: string; x: number; y: number }) => {
		this.updateAudioGraphHistory((audioGraph) => dragNode(event, audioGraph));
	};

	changeParameter = (id: string, parameterName: string, value: number) => {
		this.updateAudioGraphHistory((audioGraph) =>
			changeParameter(audioGraph, id, parameterName, value)
		);
	};

	changeComment = (nodeId: string, comment: string) => {
		this.updateAudioGraphHistory((audioGraph) => changeComment(audioGraph, nodeId, comment));
	};

	changeTutorialSize = (nodeId: string, size: number) => {
		this.updateAudioGraphHistory((audioGraph) => changeTutorialSize(audioGraph, nodeId, size));
	};

	getTutorialNode = () => {
        const [tutorialNodeId, tutorialNode] = $derived(
            Object.entries(this.audioGraph).find((entry) => entry[1].type === 'tutorial') ?? []
        );

		return {
			tutorialNode, tutorialNodeId
		}
    };
}
