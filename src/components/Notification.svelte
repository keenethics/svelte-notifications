<script>
  import { onDestroy } from 'svelte';

  import getContext from '../getContext';
  import { positions } from '../static.js';

  export let notification = {
    id: new Date().getTime(),
    position: positions[4]
  };

  const { id, removeAfter } = notification;

  const { remove } = getContext();

  const removeNotifications = () => remove(id);
  const timeout = setTimeout(removeNotifications, removeAfter || 4000);

  onDestroy(() => {
    if (timeout) clearTimeout(timeout);
  });
</script>

<div class="notification">
  <div class="notification-context">
    <slot>{notification.text}</slot>
  </div>
  <button on:click={removeNotifications}>
    &times;
  </button>
</div>
