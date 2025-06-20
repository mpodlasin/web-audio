import type PlugPositions from './plugPositions.svelte';

export class Resize {
	public size: number;

	constructor(
		size: number,
		private plugPositionsStore: PlugPositions,
		private onSizeChange: (size: number) => void
	) {
		this.size = $state(size);
	}

	makeStuffSmaller = () => {
		this.size = this.size - 0.1;

		this.plugPositionsStore.updatePlugPositions();

		this.onSizeChange(this.size);
	};

	makeStuffBigger = () => {
		this.size = this.size + 0.1;

		this.plugPositionsStore.updatePlugPositions();

		this.onSizeChange(this.size);
	};
}
