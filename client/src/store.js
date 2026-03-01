/**
 * Global app store — replaces statezero.
 * Exports a statezero-compatible API (setState, getState, subscribe, unsubscribe)
 * so no logic in action files or components needs to change.
 */
import { create } from "zustand";

const useAppStore = create(() => ({}));

export default useAppStore;

/** Set a value at a dot-notation path, e.g. setState("loginForm.username", "alice") */
export const setState = (path, value) => {
  if (typeof path === "string" && path.includes(".")) {
    const dotIndex = path.indexOf(".");
    const parent = path.substring(0, dotIndex);
    const key = path.substring(dotIndex + 1);
    useAppStore.setState(state => ({
      [parent]: { ...(state[parent] || {}), [key]: value }
    }));
  } else {
    useAppStore.setState({ [path]: value });
  }
};

/** Get a value at a dot-notation path, or the full state if no path given */
export const getState = path => {
  const state = useAppStore.getState();
  if (path === undefined) return state;
  if (typeof path === "string" && path.includes(".")) {
    const dotIndex = path.indexOf(".");
    const parent = path.substring(0, dotIndex);
    const key = path.substring(dotIndex + 1);
    return state[parent]?.[key];
  }
  return state[path];
};

/**
 * Subscribe to state changes.
 * If filterFn is provided (as in BaseReactComponent.filterState),
 * the callback is only invoked when the filtered result actually changes.
 */
export const subscribe = (callback, filterFn) => {
  let prevResultStr;
  return useAppStore.subscribe(state => {
    const result = filterFn ? filterFn(state) : state;
    const resultStr = JSON.stringify(result);
    if (resultStr !== prevResultStr) {
      prevResultStr = resultStr;
      callback(result);
    }
  });
};

/** Unsubscribe from a subscription returned by subscribe() */
export const unsubscribe = subscription => {
  if (typeof subscription === "function") {
    subscription();
  }
};

