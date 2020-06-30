<script>
  import { fade } from 'svelte/transition';

  export let notification;
  export let onRemove = null;
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
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
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
  .notification-buttons {
    border-left: 1px solid #eee;
  }

  .notification-buttons button:first-child {
    border-bottom: 1px solid #eee;
  }
  button {
    display: block;
    width: 60px;
    height: 50%;
    padding: 0;
    margin: 0;
    border: none;
    outline: none;
    background: none;
    cursor: pointer;
    font-size: 12px;
    color: #666;
    box-sizing: border-box;
  }
  button:hover {
    background: rgba(0, 0, 0, 0.01);
  }
</style>

<div
  class="notification"
  in:fade
  out:fade  
>
  <div class="notification-content">
    <slot>{notification.text}</slot>
    <p>{notification.description || 'Custom description'}</p>
  </div>
  <div class="notification-buttons">
    <button on:click={onRemove}>
      Action
    </button>
    <button on:click={onRemove}>
      Close
    </button>
  </div>
</div>
