export type AudioNodeDatabase = {
	[key: string]: CustomAudioNode;
};

export interface CustomAudioParam {
	audioParam: AudioParam;
	analyser: AnalyserNode;
	getMultiplierForInput(inputId: string): GainNode;
}

export function isCustomAudioParam(
	customAudioParam: unknown
): customAudioParam is CustomAudioParam {
	return (
		typeof customAudioParam === 'object' &&
		customAudioParam !== null &&
		'audioParam' in customAudioParam &&
		'analyser' in customAudioParam
	);
}

export interface CustomAudioNode {
	getParameter(parameterName: string): CustomAudioParam;
	connect(destination: CustomAudioNode | AudioParam | CustomAudioParam, output?: string): void;
	disconnect(
		desination: CustomAudioNode | AudioParam | CustomAudioParam | undefined,
		output?: string
	): void;
}

export function isCustomAudioNode(customAudioNode: unknown): customAudioNode is CustomAudioNode {
	return (
		typeof customAudioNode === 'object' &&
		customAudioNode !== null &&
		'connect' in customAudioNode &&
		'disconnect' in customAudioNode
	);
}

export interface CustomAudioScheduledSourceNode extends CustomAudioNode {
	start(when?: number): void;
	stop(when?: number): void;
}

export function isCustomAudioScheduledSourceNode(
	customAudioNode: CustomAudioNode
): customAudioNode is CustomAudioScheduledSourceNode {
	return 'start' in customAudioNode && 'stop' in customAudioNode;
}

export interface CustomAudioNodeWithWebApiNode<T extends AudioNode = AudioNode>
	extends CustomAudioNode {
	readonly webApiNode: T;
}

export function isCustomAudioNodeWithWebApiNode(
	customAudioNode: CustomAudioNode
): customAudioNode is CustomAudioNodeWithWebApiNode {
	return 'webApiNode' in customAudioNode;
}
