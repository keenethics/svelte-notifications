function noop() { }
function assign(tar, src) {
    for (const k in src)
        tar[k] = src[k];
    return tar;
}
function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}
function is_function(thing) {
    return typeof thing === 'function';
}
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}
function subscribe(component, store, callback) {
    const unsub = store.subscribe(callback);
    component.$$.on_destroy.push(unsub.unsubscribe
        ? () => unsub.unsubscribe()
        : unsub);
}
function create_slot(definition, ctx, fn) {
    if (definition) {
        const slot_ctx = get_slot_context(definition, ctx, fn);
        return definition[0](slot_ctx);
    }
}
function get_slot_context(definition, ctx, fn) {
    return definition[1]
        ? assign({}, assign(ctx.$$scope.ctx, definition[1](fn ? fn(ctx) : {})))
        : ctx.$$scope.ctx;
}
function get_slot_changes(definition, ctx, changed, fn) {
    return definition[1]
        ? assign({}, assign(ctx.$$scope.changed || {}, definition[1](fn ? fn(changed) : {})))
        : ctx.$$scope.changed || {};
}

function append(target, node) {
    target.appendChild(node);
}
function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
}
function detach(node) {
    node.parentNode.removeChild(node);
}
function destroy_each(iterations, detaching) {
    for (let i = 0; i < iterations.length; i += 1) {
        if (iterations[i])
            iterations[i].d(detaching);
    }
}
function element(name) {
    return document.createElement(name);
}
function text(data) {
    return document.createTextNode(data);
}
function space() {
    return text(' ');
}
function empty() {
    return text('');
}
function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
}
function children(element) {
    return Array.from(element.childNodes);
}
function set_data(text, data) {
    data = '' + data;
    if (text.data !== data)
        text.data = data;
}

let current_component;
function set_current_component(component) {
    current_component = component;
}
function get_current_component() {
    if (!current_component)
        throw new Error(`Function called outside component initialization`);
    return current_component;
}
function onDestroy(fn) {
    get_current_component().$$.on_destroy.push(fn);
}
function setContext(key, context) {
    get_current_component().$$.context.set(key, context);
}
function getContext(key) {
    return get_current_component().$$.context.get(key);
}

const dirty_components = [];
const resolved_promise = Promise.resolve();
let update_scheduled = false;
const binding_callbacks = [];
const render_callbacks = [];
const flush_callbacks = [];
function schedule_update() {
    if (!update_scheduled) {
        update_scheduled = true;
        resolved_promise.then(flush);
    }
}
function add_render_callback(fn) {
    render_callbacks.push(fn);
}
function flush() {
    const seen_callbacks = new Set();
    do {
        // first, call beforeUpdate functions
        // and update components
        while (dirty_components.length) {
            const component = dirty_components.shift();
            set_current_component(component);
            update(component.$$);
        }
        while (binding_callbacks.length)
            binding_callbacks.shift()();
        // then, once components are updated, call
        // afterUpdate functions. This may cause
        // subsequent updates...
        while (render_callbacks.length) {
            const callback = render_callbacks.pop();
            if (!seen_callbacks.has(callback)) {
                callback();
                // ...so guard against infinite loops
                seen_callbacks.add(callback);
            }
        }
    } while (dirty_components.length);
    while (flush_callbacks.length) {
        flush_callbacks.pop()();
    }
    update_scheduled = false;
}
function update($$) {
    if ($$.fragment) {
        $$.update($$.dirty);
        run_all($$.before_render);
        $$.fragment.p($$.dirty, $$.ctx);
        $$.dirty = null;
        $$.after_render.forEach(add_render_callback);
    }
}
let outros;
function group_outros() {
    outros = {
        remaining: 0,
        callbacks: []
    };
}
function check_outros() {
    if (!outros.remaining) {
        run_all(outros.callbacks);
    }
}
function on_outro(callback) {
    outros.callbacks.push(callback);
}

