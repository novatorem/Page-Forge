/**
 * Global app store - replaces statezero.
 * Exports a statezero-compatible API (setState, getState, subscribe, unsubscribe)
 * so no logic in action files or components needs to change.
 */
import { create } from "zustand";

const useAppStore = create(() => ({}));

export { useAppStore };
export default useAppStore;

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

export const subscribe = (callback, filterFn) => {
  let previousSnapshot;
  return useAppStore.subscribe(state => {
    const result = filterFn ? filterFn(state) : state;
    const currentSnapshot = JSON.stringify(result);
    if (currentSnapshot !== previousSnapshot) {
      previousSnapshot = currentSnapshot;
      callback(result);
    }
  });
};

export const unsubscribe = subscription => {
  if (typeof subscription === "function") {
    subscription();
  }
};
