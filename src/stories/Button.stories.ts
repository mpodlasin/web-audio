import type { Meta, StoryObj } from '@storybook/svelte';

import '../styles.css';
import Button from '../components/Button.svelte';

// More on how to set up stories at: https://storybook.js.org/docs/svelte/writing-stories/introduction
const meta = {
	title: 'UI/Button',
	component: Button,
	tags: ['autodocs'],
	argTypes: {
		title: { control: 'text' }
	}
} satisfies Meta<Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: {
		title: 'Title'
	}
};

export const Danger: Story = {
	args: {
		title: 'Delete',
		variant: 'danger'
	}
};
