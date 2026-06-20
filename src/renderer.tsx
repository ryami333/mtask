import "./css/renderer.css";
import { createRoot } from "react-dom/client";
import React from "react";
import { App } from "./components/App";
import { initPersistence, useAppStore } from "./helpers/useAppStore";

(async () => {
  // Hydrate from disk before the first render so there's no empty-state flash,
  // then wire up persistence so the initial load doesn't echo back to disk.
  const persisted = await window.appState.getState();
  useAppStore.getState().hydrate(persisted);
  initPersistence();

  const rootElement = document.querySelector("#root");

  if (!rootElement) {
    throw new Error("Could not find rootElement");
  }

  const root = createRoot(rootElement);
  root.render(<App />);
})().catch(console.error);
