import { getContext } from 'svelte';

const context = {
  subscribe: null,
  addNotification: null,
  removeNotification: null,
  clearNotifications: null,
};

export const getNotificationsContext = () => getContext(context);

export default context;
