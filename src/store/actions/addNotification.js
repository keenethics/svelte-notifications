import positions from '../../positions';

const addNotification = (notification, store) => {
  if (!notification) return;

  const { update } = store;
  const safeNotification = {
    id: `${new Date().getTime()}-${Math.floor(Math.random() * 9999)}`,
    position: 'bottom-center',
    text: '',
    ...notification,
  };

  if (!positions.includes(notification.position)) return;

  update((notifications) => {
    if (safeNotification.position.includes('top-')) {
      return [safeNotification, ...notifications];
    }

    return [...notifications, safeNotification];
  });
};

export default addNotification;
