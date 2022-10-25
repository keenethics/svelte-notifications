import { writable } from 'svelte/store';

import addNotification from './actions/addNotification';
import removeNotification from './actions/removeNotification';
import clearNotification from './actions/clearNotifications';

const createStore = () => {
  const store = writable([]);
  const defaults = writable({});

  let defaultPosition;
  defaults.subscribe(({position}) => defaultPosition = position);

  return {
    defaults,
    subscribe: store.subscribe,
    addNotification: async (notification) => addNotification({...notification, position: notification.position || defaultPosition}, store),
    removeNotification: (notificationId) => removeNotification(notificationId, store),
    clearNotifications: () => clearNotification(store),
  };
};

export default createStore();