function destroy_block(block, lookup) {
    block.d(1);
    lookup.delete(block.key);
}
function outro_and_destroy_block(block, lookup) {
    on_outro(() => {
        destroy_block(block, lookup);
    });
    block.o(1);
}
function update_keyed_each(old_blocks, changed, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
    let o = old_blocks.length;
    let n = list.length;
    let i = o;
    const old_indexes = {};
    while (i--)
        old_indexes[old_blocks[i].key] = i;
    const new_blocks = [];
    const new_lookup = new Map();
    const deltas = new Map();
    i = n;
    while (i--) {
        const child_ctx = get_context(ctx, list, i);
        const key = get_key(child_ctx);
        let block = lookup.get(key);
        if (!block) {
            block = create_each_block(key, child_ctx);
            block.c();
        }
        else if (dynamic) {
            block.p(changed, child_ctx);
        }
        new_lookup.set(key, new_blocks[i] = block);
        if (key in old_indexes)
            deltas.set(key, Math.abs(i - old_indexes[key]));
    }
    const will_move = new Set();
    const did_move = new Set();
    function insert(block) {
        if (block.i)
            block.i(1);
        block.m(node, next);
        lookup.set(block.key, block);
        next = block.first;
        n--;
    }
    while (o && n) {
        const new_block = new_blocks[n - 1];
        const old_block = old_blocks[o - 1];
        const new_key = new_block.key;
        const old_key = old_block.key;
        if (new_block === old_block) {
            // do nothing
            next = new_block.first;
            o--;
            n--;
        }
        else if (!new_lookup.has(old_key)) {
            // remove old block
            destroy(old_block, lookup);
            o--;
        }
        else if (!lookup.has(new_key) || will_move.has(new_key)) {
            insert(new_block);
        }
        else if (did_move.has(old_key)) {
            o--;
        }
        else if (deltas.get(new_key) > deltas.get(old_key)) {
            did_move.add(new_key);
            insert(new_block);
        }
        else {
            will_move.add(old_key);
            o--;
        }
    }
    while (o--) {
        const old_block = old_blocks[o];
        if (!new_lookup.has(old_block.key))
            destroy(old_block, lookup);
    }
    while (n)
        insert(new_blocks[n - 1]);
    return new_blocks;
}
function mount_component(component, target, anchor) {
    const { fragment, on_mount, on_destroy, after_render } = component.$$;
    fragment.m(target, anchor);
    // onMount happens after the initial afterUpdate. Because
    // afterUpdate callbacks happen in reverse order (inner first)
    // we schedule onMount callbacks before afterUpdate callbacks
    add_render_callback(() => {
        const new_on_destroy = on_mount.map(run).filter(is_function);
        if (on_destroy) {
            on_destroy.push(...new_on_destroy);
        }
        else {
            // Edge case - component was destroyed immediately,
            // most likely as a result of a binding initialising
            run_all(new_on_destroy);
        }
        component.$$.on_mount = [];
    });
    after_render.forEach(add_render_callback);
}
function destroy(component, detaching) {
    if (component.$$) {
        run_all(component.$$.on_destroy);
        component.$$.fragment.d(detaching);
        // TODO null out other refs, including component.$$ (but need to
        // preserve final state?)
        component.$$.on_destroy = component.$$.fragment = null;
        component.$$.ctx = {};
    }
}
function make_dirty(component, key) {
    if (!component.$$.dirty) {
        dirty_components.push(component);
        schedule_update();
        component.$$.dirty = blank_object();
    }
    component.$$.dirty[key] = true;
}
function init(component, options, instance, create_fragment, not_equal$$1, prop_names) {
    const parent_component = current_component;
    set_current_component(component);
    const props = options.props || {};
    const $$ = component.$$ = {
        fragment: null,
        ctx: null,
        // state
        props: prop_names,
        update: noop,
        not_equal: not_equal$$1,
        bound: blank_object(),
        // lifecycle
        on_mount: [],
        on_destroy: [],
        before_render: [],
        after_render: [],
        context: new Map(parent_component ? parent_component.$$.context : []),
        // everything else
        callbacks: blank_object(),
        dirty: null
    };
    let ready = false;
    $$.ctx = instance
        ? instance(component, props, (key, value) => {
            if ($$.ctx && not_equal$$1($$.ctx[key], $$.ctx[key] = value)) {
                if ($$.bound[key])
                    $$.bound[key](value);
                if (ready)
                    make_dirty(component, key);
            }
        })
        : props;
    $$.update();
    ready = true;
    run_all($$.before_render);
    $$.fragment = create_fragment($$.ctx);
    if (options.target) {
        if (options.hydrate) {
            $$.fragment.l(children(options.target));
        }
        else {
            $$.fragment.c();
        }
        if (options.intro && component.$$.fragment.i)
            component.$$.fragment.i();
        mount_component(component, options.target, options.anchor);
        flush();
    }
    set_current_component(parent_component);
}
class SvelteComponent {
    $destroy() {
        destroy(this, true);
        this.$destroy = noop;
    }
    $on(type, callback) {
        const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
        callbacks.push(callback);
        return () => {
            const index = callbacks.indexOf(callback);
            if (index !== -1)
                callbacks.splice(index, 1);
        };
    }
    $set() {
        // overridden by instance, if it has props
    }
}

