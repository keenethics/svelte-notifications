import { writable } from 'svelte/store';

const addNotification = (notification, update) => {
  if (!notification || typeof notification !== 'object') return;
  if (notification && (!notification.id && !notification.text)) return;

  update((notifications) => {
    return [...notifications, notification]
  });
};

const deleteNotification = (notificationId, update) => update((notifications) => {
  return notifications.filter(n => n.id !== notificationId);
});

const clearNotifications = set => set([]);

const createNotificationsStore = () => {
  const { subscribe, set, update } = writable([]);

  return {
    subscribe,
    add: notification => addNotification(notification, update),
    delete: notificationId => deleteNotification(notificationId, update),
    clear: () => clearNotification(),
  };
}

export default createNotificationsStore();
