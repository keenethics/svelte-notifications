import { writable } from 'svelte/store';
import positions from './positions';

const addNotification = (notification = {
  id: new Date().getTime(),
  position: positions[4],
}, update) => {
  console.log(notification);
  if (!notification || typeof notification !== 'object') return;
  if (!notification.text) return;
  if (typeof notification.text !== 'string') return;
  if (typeof notification.position !== 'string' || !positions.some(pos => pos === notification.position)) return;
  if (notification.removeAfter) notification.removeAfter = +notification.removeAfter;
  if (!notification.id) notification.id = new Date().getTime();

  update((notifications) => {
    return [...notifications, notification];
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
    add: notification => addNotification(notification, update),
    remove: notificationId => removeNotification(notificationId, update),
    clear: () => clearNotifications(set),
  };
};

export default createNotificationsStore();
