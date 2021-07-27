import * as Vue from 'vue';

const isVue2 = false;
const isVue3 = true;
const Vue2 = undefined;

export { createApp, createSSRApp, h, version, nextTick } from 'vue';
export { Vue, Vue2, isVue2, isVue3 };

export function renderCompat(fn) {
  function h(tag, props, children) {
    if (typeof props === 'object' && (props.attrs || props.props)) {
      // In vue 3, we no longer wrap with `attrs` or `props` key.
      const flatProps = Object.assign({}, props, props.attrs, props.props);
      delete flatProps.attrs;
      delete flatProps.props;

      return Vue.h(tag, flatProps, children);
    }

    return Vue.h(tag, props, children);
  }

  return function() {
    return fn.call(this, h);
  };
}

export function getDefaultSlot(component) {
  return component.$slots.default && component.$slots.default();
}

export async function renderToString(app) {
  let module;
  try {
    // It's an optional peer dependency, so it might be there.
    // eslint-disable-next-line import/no-unresolved
    module = await import('@vue/server-renderer');
  } catch (err) {
    // error is handled by regular if, in case it's `undefined`
  }
  if (!module) {
    throw new Error('you need to install @vue/server-renderer');
  }
  return module.renderToString(app);
}
