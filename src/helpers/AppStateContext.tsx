import React, { useState, useEffect, useContext } from "react";
import { AppState } from "./appState";
import { ipcClient } from "./ipcClient";

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
    ipcClient.onSyncState(setAppState);
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
