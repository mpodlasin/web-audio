import { globalContext } from '../../audio/GlobalContext';

export class Playing {
	playing = $state(false);

	constructor() {
		$effect(() => {
			if (this.playing) {
				globalContext.resume();
			} else {
				globalContext.suspend();
			}
		});
	}

	handlePlayChange = (event: { playing: boolean }) => {
		this.playing = event.playing;
	};
}
