<script>
  import { getContext } from './notifications';

  const { add } = getContext();
</script>

<div>
  <button
    on:click={() => add({
      id: new Date().getTime(),
      text: `Notification: ${new Date().getTime()}`,
      position: 'bottom-center',
    })}
  >
    Add notification to bottom center
  </button>

  <button
    on:click={() => add({
      id: new Date().getTime(),
      text: `Notification: ${new Date().getTime()}`,
      position: 'top-left',
    })}
  >
    Add notification to top left
  </button>
</div>
