<script>
  import Notification from './Notification.svelte';

  import { setContext } from 'svelte';

  import context from '../context';
  import store from '../store';

  setContext(context, store);

  const positions = [
    'top-left',
    'top-center',
    'top-right',
    'bottom-left',
    'bottom-center',
    'bottom-right',
  ];
</script>

<style>
  .notification-top-left,
  .notification-top-center,
  .notification-top-right,
  .notification-bottom-left,
  .notification-bottom-center,
  .notification-bottom-right {
    position: fixed;
    width: 270px;
  }
  .notification-top-left {
    top: 0;
    left: 0;
  }
  .notification-top-center {
    top: 0;
    left: 50%;
    transform: translateX(-50%);
  }
  .notification-top-right {
    top: 0;
    right: 0;
  }
  .notification-bottom-left {
    bottom: 0;
    left: 0;
  }
  .notification-bottom-center {
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
  }
  .notification-bottom-right {
    bottom: 0;
    right: 0;
  }
</style>

<slot></slot>
<div class="notifications">
  {#each positions as position}
    <div class={`notification-${position}`}>
      {#each $store as notification (notification.id)}
        {#if notification.position === position}
          <Notification {notification}/>
        {/if}
      {/each}
    </div>
  {/each}
</div>
