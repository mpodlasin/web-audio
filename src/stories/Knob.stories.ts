import type { Meta, StoryObj } from '@storybook/svelte';

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

// More on writing stories with args: https://storybook.js.org/docs/svelte/writing-stories/args
export const Primary: Story = {
	args: {
		parameterName: 'frequency',
		parameter: 0.5,
		minValue: 0,
		maxValue: 1
	}
};
