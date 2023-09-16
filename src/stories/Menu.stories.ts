import type { Meta, StoryObj } from '@storybook/svelte';

import '../styles.css';
import Menu from './MenuExample.svelte';

// More on how to set up stories at: https://storybook.js.org/docs/svelte/writing-stories/introduction
const meta = {
	title: 'UI/Menu',
	component: Menu,
	tags: ['autodocs'],
	argTypes: {}
} satisfies Meta<Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: {}
};
