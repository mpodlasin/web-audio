interface ReverbGenParams {
	audioContext?: AudioContext;
	sampleRate?: number;
	numChannels?: number;
	decayTime: number;
	fadeInTime?: number;
	lpFreqStart?: number;
	lpFreqEnd?: number;
}

function applyGradualLowpass(
	input: AudioBuffer,
	lpFreqStart: number,
	lpFreqEnd: number,
	lpFreqEndAt: number,
	callback: (output: AudioBuffer) => void
): void {
	if (lpFreqStart === 0) {
		callback(input);
		return;
	}
	const channelData = getAllChannelData(input);
	const context = new OfflineAudioContext(
		input.numberOfChannels,
		channelData[0]?.length ?? 0,
		input.sampleRate
	);
	const player = context.createBufferSource();
	player.buffer = input;
	const filter = context.createBiquadFilter();

	lpFreqStart = Math.min(lpFreqStart, input.sampleRate / 2);
	lpFreqEnd = Math.min(lpFreqEnd, input.sampleRate / 2);

	filter.type = 'lowpass';
	filter.Q.value = 0.0001;
	filter.frequency.setValueAtTime(lpFreqStart, 0);
	filter.frequency.linearRampToValueAtTime(lpFreqEnd, lpFreqEndAt);

	player.connect(filter);
	filter.connect(context.destination);
	player.start();
	context.oncomplete = (event) => {
		callback(event.renderedBuffer);
	};
	context.startRendering();
}

function getAllChannelData(buffer: AudioBuffer): Float32Array[] {
	const channels: Float32Array[] = [];
	for (let i = 0; i < buffer.numberOfChannels; i++) {
		channels[i] = buffer.getChannelData(i);
	}
	return channels;
}

function randomSample(): number {
	return Math.random() * 2 - 1;
}

export function generateReverb(
	params: ReverbGenParams,
	callback: (impulseResponse: AudioBuffer) => void
): void {
	const audioContext = params.audioContext || new AudioContext();
	const sampleRate = params.sampleRate || 44100;
	const numChannels = params.numChannels || 2;
	const totalTime = params.decayTime * 1.5;
	const decaySampleFrames = Math.round(params.decayTime * sampleRate);
	const numSampleFrames = Math.round(totalTime * sampleRate);
	const fadeInSampleFrames = Math.round((params.fadeInTime || 0) * sampleRate);
	const decayBase = Math.pow(1 / 1000, 1 / decaySampleFrames);
	const reverbIR = audioContext.createBuffer(numChannels, numSampleFrames, sampleRate);
	for (let i = 0; i < numChannels; i++) {
		const chan = reverbIR.getChannelData(i);
		for (let j = 0; j < numSampleFrames; j++) {
			chan[j] = randomSample() * Math.pow(decayBase, j);
		}
		for (let j = 0; j < fadeInSampleFrames; j++) {
			chan[j] *= j / fadeInSampleFrames;
		}
	}
	applyGradualLowpass(
		reverbIR,
		params.lpFreqStart || 0,
		params.lpFreqEnd || 0,
		params.decayTime,
		callback
	);
}
