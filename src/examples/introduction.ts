import type { SerializedAudioElements } from '../audio/serialized';

export const introductionExample: SerializedAudioElements = {
	'a99db6f6-91a5-4e51-96bd-b1429a3d3ee5': {
		type: 'destination',
		inputs: ['068ac265-2a6f-4602-83bf-4badc3c05734'],
		ui: { position: { x: 1525, y: 1050 }, primmaryColor: '#b7c3e6' },
		parameters: {}
	},
	'068ac265-2a6f-4602-83bf-4badc3c05734': {
		type: 'gain',
		inputs: ['045f466a-f5fe-41bc-8e55-0d4e7db9682f'],
		ui: { position: { x: 1365, y: 832 }, primmaryColor: '#ff4747' },
		parameters: { gain: { base: 0.28518518518518526, inputs: [] } }
	},
	'c30c19a6-a225-4942-808f-2964680d82e7': {
		type: 'saw-oscillator',
		inputs: [],
		ui: { position: { x: 608, y: 813 }, primmaryColor: '#45c7ff' },
		parameters: {
			frequency: {
				base: 0,
				inputs: [{ id: '478f53d3-84cf-4c2f-aa92-7e5e873a03e4', output: 'frequency', multiply: 1 }]
			},
			detune: {
				base: 0,
				inputs: [{ id: '28593998-29d3-4306-a35d-0d8f008b42f6', output: 'audio', multiply: 1 }]
			}
		}
	},
	'c47c34f0-9b40-4c6f-b57c-a1c7c631c45c': {
		type: 'sequencer',
		inputs: ['281d6ee5-a49b-406c-b3d9-3b47992c8444'],
		ui: { position: { x: -260, y: 708 }, primmaryColor: '#ffe747' },
		parameters: {
			frequency1: { base: 171.6814187096731, inputs: [] },
			frequency2: {
				base: 604.8603196880302,
				inputs: [{ id: 'b6b55c05-06a2-4732-b37a-afb0e1b8306a', output: 'audio', multiply: 1 }]
			},
			frequency3: { base: 244.07137438971765, inputs: [] },
			frequency4: { base: 627.9766225963735, inputs: [] },
			frequency5: {
				base: 458.72371917385635,
				inputs: [{ id: '197b52d5-b02a-4e1c-846f-5966fa33eae4', output: 'audio', multiply: 1 }]
			},
			frequency6: { base: 571.2605373724408, inputs: [] },
			frequency7: { base: 315.5383590518763, inputs: [] },
			frequency8: { base: 109.66296270783549, inputs: [] }
		}
	},
	'fa70d143-c8ac-4abe-b3a0-15192dab673d': {
		type: 'trigger',
		inputs: [],
		ui: { position: { x: 599, y: 454 }, primmaryColor: '#fd783f' },
		parameters: { tempo: { base: 208.78369639286393, inputs: [] } }
	},
	'e88aefba-3a4b-4d56-9a75-eeee18ce947d': {
		type: 'lowpass-filter',
		inputs: ['c30c19a6-a225-4942-808f-2964680d82e7'],
		ui: { position: { x: 891, y: 680 }, primmaryColor: '#4754ff' },
		parameters: {
			frequency: {
				base: 23.703703703703702,
				inputs: [{ id: '0e42d913-67bc-441f-bccb-78bf55193622', output: 'audio', multiply: 1 }]
			},
			resonance: { base: 0.18111135572904627, inputs: [] }
		}
	},
	'478f53d3-84cf-4c2f-aa92-7e5e873a03e4': {
		type: 'pitch-quantizer',
		inputs: ['c47c34f0-9b40-4c6f-b57c-a1c7c631c45c'],
		ui: { position: { x: 16, y: 965 }, primmaryColor: '#ffe747' },
		parameters: {
			A: { base: 1, inputs: [] },
			'A#': { base: 0, inputs: [] },
			B: { base: 0, inputs: [] },
			C: { base: 1, inputs: [] },
			'C#': { base: 0, inputs: [] },
			D: { base: 1, inputs: [] },
			'D#': { base: 0, inputs: [] },
			E: { base: 1, inputs: [] },
			F: { base: 1, inputs: [] },
			'F#': { base: 0, inputs: [] },
			G: { base: 0, inputs: [] },
			'G#': { base: 0, inputs: [] }
		}
	},
	'274341ac-aa7a-44dd-ae17-1bd669a46285': {
		type: 'ad-envelope',
		inputs: ['84ee0a7a-6ff1-4f22-b127-ce30da860650'],
		ui: { position: { x: 507, y: 1131 }, primmaryColor: '#47ff8e' },
		parameters: {
			attack: { base: 4.130053947663056, inputs: [] },
			decay: { base: 165.39245150458783, inputs: [] }
		}
	},
	'0e42d913-67bc-441f-bccb-78bf55193622': {
		type: 'multiply',
		inputs: ['274341ac-aa7a-44dd-ae17-1bd669a46285'],
		ui: { position: { x: 864, y: 963 }, primmaryColor: '#b7c3e6' },
		parameters: {
			factor: {
				base: 60.502926623839954,
				inputs: [{ id: '4337ea4d-ee53-4376-ae21-800c4f8a19a5', output: 'audio', multiply: 1 }]
			}
		}
	},
	'0e4ff381-4a6d-42d7-9122-3e89c99ba9ff': {
		type: 'oscilloscope',
		inputs: ['274341ac-aa7a-44dd-ae17-1bd669a46285'],
		ui: { position: { x: 767, y: 1391 }, primmaryColor: '#b7c3e6' },
		parameters: {}
	},
	'adfde5be-72d6-4420-848c-99830b6aed95': {
		type: 'delay',
		inputs: [
			{ id: 'd511888a-ea1b-46e6-a7f8-1325535d7e3a', output: 'trigger', input: 'trigger' },
			{ id: '875fd442-c386-4e8d-8d99-b7b8d8981538', output: 'audio', input: 'audio' }
		],
		ui: { position: { x: 1229, y: 99 }, primmaryColor: '#4754ff' },
		parameters: {
			delayTime: { base: 0, inputs: [] },
			feedback: { base: 0.6395061728395063, inputs: [] },
			mix: { base: 0.4185185185185186, inputs: [] }
		}
	},
	'045f466a-f5fe-41bc-8e55-0d4e7db9682f': {
		type: 'convolution',
		inputs: ['adfde5be-72d6-4420-848c-99830b6aed95'],
		ui: { position: { x: 1561, y: 557 }, primmaryColor: '#4754ff' },
		parameters: { mix: { base: 0.37777777777777793, inputs: [] } }
	},
	'875fd442-c386-4e8d-8d99-b7b8d8981538': {
		type: 'highpass-filter',
		inputs: ['e88aefba-3a4b-4d56-9a75-eeee18ce947d'],
		ui: { position: { x: 1136, y: 678 }, primmaryColor: '#4754ff' },
		parameters: {
			frequency: { base: 157.31308515873266, inputs: [] },
			resonance: { base: 0, inputs: [] }
		}
	},
	'28593998-29d3-4306-a35d-0d8f008b42f6': {
		type: 'sine-lfo',
		inputs: [],
		ui: { position: { x: 1021, y: 960 }, primmaryColor: '#45c7ff' },
		parameters: {
			frequency: { base: 0.13732192368262366, inputs: [] },
			multiply: { base: 14.460617454510444, inputs: [] },
			unipolar: { base: 1, inputs: [] },
			negate: { base: 0, inputs: [] }
		}
	},
	'84ee0a7a-6ff1-4f22-b127-ce30da860650': {
		type: 'pattern',
		inputs: ['fa70d143-c8ac-4abe-b3a0-15192dab673d'],
		ui: { position: { x: -21, y: 492 }, primmaryColor: '#fd783f' },
		parameters: {
			step1: { base: 1, inputs: [] },
			step2: { base: 1, inputs: [] },
			step3: { base: 0, inputs: [] },
			step4: { base: 1, inputs: [] },
			step5: { base: 1, inputs: [] },
			step6: { base: 0, inputs: [] },
			step7: { base: 1, inputs: [] },
			step8: { base: 1, inputs: [] }
		}
	},
	'71b6057a-3799-46c8-b3ee-0e97bdb94be1': {
		type: 'gate-length',
		inputs: ['fa70d143-c8ac-4abe-b3a0-15192dab673d'],
		ui: { position: { x: 449, y: 398 }, primmaryColor: '#fd783f' },
		parameters: { length: { base: 0.05978591456747491, inputs: [] } }
	},
	'11a510e4-4251-4ef7-b4be-da9f16f867de': {
		type: 'oscilloscope',
		inputs: ['71b6057a-3799-46c8-b3ee-0e97bdb94be1'],
		ui: { position: { x: 765, y: 75 }, primmaryColor: '#b7c3e6' },
		parameters: {}
	},
	'339d8700-b471-4526-ad9e-fa8a6b5ac7e1': {
		type: 'gate-length',
		inputs: ['84ee0a7a-6ff1-4f22-b127-ce30da860650'],
		ui: { position: { x: 18, y: 126 } },
		parameters: { length: { base: 0.4529987109711145, inputs: [] } }
	},
	'b2ecb3e0-adec-4f6c-90c2-0874a286c42c': {
		type: 'oscilloscope',
		inputs: ['339d8700-b471-4526-ad9e-fa8a6b5ac7e1'],
		ui: { position: { x: 293, y: 70 }, primmaryColor: '#b7c3e6' },
		parameters: {}
	},
	'281d6ee5-a49b-406c-b3d9-3b47992c8444': {
		type: 'pattern',
		inputs: ['84ee0a7a-6ff1-4f22-b127-ce30da860650'],
		ui: { position: { x: -528, y: 500 }, primmaryColor: '#fd783f' },
		parameters: {
			step1: { base: 1, inputs: [] },
			step2: { base: 0, inputs: [] },
			step3: { base: 1, inputs: [] },
			step4: { base: 1, inputs: [] },
			step5: { base: 0, inputs: [] },
			step6: { base: 1, inputs: [] },
			step7: { base: 1, inputs: [] },
			step8: { base: 0, inputs: [] }
		}
	},
	'b6b55c05-06a2-4732-b37a-afb0e1b8306a': {
		type: 'sine-lfo',
		inputs: [],
		ui: { position: { x: -653, y: 903 }, primmaryColor: '#45c7ff' },
		parameters: {
			frequency: { base: 0.21424525570946693, inputs: [] },
			multiply: { base: 381.16019099322136, inputs: [] },
			unipolar: { base: 0, inputs: [] },
			negate: { base: 0, inputs: [] }
		}
	},
	'197b52d5-b02a-4e1c-846f-5966fa33eae4': {
		type: 'sine-lfo',
		inputs: [],
		ui: { position: { x: -220, y: 1146 }, primmaryColor: '#45c7ff' },
		parameters: {
			frequency: { base: 0.3118929293886743, inputs: [] },
			multiply: { base: 296.12281407781734, inputs: [] },
			unipolar: { base: 0, inputs: [] },
			negate: { base: 1, inputs: [] }
		}
	},
	'4337ea4d-ee53-4376-ae21-800c4f8a19a5': {
		type: 'multiply',
		inputs: ['28593998-29d3-4306-a35d-0d8f008b42f6'],
		ui: { position: { x: 1196, y: 1216 }, primmaryColor: '#b7c3e6' },
		parameters: { factor: { base: 591.484003227823, inputs: [] } }
	},
	'd511888a-ea1b-46e6-a7f8-1325535d7e3a': {
		type: 'pattern',
		inputs: [{ id: 'fa70d143-c8ac-4abe-b3a0-15192dab673d', output: 'trigger', input: 'trigger' }],
		ui: { position: { x: 797, y: 424 }, primmaryColor: '#fd783f' },
		parameters: {
			step1: { base: 1, inputs: [] },
			step2: { base: 0, inputs: [] },
			step3: { base: 0, inputs: [] },
			step4: { base: 0, inputs: [] },
			step5: { base: 1, inputs: [] },
			step6: { base: 0, inputs: [] },
			step7: { base: 0, inputs: [] },
			step8: { base: 0, inputs: [] }
		}
	}
};
