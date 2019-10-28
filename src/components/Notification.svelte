<style>
  .default-notification-style {
    position: relative;
    display: flex;
    align-items: stretch;
    justify-content: space-between;
    margin: 12px;
    background: #fff;
    color: #000;
    border-radius: 6px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
    min-height: 0;
    overflow: hidden;
  }

  .default-notification-style-content {
    width: 210px;
    padding: 12px 6px 12px 12px;
    box-sizing: border-box;
    word-wrap: break-word;
  }

  .default-notification-style-button {
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

  .default-notification-style-button:hover {
    background: rgba(0, 0, 0, 0.01);
  }
</style>
<script>
  import { onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';

  import { getNotificationsContext } from '../context';

  export let notification = {};
  export let withoutStyles = false;

  const { removeNotification } = getNotificationsContext();
  const {
    id,
    text,
    removeAfter,
    customClass = '',
  } = notification;

  const getClass = (suffix) => {
    const defaultSyffix = suffix ? `-${suffix}` : '';
    const defaultCustomClass = customClass && !suffix ? `${customClass} ` : '';
    const defaultNotificationClass = ` default-notification-style${defaultSyffix}`;

    return `${defaultCustomClass}notification${defaultSyffix}${withoutStyles ? '' : defaultNotificationClass}`;
  };
  const removeNotificationHandler = () => removeNotification(id);

  let timeout = null;

  if (removeAfter) {
    timeout = setTimeout(removeNotificationHandler, removeAfter);
  }

  onDestroy(() => {
    if (removeAfter && timeout) clearTimeout(timeout);
  });
</script>

<div
  class={getClass()}
  role="status"
  aria-live="polite"
  in:fade
  out:fade
>
  <div class={getClass('content')}>
    <slot>{text}</slot>
  </div>
  <button
    class={getClass('button')}
    on:click={removeNotificationHandler}
    aria-label="delete notification"
  >
    &times;
  </button>
</div>
