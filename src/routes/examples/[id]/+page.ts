import { redirect } from '@sveltejs/kit';
import type { SerializedAudioElements } from '../../../audio/AudioCanvas';

const examples: Record<string, { title: string; example: SerializedAudioElements }> = {
	'first-example': {
		title: 'First Example',
		example: {}
	},
};

export const load = ({ params }) => {
	const { id } = params;

	if (id in examples) {
        const config = examples[id];

        if (config) {
            return { id, ...config };
        }
	}

	throw redirect(300, '/');
};