const context = {};

var getContext$1 = () => getContext(context);

/* src/components/Notification.svelte generated by Svelte v3.4.4 */

function add_css() {
	var style = element("style");
	style.id = 'svelte-1xxutyh-style';
	style.textContent = ".notification.svelte-1xxutyh{display:flex;align-items:stretch;justify-content:space-between;margin:12px;background:#fff;color:#000;border-radius:6px}.notification-context.svelte-1xxutyh{width:210px;padding:12px 6px 12px 12px;box-sizing:border-box;word-wrap:break-word}button.svelte-1xxutyh{display:block;width:40px;padding:0 0 2px;margin:0;border:none;border-left:1px solid #eee;outline:none;background:none;cursor:pointer;font-size:20px;color:#000;box-sizing:border-box}button.svelte-1xxutyh:hover{background:rgba(0, 0, 0, 0.01)}";
	append(document.head, style);
}

function create_fragment(ctx) {
	var div1, div0, t0_value = ctx.notification.text, t0, t1, button, current, dispose;

	const default_slot_1 = ctx.$$slots.default;
	const default_slot = create_slot(default_slot_1, ctx, null);

	return {
		c() {
			div1 = element("div");
			div0 = element("div");

			if (!default_slot) {
				t0 = text(t0_value);
			}

			if (default_slot) default_slot.c();
			t1 = space();
			button = element("button");
			button.textContent = "×";

			div0.className = "notification-context svelte-1xxutyh";
			button.className = "svelte-1xxutyh";
			div1.className = "notification svelte-1xxutyh";
			dispose = listen(button, "click", ctx.deleteNotifications);
		},

		l(nodes) {
			if (default_slot) default_slot.l(div0_nodes);
		},

		m(target, anchor) {
			insert(target, div1, anchor);
			append(div1, div0);

			if (!default_slot) {
				append(div0, t0);
			}

			else {
				default_slot.m(div0, null);
			}

			append(div1, t1);
			append(div1, button);
			current = true;
		},

		p(changed, ctx) {
			if (!default_slot) {
				if ((!current || changed.notification) && t0_value !== (t0_value = ctx.notification.text)) {
					set_data(t0, t0_value);
				}
			}

			if (default_slot && default_slot.p && changed.$$scope) {
				default_slot.p(get_slot_changes(default_slot_1, ctx, changed, null), get_slot_context(default_slot_1, ctx, null));
			}
		},

		i(local) {
			if (current) return;
			if (default_slot && default_slot.i) default_slot.i(local);
			current = true;
		},

		o(local) {
			if (default_slot && default_slot.o) default_slot.o(local);
			current = false;
		},

		d(detaching) {
			if (detaching) {
				detach(div1);
			}

			if (default_slot) default_slot.d(detaching);
			dispose();
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	

  let { notification } = $$props;

  const { id, deleteAfter } = notification;

  const { remove } = getContext$1();

  const deleteNotifications = () => remove(id);
  const timeout = setTimeout(() => deleteNotifications(), deleteAfter || 4000);

  onDestroy(() => {
    if (timeout) clearTimeout(timeout);
  });

	let { $$slots = {}, $$scope } = $$props;

	$$self.$set = $$props => {
		if ('notification' in $$props) $$invalidate('notification', notification = $$props.notification);
		if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
	};

	return {
		notification,
		deleteNotifications,
		$$slots,
		$$scope
	};
}

class Notification extends SvelteComponent {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-1xxutyh-style")) add_css();
		init(this, options, instance, create_fragment, safe_not_equal, ["notification"]);
	}
}

/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 * @param {*=}value initial value
 * @param {StartStopNotifier=}start start and stop notifications for subscriptions
 */
function writable(value, start = noop) {
    let stop;
    const subscribers = [];
    function set(new_value) {
        if (safe_not_equal(value, new_value)) {
            value = new_value;
            if (!stop) {
                return; // not ready
            }
            subscribers.forEach((s) => s[1]());
            subscribers.forEach((s) => s[0](value));
        }
    }
    function update(fn) {
        set(fn(value));
    }
    function subscribe(run, invalidate = noop) {
        const subscriber = [run, invalidate];
        subscribers.push(subscriber);
        if (subscribers.length === 1) {
            stop = start(set) || noop;
        }
        run(value);
        return () => {
            const index = subscribers.indexOf(subscriber);
            if (index !== -1) {
                subscribers.splice(index, 1);
            }
            if (subscribers.length === 0) {
                stop();
            }
        };
    }
    return { set, update, subscribe };
}

const addNotification = (notification, update) => {
  if (!notification || typeof notification !== 'object') return;
  if (notification && (!notification.id && !notification.text)) return;

  update((notifications) => {
    return [...notifications, notification];
  });
};

const removeNotification = (notificationId, update) => update((notifications) => {
  return notifications.filter(n => n.id !== notificationId);
});

const clearNotifications = set => set([]);

const createNotificationsStore = () => {
  const {
    subscribe,
    set,
    update,
  } = writable([]);

  return {
    subscribe,
    add: notification => addNotification(notification, update),
    remove: notificationId => removeNotification(notificationId, update),
    clear: () => clearNotifications(set),
  };
};

var store = createNotificationsStore();

/* src/components/Notifications.svelte generated by Svelte v3.4.4 */

function add_css$1() {
	var style = element("style");
	style.id = 'svelte-5bjxbr-style';
	style.textContent = ".notification-top-left.svelte-5bjxbr,.notification-top-center.svelte-5bjxbr,.notification-top-right.svelte-5bjxbr,.notification-bottom-left.svelte-5bjxbr,.notification-bottom-center.svelte-5bjxbr,.notification-bottom-right.svelte-5bjxbr{position:fixed;width:270px}.notification-top-left.svelte-5bjxbr{top:0;left:0}.notification-top-center.svelte-5bjxbr{top:0;left:50%;transform:translateX(-50%)}.notification-top-right.svelte-5bjxbr{top:0;right:0}.notification-bottom-left.svelte-5bjxbr{bottom:0;left:0}.notification-bottom-center.svelte-5bjxbr{bottom:0;left:50%;transform:translateX(-50%)}.notification-bottom-right.svelte-5bjxbr{bottom:0;right:0}";
	append(document.head, style);
}

function get_each_context_1(ctx, list, i) {
	const child_ctx = Object.create(ctx);
	child_ctx.notification = list[i];
	return child_ctx;
}

function get_each_context(ctx, list, i) {
	const child_ctx = Object.create(ctx);
	child_ctx.position = list[i];
	return child_ctx;
}

// (64:8) {#if notification.position === position}
function create_if_block(ctx) {
	var current;

	var notification = new Notification({ props: { notification: ctx.notification } });

	return {
		c() {
			notification.$$.fragment.c();
		},

		m(target, anchor) {
			mount_component(notification, target, anchor);
			current = true;
		},

		p(changed, ctx) {
			var notification_changes = {};
			if (changed.$store) notification_changes.notification = ctx.notification;
			notification.$set(notification_changes);
		},

		i(local) {
			if (current) return;
			notification.$$.fragment.i(local);

			current = true;
		},

		o(local) {
			notification.$$.fragment.o(local);
			current = false;
		},

		d(detaching) {
			notification.$destroy(detaching);
		}
	};
}

// (63:6) {#each $store as notification (notification.id)}
function create_each_block_1(key_1, ctx) {
	var first, if_block_anchor, current;

	var if_block = (ctx.notification.position === ctx.position) && create_if_block(ctx);

	return {
		key: key_1,

		first: null,

		c() {
			first = empty();
			if (if_block) if_block.c();
			if_block_anchor = empty();
			this.first = first;
		},

		m(target, anchor) {
			insert(target, first, anchor);
			if (if_block) if_block.m(target, anchor);
			insert(target, if_block_anchor, anchor);
			current = true;
		},

		p(changed, ctx) {
			if (ctx.notification.position === ctx.position) {
				if (if_block) {
					if_block.p(changed, ctx);
					if_block.i(1);
				} else {
					if_block = create_if_block(ctx);
					if_block.c();
					if_block.i(1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				group_outros();
				on_outro(() => {
					if_block.d(1);
					if_block = null;
				});

				if_block.o(1);
				check_outros();
			}
		},

		i(local) {
			if (current) return;
			if (if_block) if_block.i();
			current = true;
		},

		o(local) {
			if (if_block) if_block.o();
			current = false;
		},

		d(detaching) {
			if (detaching) {
				detach(first);
			}

			if (if_block) if_block.d(detaching);

			if (detaching) {
				detach(if_block_anchor);
			}
		}
	};
}

// (61:2) {#each positions as position}
function create_each_block(ctx) {
	var div, each_blocks = [], each_1_lookup = new Map(), t, div_class_value, current;

	var each_value_1 = ctx.$store;

	const get_key = ctx => ctx.notification.id;

	for (var i = 0; i < each_value_1.length; i += 1) {
		let child_ctx = get_each_context_1(ctx, each_value_1, i);
		let key = get_key(child_ctx);
		each_1_lookup.set(key, each_blocks[i] = create_each_block_1(key, child_ctx));
	}

	return {
		c() {
			div = element("div");

			for (i = 0; i < each_blocks.length; i += 1) each_blocks[i].c();

			t = space();
			div.className = div_class_value = "" + (`notification-${ctx.position}`) + " svelte-5bjxbr";
		},

		m(target, anchor) {
			insert(target, div, anchor);

			for (i = 0; i < each_blocks.length; i += 1) each_blocks[i].m(div, null);

			append(div, t);
			current = true;
		},

		p(changed, ctx) {
			const each_value_1 = ctx.$store;

			group_outros();
			each_blocks = update_keyed_each(each_blocks, changed, get_key, 1, ctx, each_value_1, each_1_lookup, div, outro_and_destroy_block, create_each_block_1, t, get_each_context_1);
			check_outros();
		},

		i(local) {
			if (current) return;
			for (var i = 0; i < each_value_1.length; i += 1) each_blocks[i].i();

			current = true;
		},

		o(local) {
			for (i = 0; i < each_blocks.length; i += 1) each_blocks[i].o();

			current = false;
		},

		d(detaching) {
			if (detaching) {
				detach(div);
			}

			for (i = 0; i < each_blocks.length; i += 1) each_blocks[i].d();
		}
	};
}

function create_fragment$1(ctx) {
	var t, div, current;

	const default_slot_1 = ctx.$$slots.default;
	const default_slot = create_slot(default_slot_1, ctx, null);

	var each_value = ctx.positions;

	var each_blocks = [];

	for (var i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	function outro_block(i, detaching, local) {
		if (each_blocks[i]) {
			if (detaching) {
				on_outro(() => {
					each_blocks[i].d(detaching);
					each_blocks[i] = null;
				});
			}

			each_blocks[i].o(local);
		}
	}

	return {
		c() {
			if (default_slot) default_slot.c();
			t = space();
			div = element("div");

			for (var i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			div.className = "notifications";
		},

		l(nodes) {
			if (default_slot) default_slot.l(nodes);
		},

		m(target, anchor) {
			if (default_slot) {
				default_slot.m(target, anchor);
			}

			insert(target, t, anchor);
			insert(target, div, anchor);

			for (var i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}

			current = true;
		},

		p(changed, ctx) {
			if (default_slot && default_slot.p && changed.$$scope) {
				default_slot.p(get_slot_changes(default_slot_1, ctx, changed, null), get_slot_context(default_slot_1, ctx, null));
			}

			if (changed.positions || changed.$store) {
				each_value = ctx.positions;

				for (var i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(changed, child_ctx);
						each_blocks[i].i(1);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].i(1);
						each_blocks[i].m(div, null);
					}
				}

				group_outros();
				for (; i < each_blocks.length; i += 1) outro_block(i, 1, 1);
				check_outros();
			}
		},

		i(local) {
			if (current) return;
			if (default_slot && default_slot.i) default_slot.i(local);

			for (var i = 0; i < each_value.length; i += 1) each_blocks[i].i();

			current = true;
		},

		o(local) {
			if (default_slot && default_slot.o) default_slot.o(local);

			each_blocks = each_blocks.filter(Boolean);
			for (let i = 0; i < each_blocks.length; i += 1) outro_block(i, 0);

			current = false;
		},

		d(detaching) {
			if (default_slot) default_slot.d(detaching);

			if (detaching) {
				detach(t);
				detach(div);
			}

			destroy_each(each_blocks, detaching);
		}
	};
}

function instance$1($$self, $$props, $$invalidate) {
	let $store;

	subscribe($$self, store, $$value => { $store = $$value; $$invalidate('$store', $store); });

	

  setContext(context, store);

  const positions = [
    'top-left',
    'top-center',
    'top-right',
    'bottom-left',
    'bottom-center',
    'bottom-right',
  ];

	let { $$slots = {}, $$scope } = $$props;

	$$self.$set = $$props => {
		if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
	};

	return { positions, $store, $$slots, $$scope };
}

class Notifications extends SvelteComponent {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-5bjxbr-style")) add_css$1();
		init(this, options, instance$1, create_fragment$1, safe_not_equal, []);
	}
}

export { Notifications, getContext$1 as getContext };
