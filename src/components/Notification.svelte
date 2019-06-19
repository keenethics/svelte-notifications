<style>
  .notification {
    display: flex;
    align-items: stretch;
    justify-content: space-between;
    margin: 12px;
    background: #fff;
    color: #000;
    border-radius: 6px;
  }

  .notification-content {
    width: 210px;
    padding: 12px 6px 12px 12px;
    box-sizing: border-box;
    word-wrap: break-word;
  }

  button {
    display: block;
    width: 40px;
    padding: 0 0 2px;
    margin: 0;
    border: none;
    border-left: 1px solid #eee;
    outline: none;
    background: none;
    cursor: pointer;
    font-size: 20px;
    color: #000;
    box-sizing: border-box;
  }

  button:hover {
    background: rgba(0, 0, 0, 0.01);
  }
</style>
<script>
  import { onDestroy } from 'svelte';
  import { getNotificationsContext } from '../context';

  export let notification;

  const { removeNotification } = getNotificationsContext();
  const { id, removeAfter } = notification;

  const removeNotificationHandler = () => removeNotification(id);

  let timeout = null;

  if (removeAfter) {
    timeout = setTimeout(removeNotificationHandler, removeAfter);
  }

  onDestroy(() => {
    if (removeAfter && timeout) clearTimeout(timeout);
  });
</script>

<div class="notification" role="status" aria-live="polite">
  <div class="notification-content">
    <slot>{notification.text}</slot>
  </div>
  <button on:click={removeNotificationHandler} aria-label="delete notification">
    &times;
  </button>
</div>
