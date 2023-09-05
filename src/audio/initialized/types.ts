export interface CustomAudioNode {
	connect(destination: CustomAudioNode | AudioParam, output?: string): void;
	disconnect(desination: CustomAudioNode | AudioParam, output?: string): void;
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
