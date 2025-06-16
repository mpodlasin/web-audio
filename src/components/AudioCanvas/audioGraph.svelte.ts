import { updateAudioCanvas, type AudioNodeDatabase } from "../../audio/initialized";
import { addConnection, addConnectionToParameter, addNode, changeParameterMultiply, insertExistingNodes, removeConnection, type NodeType, type Plug, type Position, type SerializedAudioElements } from "../../audio/serialized";
import { changeNodeColor } from "../../ui/changeNodeColor";

export class AudioGraph {
    audioNodeDatabase: AudioNodeDatabase = $state({});

	audioGraphHistory: SerializedAudioElements[] = $state([{}]);
	temporaryGraphHistory: SerializedAudioElements[] = $state([]);
	audioGraph = $derived(this.temporaryGraphHistory.at(-1) ?? this.audioGraphHistory.at(-1) ?? {});

	updateAudioGraphHistory = (
		map: (a: SerializedAudioElements) => SerializedAudioElements
	) => {
		if (this.temporaryGraphHistory.length >= 2) {
			this.temporaryGraphHistory = [...this.temporaryGraphHistory, map(this.temporaryGraphHistory.at(-1) ?? {})];

			this.audioNodeDatabase = updateAudioCanvas(
				this.temporaryGraphHistory.at(-1) ?? {},
				this.temporaryGraphHistory.at(-2) ?? {},
				this.audioNodeDatabase
			);
		} else {
			const newAudioGraphHistory = [...this.audioGraphHistory, map(this.audioGraphHistory.at(-1) ?? {})];

			if (newAudioGraphHistory.length > 100) {
				this.audioGraphHistory =this.audioGraphHistory.slice(this.audioGraphHistory.length - 100);
			}

			this.audioGraphHistory = newAudioGraphHistory;

			this.audioNodeDatabase = updateAudioCanvas(
				this.audioGraphHistory.at(-1) ?? {},
				this.audioGraphHistory.at(-2) ?? {},
				this.audioNodeDatabase
			);
		}
	};

    undo = () => {
		const audioGraph = this.audioGraphHistory.at(-1) ?? {};
		const previousAudioGraph = this.audioGraphHistory.at(-2) ?? {};

		const newAudioGraphHistory = this.audioGraphHistory.slice(0, -1);

		if (newAudioGraphHistory.length < 2) return;

		this.audioGraphHistory = newAudioGraphHistory;

		this.audioNodeDatabase = updateAudioCanvas(previousAudioGraph, audioGraph, this.audioNodeDatabase);
	};

	startTemporaryAction = () => {
		this.temporaryGraphHistory = [this.audioGraph, this.audioGraph];
	};

	endTemporaryAction = () => {
		const temp = this.temporaryGraphHistory.at(-1);
		if (temp) {
			this.audioGraphHistory = [...this.audioGraphHistory, temp];
		}
		this.temporaryGraphHistory = [];
	};

    addConnectionToParameter = (startingPlug: Plug, endingPlug: Plug) => {
        this.updateAudioGraphHistory((audioGraph) =>
            addConnectionToParameter(audioGraph, startingPlug, endingPlug)
        );
    }

    addConnection = (startingPlug: Plug, endingPlug: Plug) => {
        this.updateAudioGraphHistory((audioGraph) =>
            addConnection(audioGraph, startingPlug, endingPlug)
        );
    }

    removeConnection = (startingPlug: Plug, endingPlug: Plug) => {
		this.updateAudioGraphHistory((audioGraph) =>
			removeConnection(audioGraph, startingPlug, endingPlug)
		);
	};

    changeParameterMultiply = (nodeId: string, parameterName: string, inputId: string, mutliply: number) => {
		this.updateAudioGraphHistory((audioGraph) =>
			changeParameterMultiply(audioGraph, nodeId, parameterName, inputId, mutliply)
		);
    }

    changeNodeColor = (nodeId: string, color: string) => {
        this.updateAudioGraphHistory((audioGraph) =>
            changeNodeColor(nodeId, color, audioGraph)
        );
    }

    addNode = (type: NodeType,
        position?: Position,
        tutorialId?: string,) => {
        this.updateAudioGraphHistory((audioGraph) =>
			addNode(audioGraph, type, position, tutorialId)
		);
    }

    insertExistingNodes= (ids: string[], position: Position) => {
        this.updateAudioGraphHistory((audioGraph) =>
			insertExistingNodes(audioGraph, ids, position)
		);
    }
}