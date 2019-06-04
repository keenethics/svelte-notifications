<script>
  import { getContext } from '../src';

  let text = 'Notification';
  let removeAfter = 4000;
  let position = 'bottom-center';

  const {
    add,
    clear,
  } = getContext();
</script>

<div class="example">
  <div class="example-title">
    <h1>
      Svelte notifications
      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
      >
        v0.8.0
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
      <!-- <div class="position-select">
        <div class="position-select-row">
          <button class="top-left active">&nwarr;</button>
          <button class="top-center">&uarr;</button>
          <button class="top-right">&nearr;</button>
        </div>
        <div class="position-select-row">
          <button class="bottom-left">&swarr;</button>
          <button class="bottom-center">&darr;</button>
          <button class="bottom-right">&searr;</button>
        </div>
      </div> -->
      <div class="select">
        <select id="position" bind:value={position}>
          <option value="top-left">Top left</option>
          <option value="top-center">Top center</option>
          <option value="top-right">Top right</option>
          <option value="bottom-left">Bottom left</option>
          <option value="bottom-center">Bottom center</option>
          <option value="bottom-right">Bottom right</option>
        </select>
      </div>
    </div>
  </div>
  <button
    on:click={() => add({
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
    on:click={() => clear()}
    class="button secondary"
  >
    Clear all
  </button>
</div>
