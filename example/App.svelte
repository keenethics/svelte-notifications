<script>
  import Notifications from '../src';
  import CustomItem from './CustomItem.svelte';
  import Children from './Children.svelte';

 let item = null;

 const setItem = () => {
   if (item === null) {
     item = CustomItem;
   } else {
     item = null;
   }
 };
</script>

<Notifications {item}>
  <Children setItem={setItem} />
</Notifications>