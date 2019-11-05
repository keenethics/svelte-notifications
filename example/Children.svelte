<script>
  import { getNotificationsContext } from '../src';

  let text = 'Notification';
  let removeAfter = 4000;
  let position = 'bottom-center';
  let showCustom = false;

  export let setItem = null;

  const {
    addNotification,
    clearNotifications,
  } = getNotificationsContext();

  const setPosition = ({ target }) => {
    if (target && target.id) {
      position = target.id;
    }
  }

  const toggleCustom = () => {
    
    showCustom = !showCustom;
    setItem();
    console.log('toggled to ', showCustom);
    clearNotifications();
  }
</script>

<div class="example">
  <div class="example-title">
    <h1>
      Svelte notifications
      <a
        href="https://github.com/keenethics/svelte-notifications"
        target="_blank"
        rel="noopener noreferrer"
      >
        v0.9.7
      </a>
    </h1>
    <p>Extremely simple and flexible notifications for Svelte</p>
  </div>
  <div class="row">
    <div class="col col-1-3">
      <label for="notification-text">
        Message
      </label>
      <input
        id="notification-text"
        type="text"
        bind:value={text}
      />
    </div>
    <div class="col col-1-3">
      <label for="notification-remove-after">
        Remove after (ms)
      </label>
      <input
        id="notification-remove-after"
        type="text"
        bind:value={removeAfter}
      />
    </div>
    <div class="col col-1-3">
      <label for="notification-position">
        Position
      </label>
      <div class="position-select">
        <div class="position-select-row">
          <button class="top-left {position === "top-left" ? "active" : ""}" id="top-left" on:click={setPosition}>&nwarr;</button>
          <button class="top-center {position === "top-center" ? "active" : ""}" id="top-center" on:click={setPosition}>&uarr;</button>
          <button class="top-right {position === "top-right" ? "active" : ""}" id="top-right" on:click={setPosition}>&nearr;</button>
        </div>
        <div class="position-select-row">
          <button class="bottom-left {position === "bottom-left" ? "active" : ""}" id="bottom-left" on:click={setPosition}>&swarr;</button>
          <button class="bottom-center {position === "bottom-center" ? "active" : ""}" id="bottom-center" on:click={setPosition}>&darr;</button>
          <button class="bottom-right {position === "bottom-right" ? "active": ""}" id="bottom-right" on:click={setPosition}>&searr;</button>
        </div>
      </div>
    </div>
    <div class="col col-1-5 show-custom">
      <input type="checkbox" bind:checked={showCustom} id="show-custom">
      <span class="toggle" on:click={toggleCustom}></span>
      <label
        for="show-custom"
        class={`label-show-custom ${showCustom ? 'active' : ''}`}
      >
        Show custom notification
      </label>
    </div>
  </div>
  <button
    on:click={() => addNotification({
      id: new Date().getTime(),
      text,
      removeAfter,
      position,
    })}
    class="button"
  >
    Create
  </button>
  <button
    on:click={() => clearNotifications()}
    class="button secondary"
  >
    Clear all
  </button>
</div>
