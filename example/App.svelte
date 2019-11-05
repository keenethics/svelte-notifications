<script>
  import Notifications from '../src';

  import CustomItem from './ItemWithButtons.svelte';

  import Children from './Children.svelte';

  /**
   * keep `item` var in this file, pass function to change it to Children.
   * toggler will change it and in will be passed to Notifications dynamically
   * 
   * Notification should be HOC and it will render custom or default item.
   * Move default item to DefaultNotification
  */
 let item = null;

 const setItem = () => {
   console.log('changing item');
   if (item === null) {
     item = CustomItem;
   } else {
     item = null;
   }
 };
</script>

<Notifications item>
  <Children setItem={setItem} />
</Notifications>