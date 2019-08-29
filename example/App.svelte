<script>
  import Notifications from '../src';

  import ItemWithButtons from './ItemWithButtons.svelte';

  import Children from './Children.svelte';
</script>

<Notifications item={ItemWithButtons}>
  <Children />
</Notifications>
