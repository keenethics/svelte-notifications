import { getContext } from 'svelte';

import context from './context';

export default () => getContext(context);
