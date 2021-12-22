const removeNotification = (notificationId, { update }) => {
  if (!notificationId) return;

  update((notifications) => notifications.filter(({ id }) => id !== notificationId));
};

export default removeNotification;
