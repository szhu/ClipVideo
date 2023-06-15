import { useEffect } from "react";

export default function useEventListener<
  K extends keyof (WindowEventMap & ElementEventMap),
>(
  target: Window | Element,
  type: K,
  listener: (
    this: Window | Element,
    ev: (WindowEventMap & ElementEventMap)[K],
  ) => any,
  options?: boolean | AddEventListenerOptions,
) {
  useEffect(() => {
    target.addEventListener(type, listener as any, options);

    return () => {
      target.removeEventListener(type, listener as any, options);
    };
  }, [target, type, listener, options]);
}
