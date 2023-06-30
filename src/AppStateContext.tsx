import React, { useState, useEffect, useContext } from "react";
import { AppState } from "./helpers/appState";

const AppStateContext = React.createContext<AppState | undefined>(undefined);

export const AppStateContextProvider = ({
  initialState,
  children,
}: {
  initialState: AppState;
  children: React.ReactNode;
}) => {
  const [appState, setAppState] = useState<AppState>(initialState);

  useEffect(() => {
    window.appState.onSyncState(setAppState);
  }, []);

  return (
    <AppStateContext.Provider value={appState}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = (): AppState => {
  const appState = useContext(AppStateContext);

  if (appState === undefined) {
    throw new Error("`useAppState` was used outside of Provider");
  }
  return appState;
};
