// https://github.com/radix-ui/website/blob/11f0607c5130fb3b5d082962fdc17d1846511c47/utils/use-effect-event.ts#L3-L14

import * as React from "react";

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function useEffectEvent<T extends Function>(fn: T): T {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = React.useRef<any>(() => {
    throw new Error("Cannot call an event handler while rendering.");
  });
  React.useInsertionEffect(() => {
    ref.current = fn;
  }, [fn]);
  return React.useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (...args: any[]) => ref.current?.(...args),
    [ref]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) as any;
}
