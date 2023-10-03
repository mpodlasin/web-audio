export const settings = {
	lookAheadInMiliseconds: 100,
	updateIntervalInMiliseconds: 25,
	sampleRate: 44100,

	get lookAheadInSeconds() {
		return this.lookAheadInMiliseconds / 1000;
	}
};
