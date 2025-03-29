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
	},
	'oscillators-frequency-and-amplitude': {
		title: '4. Oscillators - Frequency and Amplitude',
		tutorialId: 'tutorial4'
	},
	'cycling-through-oscillators': {
		title: '5. Cycling Through Oscillators',
		tutorialId: 'tutorial5'
	}
};

export const load = ({ params }: { params: { id: string } }) => {
	const { id } = params;

	if (id in routes) {
		return {
			id,
			route: routes[id] as { title: string; tutorialId: string }
		};
	}

	throw redirect(300, '/learn');
};
