<style>
  @import 'public/notification.css';
</style>
<script>
  import Notification from './Notification.svelte';

  import { setContext } from 'svelte';

  import context from '../context';
  import store from '../store';

  export let notificationItem = null;

  setContext(context, store);

  const positions = [
    'top-left',
    'top-center',
    'top-right',
    'bottom-left',
    'bottom-center',
    'bottom-right',
  ];

  const getItem = () => notificationItem();
</script>

<slot></slot>
<div class="notifications">
  {#each positions as position}
    <div class={`notification-${position}`}>
      {#each $store as notification (notification.id)}
        {#if notification.position === position}
          {#if notificationItem}
            <svelte:component this={notificationItem} {notification}/>
          {:else}
            <Notification {notification}/>
          {/if}
        {/if}
      {/each}
    </div>
  {/each}
</div>
