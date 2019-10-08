# Svelte notifications

![build](https://img.shields.io/circleci/build/github/keenethics/svelte-notifications/master.svg)
![version](https://img.shields.io/github/package-json/v/keenethics/svelte-notifications.svg)
![license](https://img.shields.io/github/license/mashape/apistatus.svg)

Simple and flexible notifications system for Svelte 3

## Demonstration

[https://svelte-notifications.netlify.com](https://svelte-notifications.netlify.com)

## Getting started

```bash
npm install --save svelte-notifications
```

## Basic usage

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
    position: 'bottom-center',
  })}
>
  Add notification
</button>
```

## API

#### `Notifications`

The `Notifications` component supplies descendant components with notifications store through context.

* @prop {component} `[item=null]` - Custom notification component that receives the notification object
* @prop {boolean} `[withoutStyles=false]` - If you don't want to use the default styles, this flag will remove the classes to which the styles are attached

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

#### `getNotificationsContext`

A function that allows you to access the store and the functions that control the store.

```javascript
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

* @param {Object} `notification` - The object that will receive the notification component
* @param {string} `[id=timestamp]` - Unique notification identificator
* @param {string} `text` – Notification text
* @param {string} `position` – One of these values: `top-left`, `top-center`, `top-right`, `bottom-left`, `bottom-center`, `bottom-right`
* @param {number} `[removeAfter]` – After how much the notification will disappear (in milliseconds)

```javascript
// ChildrenComponent.svelte

<script>
  import { getNotificationsContext } from 'svelte-notifications';

  const { addNotification } = getNotificationsContext();

  addNotification({
    id: 'uniqNotificationId',
    text: 'Notification',
    position: 'bottom-center',
    removeAfter: 4000,
    ...rest,
  });
</script>
```

#### `getNotificationsContext:removeNotification`

* @param {string} `id` - Unique notification identificator

```javascript
// ChildrenComponent.svelte

<script>
  import { getNotificationsContext } from 'svelte-notifications';

  const { removeNotification } = getNotificationsContext();

  removeNotification('uniqNotificationId');
</script>
```

#### `getNotificationsContext:clearNotifications`

```javascript
// ChildrenComponent.svelte

<script>
  import { getNotificationsContext } from 'svelte-notifications';

  const { clearNotifications } = getNotificationsContext();

  clearNotifications();
</script>
```

#### `getNotificationsContext:subscribe`

Default Svelte subscribe method that allows interested parties to be notified whenever the store value changes

