import type { Meta, StoryObj } from '@storybook/svelte';

import '../styles.css';
import Knob from '../components/Knob.svelte';

// More on how to set up stories at: https://storybook.js.org/docs/svelte/writing-stories/introduction
const meta = {
	title: 'UI/Knob',
	component: Knob,
	tags: ['autodocs'],
	argTypes: {
		parameterName: { control: 'text' },
		parameter: { control: 'number' },
		minValue: { control: 'number' },
		maxValue: { control: 'number' }
	}
} satisfies Meta<Knob>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: {
		parameterName: 'frequency',
		parameter: { base: 0.5, inputs: [] },
		minValue: 0,
		maxValue: 1,
		audioParamAnalyser: undefined
	}
};

export const Controlled: Story = {
	args: {
		parameterName: 'frequency',
		parameter: { base: 0.5, inputs: [{ id: '1', output: 'frequency' }] },
		minValue: 0,
		maxValue: 1,
		audioParamAnalyser: undefined
	}
};
