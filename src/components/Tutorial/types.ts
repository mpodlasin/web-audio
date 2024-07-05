import type { SerializedAudioElements } from '../../audio/serialized';

export type TutorialStep = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	copy: any;
	check: ((audioGraph: SerializedAudioElements) => boolean) | boolean;
};

export type Tutorial = {
	steps: TutorialStep[];
};
