![build](https://img.shields.io/circleci/build/github/keenethics/svelte-notifications/master.svg)
![version](https://img.shields.io/github/package-json/v/keenethics/svelte-notifications.svg)
![license](https://img.shields.io/github/license/mashape/apistatus.svg)

# Svelte notifications

Simple and flexible notifications system for Svelte 3

![Svelte Notifications](https://github.com/keenethics/svelte-notifications/blob/media/svelte-notifications-preview.png?raw=true)

## Demonstration

[https://svelte-notifications.netlify.com](https://svelte-notifications.netlify.com)

## Getting started

```bash
npm install --save svelte-notifications
```

## Basic usage

```svelte
// MainComponent.svelte

<script>
  import Notifications from 'svelte-notifications';

  import App from './App.svelte';
</script>

<Notifications>
  <App />
</Notifications>
```

```svelte
// ChildrenComponent.svelte

<script>
  import { getNotificationsContext } from 'svelte-notifications';

  const { addNotification } = getNotificationsContext();
</script>

<button
  on:click={() => addNotification({
    text: 'Notification',
    position: 'bottom-center',
  })}
>
  Add notification
</button>
```

## Providing custom notification component

```svelte
// MainComponent.svelte

<script>
  import Notifications from 'svelte-notifications';
  import CustomNotification from './CustomNotification.svelte';

  import App from './App.svelte';
</script>

<Notifications item={CustomNotification}>
  <App />
</Notifications>
```

```svelte
// CustomNotification.svelte

<script>
  export let notification = {};
  // `onRemove` function will be passed into your component.
  export let onRemove = null;

  const handleButtonClick = () => {
    onRemove();
  }
</script>

<div class={notification.type === 'error' ? 'error' : ''}>
  <h4>{notification.heading}</h4>
  <p>{notification.description}</p>
  <button on:click={handleButtonClick}>Close me</button>
</div>
```

```svelte
// AnotherComponent.svelte

<script>
  import { getNotificationsContext } from 'svelte-notifications';

  const { addNotification } = getNotificationsContext();

  const handleButtonClick = () => {
    addNotification({
      position: 'bottom-right',
      heading: 'hi i am custom notification',
      type: 'error',
      description: 'lorem ipsum',
    });
  }
</script>

<div>
  <button on:click={handleButtonClick}>Show notification</button>
</div>
```

## API

#### `Notifications`

The `Notifications` component supplies descendant components with notifications store through context.

- @prop {component} `[item=null]` - Custom notification component that receives the notification object
- @prop {boolean} `[withoutStyles=false]` - If you don't want to use the default styles, this flag will remove the classes to which the styles are attached
- @prop {string|number} `[zIndex]` - Adds a style with z-index for the notification container

```svelte
// MainComponent.svelte

<script>
  import Notifications from 'svelte-notifications';

  import App from './App.svelte';
</script>

<Notifications>
  <App />
</Notifications>
```

#### `getNotificationsContext`

A function that allows you to access the store and the functions that control the store.

```svelte
// ChildrenComponent.svelte

<script>
  import { getNotificationsContext } from 'svelte-notifications';

  const notificationsContext = getNotificationsContext();

  const {
    addNotification,
    removeNotification,
    clearNotifications,
    subscribe,
  } = notificationsContext;
</script>
```

#### `getNotificationsContext:addNotification`

You can provide any object that the notification component will receive. The default object looks like this:

- @param {Object} `notification` - The object that will receive the notification component
- @param {string} `[id=timestamp-rand]` - Unique notification identificator
- @param {string} `text` – Notification text
- @param {string} `[position=bottom-center]` – One of these values: `top-left`, `top-center`, `top-right`, `bottom-left`, `bottom-center`, `bottom-right`
- @param {string} `type` – One of these values: `success`, `warning`, `error`
- @param {number} `[removeAfter]` – After how much the notification will disappear (in milliseconds)

```svelte
// ChildrenComponent.svelte

<script>
  import { getNotificationsContext } from 'svelte-notifications';

  const { addNotification } = getNotificationsContext();

  addNotification({
    id: 'uniqNotificationId',
    text: 'Notification',
    position: 'top-center',
    type: 'success',
    removeAfter: 4000,
    ...rest,
  });
</script>
```

#### `getNotificationsContext:removeNotification`

- @param {string} `id` - Unique notification identificator

```svelte
// ChildrenComponent.svelte

<script>
  import { getNotificationsContext } from 'svelte-notifications';

  const { removeNotification } = getNotificationsContext();

  removeNotification('uniqNotificationId');
</script>
```

#### `getNotificationsContext:clearNotifications`

```svelte
// ChildrenComponent.svelte

<script>
  import { getNotificationsContext } from 'svelte-notifications';

  const { clearNotifications } = getNotificationsContext();

  clearNotifications();
</script>
```

#### `getNotificationsContext:subscribe`

Default Svelte subscribe method that allows interested parties to be notified whenever the store value changes

## Contributing

Read more about contributing [here](/CONTRIBUTING.md)
