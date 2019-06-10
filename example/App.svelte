<style>
  @import 'public/global.css';
</style>

<script>
  import { Notifications } from '../src';

  import CustomItem from './CustomItem.svelte';
  import Children from './Children.svelte';
</script>

<Notifications notificationItem={CustomItem}>
  <Children />
</Notifications>
