import { writable } from 'svelte/store';

import addNotification from './actions/addNotification';
import removeNotification from './actions/removeNotification';
import clearNotification from './actions/clearNotifications';

const createStore = () => {
  const store = writable([]);

  return {
    subscribe: store.subscribe,
    addNotification: (notification) => addNotification(notification, store),
    removeNotification: (notificationId) => removeNotification(notificationId, store),
    clearNotifications: () => clearNotification(store),
  };
};

export default createStore();
