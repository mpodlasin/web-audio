import type { PlugPositions as PlugPositionsObject } from '../../ui/plugPositions';

export default class PlugPositions {
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
		});
	};

}