import type { SerializedAudioElements } from '../audio/serialized';

export interface Project {
	name: string;
	created: Date;
	lastChanged: Date;
	audioCanvas: SerializedAudioElements;
}

export interface Projects {
	[projectName: string]: Project;
}

export const createProject = (name: string): Project => ({
	name,
	created: new Date(Date.now()),
	lastChanged: new Date(Date.now()),
	audioCanvas: {}
});
