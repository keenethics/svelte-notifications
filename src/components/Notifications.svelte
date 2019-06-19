<style>
  .position-top-left,
  .position-top-center,
  .position-top-right,
  .position-bottom-left,
  .position-bottom-center,
  .position-bottom-right {
    position: fixed;
    width: 270px;
  }

  .position-top-left {
    top: 0;
    left: 0;
  }

  .position-top-center {
    top: 0;
    left: 50%;
    transform: translateX(-50%);
  }

  .position-top-right {
    top: 0;
    right: 0;
  }

  .position-bottom-left {
    bottom: 0;
    left: 0;
  }

  .position-bottom-center {
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
  }

  .position-bottom-right {
    bottom: 0;
    right: 0;
  }
</style>
<script>
  import { setContext } from 'svelte';

  import Notification from './Notification.svelte';

  import context from '../context';
  import store from '../store';
  import positions from '../positions';

  export let item = null;

  setContext(context, store);
</script>

<slot></slot>
<div class="notifications">
  {#each positions as position}
    <div class={`position-${position}`}>
      <div>
        {#each $store as notification (notification.id)}
          {#if notification.position === position}
            {#if item}
              <svelte:component this={item} {notification}/>
            {:else}
              <Notification {notification}/>
            {/if}
          {/if}
        {/each}
      </div>
    </div>
  {/each}
</div>
