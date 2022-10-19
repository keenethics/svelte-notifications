<script>
  import { getNotificationsContext } from '../src';

  export let toggleItemType = () => {};

  let text = 'Notification';
  let removeAfter = 4000;
  let position = 'bottom-center';
  let showCustom = false;
  let showDanger = false;

  const {
    addNotification,
    clearNotifications,
  } = getNotificationsContext();

  const setPosition = ({ target }) => {
    if (target && target.id) {
      position = target.id;
    }
  };

  const toggleCustom = () => {
    showCustom = !showCustom;

    if (showCustom) showDanger = false;

    toggleItemType();
    clearNotifications();
  };

  const toggleDanger = () => {
    showDanger = !showDanger;

    clearNotifications();
  };
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
        v0.9.97
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
          <button
            class="top-left"
            class:active={position === 'top-left'}
            id="top-left"
            on:click={setPosition}
          >
            &nwarr;
          </button>
          <button
            class="top-center"
            class:active={position === 'top-center'}
            id="top-center"
            on:click={setPosition}
          >
            &uarr;
          </button>
          <button
            class="top-right"
            class:active={position === 'top-right'}
            id="top-right"
            on:click={setPosition}
          >
            &nearr;
          </button>
        </div>
        <div class="position-select-row">
          <button
            class="bottom-left"
            class:active={position === 'bottom-left'}
            id="bottom-left"
            on:click={setPosition}
          >
            &swarr;
          </button>
          <button
            class="bottom-center"
            class:active={position === 'bottom-center'}
            id="bottom-center"
            on:click={setPosition}
          >
            &darr;
          </button>
          <button
            class="bottom-right"
            class:active={position === 'bottom-right'}
            id="bottom-right"
            on:click={setPosition}
          >
            &searr;
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="additional-tools">
    <div class="col col-1-3 show-custom">
      <input type="checkbox" bind:checked={showCustom} id="show-custom">
      <span
        class="toggle toggle-custom"
        on:click={toggleCustom}
        role="presentation"
      />
      <label
        for="show-custom"
        class={`label-show-custom ${showCustom ? 'active' : ''}`}
      >
        Show custom notification
      </label>
    </div>
    {#if !showCustom}
      <div class="col col-1-3 show-custom">
        <input type="checkbox" bind:checked={showDanger} id="show-danger">
        <span
          class="toggle toggle-danger"
          on:click={toggleDanger}
          role="presentation"
        />
        <label
          for="show-danger"
          class={`label-show-custom ${showDanger ? 'active' : ''}`}
        >
          Show error notification
        </label>
      </div>
    {/if}
  </div>
  <button
    on:click={() => addNotification({
      id: new Date().getTime(),
      text,
      removeAfter,
      position,
      type: showDanger && 'error',
      customClass: 'default-custom-class',
    })}
    class="button"
    id="create-button"
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
