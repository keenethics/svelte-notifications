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
    min-width: 200px;
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
    padding: 0;
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

  .default-notification-error {
    background: #f3555a;
    color: #fff;
  }

  .default-notification-error .default-notification-style-button {
    border-left: 1px solid rgba(255, 255, 255, 0.4);
    color: #fff;
  }

  .default-notification-warning {
    background: #ffb900;
    color: #000;
  }

  .default-notification-warning .default-notification-style-button {
    border-left: 1px solid rgba(0, 0, 0, 0.2);
    color: #000;
  }

  .default-notification-success {
    background: #22ce6c;
    color: #fff;
  }

  .default-notification-success .default-notification-style-button {
    border-left: 1px solid rgba(255, 255, 255, 0.4);
    color: #fff;
  }
</style>

<script>
  import { fade } from 'svelte/transition';

  export let notification = {};
  export let withoutStyles = false;
  export let onRemove = null;

  const {
    text,
    type,
  } = notification;

  const getClass = (suffix) => {
    const defaultSuffix = suffix ? `-${suffix}` : '';
    const defaultNotificationClass = ` default-notification-style${defaultSuffix}`;
    const defaultNotificationType = type && !suffix ? ` default-notification-${type}` : '';

    return `notification${defaultSuffix}${withoutStyles ? '' : defaultNotificationClass}${defaultNotificationType}`;
  };
</script>

{#if text}
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
      on:click={onRemove}
      aria-label="delete notification"
    >
      &times;
    </button>
  </div>
{/if}
