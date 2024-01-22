import type { Position, SerializedAudioElements } from '../audio/serialized';

export interface Project {
	name: string;
	created: string;
	lastChanged: string;
	size: number;
	canvasRelativePosition: Position;
	audioCanvas: SerializedAudioElements;
}

export interface Projects {
	[projectName: string]: Project;
}

export const createProject = (name: string): Project => ({
	name,
	created: new Date(Date.now()).toISOString(),
	lastChanged: new Date(Date.now()).toISOString(),
	audioCanvas: {},
	size: 1,
	canvasRelativePosition: { x: 0, y: 0 }
});
