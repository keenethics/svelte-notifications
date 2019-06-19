<script>
  import { onDestroy } from 'svelte';

  import { getNotificationsContext } from '../src/context';

  export let notification;

  const { removeNotification } = getNotificationsContext();
  const { id, deleteAfter } = notification;

  const removeNotificationHandler = () => removeNotification(id);
  const timeout = setTimeout(() => removeNotificationHandler(), deleteAfter || 4000);

  onDestroy(() => {
    if (timeout) clearTimeout(timeout);
  });
</script>

<style>
  .notification {
    display: flex;
    align-items: stretch;
    justify-content: space-between;
    margin: 12px;
    background: #fff;
    color: #000;
    border-radius: 6px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  }
  .notification-content {
    width: 210px;
    padding: 12px 6px 12px 12px;
    box-sizing: border-box;
    word-wrap:break-word;
  }
  .notification-content p {
    font-size: 14px;
    color: #a1a1a1;
    margin: 2px 0 0;
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

<div class="notification">
  <div class="notification-content">
    <slot>{notification.text}</slot>
    <p>{notification.description || 'Custom description'}</p>
  </div>
  <button on:click={removeNotificationHandler}>
    &times;
  </button>
</div>
