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

export type Destination = CustomAudioNode | AudioParam | CustomAudioParam | AudioNode;

export interface Output {
	connect(destination: Destination): void;
	disconnect(desination?: Destination): void;
}

export interface CustomAudioNode {
	getOutput(name?: string): Output;
	getInputNode(): AudioNode | null;
	getParameter(parameterName: string): CustomAudioParam;
	disconnect(): void;
	onHighlightParameter(callback: (parameterName: string) => void): void;
}

export function isCustomAudioNode(customAudioNode: unknown): customAudioNode is CustomAudioNode {
	return (
		typeof customAudioNode === 'object' &&
		customAudioNode !== null &&
		'connect' in customAudioNode &&
		'disconnect' in customAudioNode &&
		'getParameter' in customAudioNode &&
		'getInputNode' in customAudioNode &&
		'getOutputNode' in customAudioNode &&
		'onHighlightParameter' in customAudioNode
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
