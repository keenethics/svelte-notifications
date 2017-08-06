import { getContext } from 'svelte';

import context from './context.js';

export default () => getContext(context);
