import { writable } from 'svelte/store';

import positions from './positions';

const isNotificationValid = notification => {
  if (!notification || !notification.text) return false;
  if (typeof notification.text !== 'string') return false;
  if (!positions.includes(notification.position)) return false;

  return true;
};

const addNotification = (notification, update) => {
  if (!isNotificationValid(notification)) throw new Error('Notification object is not valid');

  const {
    id = new Date().getTime(),
    removeAfter = +notification.removeAfter,
    ...rest
  } = notification;

  update((notifications) => {
    return [...notifications, {
      id,
      removeAfter,
      ...rest,
    }];
  });
};

const removeNotification = (notificationId, update) => update((notifications) => {
  return notifications.filter(n => n.id !== notificationId);
});

const clearNotifications = set => set([]);

const createNotificationsStore = () => {
  const {
    subscribe,
    set,
    update,
  } = writable([]);

  return {
    subscribe,
    addNotification: notification => addNotification(notification, update),
    removeNotification: notificationId => removeNotification(notificationId, update),
    clearNotifications: () => clearNotifications(set),
  };
};

export default createNotificationsStore();
