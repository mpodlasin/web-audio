import { settings } from './settings';

export const globalContext = new AudioContext({
	sampleRate: settings.sampleRate
});
