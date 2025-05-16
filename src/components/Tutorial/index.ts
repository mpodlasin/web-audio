import { type Tutorial } from './types';

import { tutorial1 } from './Tutorial1';
import { tutorial2 } from './Tutorial2';
import { tutorial3 } from './Tutorial3';
import { tutorial4 } from './Tutorial4';
import { tutorial5 } from './Tutorial5';
import { tutorial6 } from './Tutorial6';

export const tutorials: Record<string, Tutorial> = {
    tutorial1: tutorial1,
    tutorial2: tutorial2,
    tutorial3: tutorial3,
    tutorial4: tutorial4,
    tutorial5: tutorial5,
    tutorial6: tutorial6
};
