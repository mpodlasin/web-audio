import { allowedSerializedAudioElementStaticDefinitions, type Plug } from '../../audio/serialized';
import type { PlugPositions as PlugPositionsObject } from '../../ui/plugPositions';
import type { AudioGraph } from './audioGraph.svelte';

export default class PlugPositions {
	private numberOfNodes = -1;

	constructor(private audioGraphStore: AudioGraph) {
		this.numberOfNodes = $derived(Object.keys(this.audioGraphStore.audioGraph).length);
	}

	plugPositions: PlugPositionsObject = $state({});
	plugs: HTMLElement[] = [];
	knobs: HTMLElement[] = [];

	andlePlugCreated = (event: HTMLElement) => {
		this.plugs = [...this.plugs, event];
	};

	handleKnobCreated = (event: HTMLElement) => {
		this.knobs = [...this.knobs, event];
	};

	getPlugPositions = (): PlugPositionsObject => {
		const plugPositions: PlugPositionsObject = {};

		this.plugs.forEach((plug) => {
			const id = plug.getAttribute('data-id');
			const nodeId = plug.getAttribute('data-node-id');
			const type = plug.getAttribute('data-type') as 'input' | 'output' | null;

			if (!id) return;
			if (!nodeId) return;
			if (!type) return;

			const rect = plug.getBoundingClientRect();

			if (!plugPositions[nodeId]) {
				plugPositions[nodeId] = {
					inputPlugPositions: {},
					outputPlugPositions: {},
					parameterKnobPositions: {}
				};
			}

			if (type === 'input') {
				plugPositions[nodeId].inputPlugPositions[id] = {
					x: rect.left + rect.width / 2,
					y: rect.top + rect.height / 2
				};
			} else {
				plugPositions[nodeId].outputPlugPositions[id] = {
					x: rect.left + rect.width / 2,
					y: rect.top + rect.height / 2
				};
			}
		});

		this.knobs.forEach((knob) => {
			const nodeId = knob.getAttribute('data-node-id');
			const parameterName = knob.getAttribute('data-parameter-name');

			if (!nodeId) return;
			if (!parameterName) return;

			const rect = knob.getBoundingClientRect();

			if (!plugPositions[nodeId]) {
				plugPositions[nodeId] = {
					inputPlugPositions: {},
					outputPlugPositions: {},
					parameterKnobPositions: {}
				};
			}

			plugPositions[nodeId].parameterKnobPositions[parameterName] = {
				x: rect.left + rect.width / 2,
				y: rect.top + rect.height / 2
			};
		});

		return plugPositions;
	};

	updatePlugPositions = () => {
		requestAnimationFrame(() => {
			this.plugPositions = this.getPlugPositions();
			this.rectangles = this.sortedPassedDownNodes.map((node) => node.getBoundingClientRect());
		});
	};

	private inputPlugMasks = $derived(
		Object.entries(this.plugPositions).flatMap(([nodeId, plugPositions]) => {
			const nodeKeys = Object.keys(this.audioGraphStore.audioGraph);
			const nodeOrder = nodeKeys.indexOf(nodeId);
			return Object.entries(plugPositions.inputPlugPositions).flatMap(([plugId, position]) => {
				return {
					nodeOrder,
					nodeId,
					plugId,
					position,
					type: 'input' as const
				};
			});
		})
	);

	private outputPlugMasks = $derived(
		Object.entries(this.plugPositions).flatMap(([nodeId, plugPositions]) => {
			const nodeKeys = Object.keys(this.audioGraphStore.audioGraph);
			const nodeOrder = nodeKeys.indexOf(nodeId);
			return Object.entries(plugPositions.outputPlugPositions).flatMap(([plugId, position]) => {
				return {
					nodeOrder,
					nodeId,
					plugId,
					position,
					type: 'output' as const
				};
			});
		})
	);

	knobMasks = $derived(
		Object.entries(this.plugPositions).flatMap(([nodeId, plugPositions]) => {
			const nodeKeys = Object.keys(this.audioGraphStore.audioGraph);
			const nodeOrder = nodeKeys.indexOf(nodeId);
			return Object.entries(plugPositions.parameterKnobPositions).flatMap(([knobId, position]) => {
				return {
					nodeOrder,
					nodeId,
					knobId,
					position
				};
			});
		})
	);

	_plugMasks = $derived([...this.inputPlugMasks, ...this.outputPlugMasks]);

	plugMasks = $derived(
		this._plugMasks.filter((plugMask) => {
			return !this.rectangles.some(
				(rectangle, rectangleIndex) =>
					plugMask.nodeOrder < rectangleIndex &&
					rectangle.y - 15 <= plugMask.position.y &&
					plugMask.position.y - 15 <= rectangle.y + rectangle.height &&
					rectangle.x - 15 <= plugMask.position.x &&
					plugMask.position.x - 15 <= rectangle.x + rectangle.width
			);
		})
	);

	hoveringOverPlug: Plug | null = $state(null);

	handleHoveringOverPlugMask = (plug: Plug | null) => {
		this.hoveringOverPlug = plug;
	};

	_knobMasksWithData = $derived(
		this.knobMasks.flatMap((mask) => {
			const node = this.audioGraphStore.audioGraph[mask.nodeId];
			const nodeKeys = Object.keys(this.audioGraphStore.audioGraph);
			const nodeOrder = nodeKeys.indexOf(mask.nodeId);

			if (!node) return [];

			const parameter = node?.parameters[mask.knobId];

			if (!parameter) return [];

			const staticParameter =
				allowedSerializedAudioElementStaticDefinitions[node.type].parameters[mask.knobId];

			if (!staticParameter) return [];

			return [
				{
					parameterName: mask.knobId,
					nodeId: mask.nodeId,
					nodeOrder,
					parameter,
					...staticParameter,
					position: mask.position
				}
			];
		})
	);

	nodes: HTMLElement[] = $state([]);
	passedDownNodes = $derived(this.nodes.length === this.numberOfNodes ? this.nodes : []);
	sortedPassedDownNodes = $derived(
		[...this.passedDownNodes].sort((a, b) => {
			const aOrder = a.getAttribute('data-order');
			const bOrder = b.getAttribute('data-order');

			if (aOrder && bOrder) {
				const aOrderInt = parseInt(aOrder, 10);
				const bOrderInt = parseInt(bOrder, 10);

				return aOrderInt < bOrderInt ? -1 : 1;
			} else {
				return 0;
			}
		})
	);

	rectangles: DOMRect[] = $state([]);

	knobMasksWithData = $derived(
		this._knobMasksWithData.filter((mask) => {
			return !this.rectangles.some(
				(rectangle, rectangleIndex) =>
					mask.nodeOrder < rectangleIndex &&
					rectangle.y - 26 <= mask.position.y &&
					mask.position.y - 26 <= rectangle.y + rectangle.height &&
					rectangle.x - 26 <= mask.position.x &&
					mask.position.x - 26 <= rectangle.x + rectangle.width
			);
		})
	);

	handleNodeCreated = (node: HTMLElement) => {
		this.nodes.push(node);
	};
}
