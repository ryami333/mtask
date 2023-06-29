import { Action, AppState, initialState } from "./appStateCommon";
import { useState, useCallback, useEffect } from "react";
import { reducer } from "./appStateCommon";

export const useAppState = (): [AppState, (action: Action) => void] => {
  const [appState, setAppState] = useState<AppState>(initialState);

  const dispatch = useCallback(
    (
      action: Action,
      { optimistic }: { optimistic?: boolean } = { optimistic: true }
    ) => {
      if (optimistic) {
        /**
         * "Optimistic" setState call ensures that UI is updated immediately,
         * though the main process will eventually emit the source-of-truth
         * back to the renderer process.
         */
        setAppState((current) => reducer(current, action));
      }

      window.appState.dispatch(action);
    },
    []
  );

  useEffect(() => {
    window.appState.onUpdate(setAppState);
  }, []);

  return [appState, dispatch];
};
