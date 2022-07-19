<script>
  import Notifications from '../src';
  import CustomItem from './CustomItem.svelte';
  import Children from './Children.svelte';

  let item = null;

  const toggleItemType = () => {
    if (!item) {
      item = CustomItem;
    } else {
      item = null;
    }
  };
</script>

<Notifications {item} zIndex={5000}>
  <Children {toggleItemType} />
</Notifications>
