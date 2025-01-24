import copy1 from './Copy1.md';
import check1 from './Check1';
import copy2 from './Copy2.md';
import check2 from './Check2';
import copy3 from './Copy3.md';
import check3 from './Check3';

import type { Tutorial } from '../types';

export const tutorial3: Tutorial = {
	steps: [
		{
			copy: copy1,
			check: check1
		},
		{
			copy: copy2,
			check: check2
		},
		{
			copy: copy3,
			check: check3
		}
	]
};
