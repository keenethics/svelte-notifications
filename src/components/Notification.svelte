<script>
  import { onDestroy } from 'svelte';

  import { getNotificationsContext } from '../context';

  export let item;
  export let notification = {};
  export let withoutStyles = false;
  export let fadeHalted;

  const { removeNotification } = getNotificationsContext();
  const {
    id,
    removeAfter,
  } = notification;

  const removeNotificationHandler = () => removeNotification(id);

  let timeout = null;

  let expirationTime = null;
  let leftTime = null;
  let running = false;

  $ : {
    if(fadeHalted)
      haltFade()
    else
      resumeFade()
  }

  const haltFade = () => {
    if(removeAfter && timeout && running) {
      running = false;
      leftTime = expirationTime - Date.now();
      clearTimeout(timeout);
    }
  };

  const resumeFade = () => {
    if(removeAfter && timeout && !running) {
      expirationTime = new Date(Date.now() + leftTime);
      running = true;
      timeout = setTimeout(removeNotificationHandler, leftTime);
    }
  };

  if (removeAfter) {
    expirationTime = new Date(Date.now() + removeAfter);
    running = true;
    timeout = setTimeout(removeNotificationHandler, removeAfter);
  }

  onDestroy(() => {
    if (removeAfter && timeout) {
      clearTimeout(timeout);
      fadeHalted = false;
    } 
  });
</script>

<svelte:component
  this={item}
  {notification}
  {withoutStyles}
  on:mouseenter={() => fadeHalted = true}
  on:mouseleave={() => fadeHalted = false}
  onRemove={removeNotificationHandler}
/>
