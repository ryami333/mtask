import "./css/renderer.css";
import { createRoot } from "react-dom/client";
import React from "react";
import { App } from "./components/App";
import { AppStateContextProvider } from "./helpers/AppStateContext";

(async () => {
  const initialState = await window.ipcClient.getState();
  const rootElement = document.querySelector("#root");

  if (!rootElement) {
    throw new Error("Could not find rootElement");
  }

  const root = createRoot(rootElement);
  root.render(
    <AppStateContextProvider initialState={initialState}>
      <App />
    </AppStateContextProvider>,
  );
})().catch(console.error);
