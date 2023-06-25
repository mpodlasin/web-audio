export const settings = {
    lookAheadInMiliseconds: 100,
    updateIntervalInMiliseconds: 25,
    sampling: 44100,

    get lookAheadInSeconds() {
        return this.lookAheadInMiliseconds / 1000;
    }
}
