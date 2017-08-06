<script>
  import { onDestroy } from 'svelte';

  import getContext from './getContext.js';

  export let notification;

  const context = getContext();

  const deleteNotifications = () => context.delete(notification.id);
  const timeout = setTimeout(() => deleteNotifications, 50000);

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
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05), 0 0 4px rgba(0, 0, 0, 0.05);
  }
  .notification-context {
    padding: 12px 6px 12px 12px;
  }
  button {
    display: block;
    width: 50px;
    padding: 0;
    margin: 0;
    border: none;
    border-left: 1px solid #eee;
    outline: none;
    background: none;
    cursor: pointer;
    font-size: 20px;
    color: '#000';
  }
  button:hover {
    background: rgba(0, 0, 0, 0.01);
  }
</style>

<div class="notification">
  <div class="notification-context">
    <slot>{notification.text}</slot>
  </div>
  <button on:click={deleteNotifications}>
    &times;
  </button>
</div>
