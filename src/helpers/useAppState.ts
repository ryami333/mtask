import { useState, useEffect } from "react";
import type { AppState } from "./state";

export const useAppState = (): AppState => {
  const [appState, setAppState] = useState<AppState>(
    window.appState.initialState
  );

  useEffect(() => {
    window.appState.onUpdate(setAppState);
  }, []);

  return appState;
};
