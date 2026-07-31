"use client";

import {
  useCallback,
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

type UsePersistentStateOptions<T> = {
  serialize?: (value: T) => string;
  deserialize?: (value: string) => T;
};

export default function usePersistentState<T>(
  key: string,
  initialValue: T,
  options: UsePersistentStateOptions<T> = {},
): [T, Dispatch<SetStateAction<T>>] {
  const {
    serialize = JSON.stringify,
    deserialize = JSON.parse,
  } = options;

  const [value, setValue] = useState<T>(initialValue);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const savedValue = window.localStorage.getItem(key);

    if (savedValue !== null) {
      try {
        setValue(deserialize(savedValue));
      } catch {
        setValue(initialValue);
      }
    }

    setIsHydrated(true);
  }, [deserialize, initialValue, key]);

  const setPersistentValue: Dispatch<SetStateAction<T>> =
    useCallback(
      (nextValue) => {
        setValue((currentValue) => {
          const resolvedValue =
            typeof nextValue === "function"
              ? (
                  nextValue as (
                    previousValue: T,
                  ) => T
                )(currentValue)
              : nextValue;

          if (isHydrated) {
            window.localStorage.setItem(
              key,
              serialize(resolvedValue),
            );
          }

          return resolvedValue;
        });
      },
      [isHydrated, key, serialize],
    );

  return [value, setPersistentValue];
}