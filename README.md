# Svelte notifications

Simple and flexible notifications system

## Getting started

```bash
npm install --save svelte-notifications
```

## Usage

```javascript
// MainComponent.svelte

<script>
  import Notifications from 'svelte-notifications';

  import App from './App.svelte';
</script>

<Notifications>
  <App />
</Notifications>
```

```javascript
// ChildrenComponent.svelte

<script>
  import { getNotificationsContext } from 'svelte-notifications';

  const { addNotification } = getNotificationsContext();
</script>

<button
  on:click={() => addNotification({
    text: 'Notification',
  })}
>
  Add notification
</button>
```
