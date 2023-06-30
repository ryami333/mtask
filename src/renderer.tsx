import "./main.css";
import { createRoot } from "react-dom/client";
import React from "react";
import { App } from "./App";
import { AppStateContextProvider } from "./AppStateContext";

(async () => {
  const initialState = await window.appState.getState();
  const rootElement = document.querySelector("#root");

  if (!rootElement) {
    throw new Error("Could not find rootElement");
  }

  const root = createRoot(rootElement);
  root.render(
    <AppStateContextProvider initialState={initialState}>
      <App />
    </AppStateContextProvider>
  );
})().catch(console.error);
