export default function createSetStateForKey<State, K extends keyof State>(
  setData: (newData: State | ((oldData: State) => State)) => void,
  key: K,
): (newValueOrUpdater: State[K] | ((oldValue: State[K]) => State[K])) => void {
  return (newValueOrUpdater) => {
    setData((oldData) => {
      const newValue =
        typeof newValueOrUpdater === "function"
          ? (newValueOrUpdater as (oldValue: State[K]) => State[K])(
              oldData[key],
            )
          : newValueOrUpdater;
      return {
        ...oldData,
        [key]: newValue,
      };
    });
  };
}
