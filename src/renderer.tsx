import "./css/main.css";
import { createRoot } from "react-dom/client";
import React from "react";
import { HomePage } from "./components/HomePage";
import { SettingsPage } from "./components/SettingsPage";
import { AppStateContextProvider } from "./helpers/AppStateContext";
import { ipcClient } from "./helpers/ipcClient";

(async () => {
  const initialState = await ipcClient.getState();
  const rootElement = document.querySelector("#root");

  if (!rootElement) {
    throw new Error("Could not find rootElement");
  }

  const isSettings = window.location.hash === "#settings";

  const root = createRoot(rootElement);
  root.render(
    <AppStateContextProvider initialState={initialState}>
      {isSettings ? <SettingsPage /> : <HomePage />}
    </AppStateContextProvider>,
  );
})().catch(console.error);
