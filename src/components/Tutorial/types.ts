import type { SerializedAudioElements } from '../../audio/serialized';

export type TutorialStep = {
	copy: any;
	check: (audioGraph: SerializedAudioElements) => boolean;
};

export type Tutorial = {
	steps: TutorialStep[];
};
