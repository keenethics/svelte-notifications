<script>
  import { onDestroy } from 'svelte';

  import getContext from '../getContext';

  export let notification = null;

  const { id, removeAfter } = notification;

  const { remove } = getContext();

  const removeNotifications = () => remove(id);
  const timeout = setTimeout(removeNotifications, removeAfter || 4000);

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
  }
  .notification-context {
    width: 210px;
    padding: 12px 6px 12px 12px;
    box-sizing: border-box;
    word-wrap:break-word;
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
  <div class="notification-context">
    <slot>{notification.text}</slot>
  </div>
  <button on:click={removeNotifications}>
    &times;
  </button>
</div>
