import { redirect } from '@sveltejs/kit';

const routes: Record<string, { title: string, tutorialId: string }> = {
    'basics': {
        title: 'Basics',
        tutorialId: 'tutorial1',
    },
}

export const load  = ({ params }) => {
    const { id } = params;

    if (id in routes) {
        return {
            id,
            route: routes[id] as { title: string, tutorialId: string },
        }
    }

   throw redirect(300, '/learn');
};
