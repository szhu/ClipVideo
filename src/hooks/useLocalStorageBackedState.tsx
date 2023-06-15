import { useState } from "react";

export default function useLocalStorageOrState<T>(
  localStorageKey: string,
  defaultValue: T,
) {
  const [value, rawSetValue] = useState<T>(() => {
    const storedValue = localStorage.getItem(localStorageKey);
    if (storedValue) {
      return JSON.parse(storedValue);
    } else {
      return defaultValue;
    }
  });

  function setValue(newValueOrUpdater: T | ((oldValue: T) => T)): void {
    rawSetValue((oldValue) => {
      const newValue =
        typeof newValueOrUpdater === "function"
          ? (newValueOrUpdater as (oldValue: T) => T)(oldValue)
          : newValueOrUpdater;
      localStorage.setItem(localStorageKey, JSON.stringify(newValue));
      return newValue;
    });
  }

  return [value, setValue] as const;
}
