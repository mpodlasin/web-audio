import { redirect } from '@sveltejs/kit';

const routes: Record<string, { title: string; tutorialId: string }> = {
	'your-first-sounds': {
		title: '1. Your First Sounds',
		tutorialId: 'tutorial1'
	},
	'types-of-signals': {
		title: '2. Types of Signals',
		tutorialId: 'tutorial2'
	},
	'synthesizing-techno-kick': {
		title: '3. Synthesizing Techno Kick',
		tutorialId: 'tutorial3'
	}
};

export const load = ({ params }) => {
	const { id } = params;

	if (id in routes) {
		return {
			id,
			route: routes[id] as { title: string; tutorialId: string }
		};
	}

	throw redirect(300, '/learn');
};
