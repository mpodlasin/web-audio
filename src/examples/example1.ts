import { type Project } from '../ui/project';

export const example1: Project = {
	name: 'First Example',
	created: '2024-08-10T10:05:03.599Z',
	lastChanged: '2024-08-10T10:14:34.805Z',
	audioCanvas: {
		'54860d1b-a250-47ce-87ac-e4a7aa6c4b37': {
			type: 'saw-oscillator',
			inputs: [],
			ui: { position: { x: 84.32421875, y: 224.79296875 }, primaryColor: '#1E90FF' },
			parameters: {
				frequency: {
					base: 0,
					inputs: [{ id: 'c1daf0ef-7c7e-48b2-817b-9c18197ee621', output: 'frequency', multiply: 1 }]
				},
				detune: {
					base: 0,
					inputs: [{ id: 'ef1d6ef4-a3ae-4fa0-b640-d8af97c9f936', output: 'number', multiply: 1 }]
				}
			}
		},
		'08f8fc85-0422-4d02-ba43-226671136037': {
			type: 'lowpass-filter',
			inputs: [{ id: '54860d1b-a250-47ce-87ac-e4a7aa6c4b37', output: 'audio', input: 'audio' }],
			ui: { position: { x: 318.08203125, y: 224.98046875 }, primaryColor: '#9ACD32' },
			parameters: {
				frequency: {
					base: 157.22227050878172,
					inputs: [{ id: '17bd3df4-18f6-4d37-9297-466733c10c63', output: 'number', multiply: 1 }]
				},
				resonance: { base: 3.11795314865581, inputs: [] }
			}
		},
		'dee22677-3df3-4f78-a6da-65fdc63077be': {
			type: 'destination',
			inputs: [{ id: '25de24b3-68ab-415d-b426-3fdce5376a90', output: 'audio', input: 'audio' }],
			ui: { position: { x: 109.3046875, y: -304.734375 }, primaryColor: '#d54ca3' },
			parameters: {}
		},
		'25de24b3-68ab-415d-b426-3fdce5376a90': {
			type: 'gain',
			inputs: [{ id: 'e2415bdb-1771-4a50-9296-8be64c009692', output: 'audio', input: 'audio' }],
			ui: { position: { x: -17.4609375, y: -420.3515625 }, primaryColor: '#d22d4e' },
			parameters: { gain: { base: 0.18014564043209877, inputs: [] } }
		},
		'6f177223-532b-4df1-9eb6-c5e023d99e32': {
			type: 'sequencer',
			inputs: [{ id: '70100c83-c6a1-4462-adb4-e161a4da3604', output: 'trigger', input: 'trigger' }],
			ui: { position: { x: 58.5703125, y: -140.38671875 }, primaryColor: '#DAA520' },
			parameters: {
				frequency1: { base: 267.809376868791, inputs: [] },
				frequency2: { base: 500.73130755321563, inputs: [] },
				frequency3: { base: 657.4314401158183, inputs: [] },
				frequency4: { base: 212.61241610245938, inputs: [] },
				frequency5: { base: 893.7355845685948, inputs: [] },
				frequency6: { base: 171.11398118163456, inputs: [] },
				frequency7: { base: 770.7781111543511, inputs: [] },
				frequency8: { base: 241.57225792072668, inputs: [] }
			}
		},
		'c1daf0ef-7c7e-48b2-817b-9c18197ee621': {
			type: 'pitch-quantizer',
			inputs: [
				{ id: '6f177223-532b-4df1-9eb6-c5e023d99e32', output: 'frequency', input: 'frequency' }
			],
			ui: { position: { x: 230.82421875, y: 60.91015625 }, primaryColor: '#DAA520' },
			parameters: {
				A: { base: 1, inputs: [] },
				'A#': { base: 0, inputs: [] },
				B: { base: 1, inputs: [] },
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
		'0e21f3f3-c1eb-47d7-9a13-2d7c791d750c': {
			type: 'clock',
			inputs: [],
			ui: { position: { x: -426.67578125, y: -142.76953125 }, primaryColor: '#e95e2a' },
			parameters: { tempo: { base: 218.20405420097921, inputs: [] } }
		},
		'ce532f0a-67b6-41d3-8526-2c8fa551d502': {
			type: 'ad-envelope',
			inputs: [{ id: '0e21f3f3-c1eb-47d7-9a13-2d7c791d750c', output: 'trigger', input: 'trigger' }],
			ui: { position: { x: -368.31640625, y: 80.6796875 }, primaryColor: '#00FA9A' },
			parameters: {
				attack: { base: 0, inputs: [] },
				decay: { base: 159.4859818359651, inputs: [] }
			}
		},
		'2d50c026-c3ea-4ec1-8a1b-e0051c0b2bc8': {
			type: 'delay',
			inputs: [{ id: 'eaf2032b-6a47-449b-91f8-1790a4f849bc', output: 'audio', input: 'audio' }],
			ui: { position: { x: 442.3125, y: 480.07421875 }, primaryColor: '#9370DB' },
			parameters: {
				delayTime: { base: 1.016548374748136, inputs: [] },
				feedback: { base: 0.5172260802469136, inputs: [] },
				mix: { base: 0.5111111111111112, inputs: [] }
			}
		},
		'70100c83-c6a1-4462-adb4-e161a4da3604': {
			type: 'pattern',
			inputs: [{ id: '0e21f3f3-c1eb-47d7-9a13-2d7c791d750c', output: 'trigger', input: 'trigger' }],
			ui: { position: { x: -297.13671875, y: -138.65625 }, primaryColor: '#e95e2a' },
			parameters: {
				step1: { base: 1, inputs: [] },
				step2: { base: 0, inputs: [] },
				step3: { base: 1, inputs: [] },
				step4: { base: 0, inputs: [] },
				step5: { base: 1, inputs: [] },
				step6: { base: 0, inputs: [] },
				step7: { base: 1, inputs: [] },
				step8: { base: 0, inputs: [] }
			}
		},
		'ef1d6ef4-a3ae-4fa0-b640-d8af97c9f936': {
			type: 'sine-lfo',
			inputs: [],
			ui: { position: { x: -355.75390625, y: 478.0859375 }, primaryColor: '#40E0D0' },
			parameters: {
				frequency: { base: 0.12962210297288837, inputs: [] },
				multiply: {
					base: 0,
					inputs: [
						{
							id: 'b2cf5824-1078-49c4-a092-cb69ea495a92',
							output: 'number',
							multiply: 0.01218178511017154
						}
					]
				},
				unipolar: { base: 1, inputs: [] },
				negate: { base: 0, inputs: [] }
			}
		},
		'eaf2032b-6a47-449b-91f8-1790a4f849bc': {
			type: 'highpass-filter',
			inputs: [{ id: '08f8fc85-0422-4d02-ba43-226671136037', output: 'audio', input: 'audio' }],
			ui: { position: { x: 200.07421875, y: 468.67578125 }, primaryColor: '#9ACD32' },
			parameters: {
				frequency: { base: 708.6936449410532, inputs: [] },
				resonance: { base: 0.437069775035473, inputs: [] }
			}
		},
		'17bd3df4-18f6-4d37-9297-466733c10c63': {
			type: 'multiply',
			inputs: [{ id: 'ce532f0a-67b6-41d3-8526-2c8fa551d502', output: 'envelope', input: 'number' }],
			ui: { position: { x: -73.17578125, y: 86.1953125 }, primaryColor: '#9ab7bc' },
			parameters: {
				factor: {
					base: 345.48338540229184,
					inputs: [{ id: 'b2cf5824-1078-49c4-a092-cb69ea495a92', output: 'number', multiply: 1 }]
				}
			}
		},
		'b2cf5824-1078-49c4-a092-cb69ea495a92': {
			type: 'triangle-lfo',
			inputs: [],
			ui: { position: { x: -362.609375, y: 284.703125 }, primaryColor: '#40E0D0' },
			parameters: {
				frequency: { base: 0.11406735656303936, inputs: [] },
				multiply: { base: 668.7248669603866, inputs: [] },
				unipolar: { base: 1, inputs: [] },
				negate: { base: 0, inputs: [] }
			}
		},
		'7dcfcdbe-c689-484d-92e9-ac13b3049d98': {
			type: 'comment',
			inputs: [],
			ui: { position: { x: -315.671875, y: -357.8046875 }, primaryColor: '#6bbd6b' },
			parameters: {},
			comment:
				'Press play button above and start increasing the gain on the right until the sound is on a comfortable level.'
		},
		'e2415bdb-1771-4a50-9296-8be64c009692': {
			type: 'convolution',
			inputs: [
				{ id: '2d50c026-c3ea-4ec1-8a1b-e0051c0b2bc8', output: 'audio', input: 'audio' },
				{ id: '08f8fc85-0422-4d02-ba43-226671136037', output: 'audio', input: 'audio' }
			],
			ui: { position: { x: 795.8671875, y: 469.93359375 }, primaryColor: '#9370DB' },
			parameters: { mix: { base: 0.30961612654320986, inputs: [] } }
		}
	},
	size: 1,
	canvasRelativePosition: { x: 551.80078125, y: 457.24609375 }
};
