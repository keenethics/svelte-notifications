<script>
  import { onDestroy } from 'svelte';

  import { getNotificationsContext } from '../context';

  export let item;
  export let notification = {};
  export let withoutStyles = false;

  const { removeNotification, defaults } = getNotificationsContext();

  const { id } = notification;
  const removeAfter = +notification.removeAfter || $defaults.removeAfter;

  const removeNotificationHandler = () => removeNotification(id);

  let timeout = null;

  if (removeAfter) {
    timeout = setTimeout(removeNotificationHandler, removeAfter);
  }

  onDestroy(() => {
    if (removeAfter && timeout) clearTimeout(timeout);
  });
</script>

<svelte:component
  this={item}
  {notification}
  {withoutStyles}
  onRemove={removeNotificationHandler}
/>
