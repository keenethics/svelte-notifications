import {
  blur,
  crossfade,
  draw,
  fade,
  fly,
  scale,
  slide,
} from 'svelte/transition';

const transitions = {
  blur: blur,
  crossfade: crossfade,
  draw: draw,
  fade: fade,
  fly: fly,
  scale: scale,
  slide: slide,
};

export function getTransition (type) {
  if (transitions[type]) {
    return transitions[type];
  } else {
    return fade;
  }
}

export default transitions;
