import { createRoot } from "react-dom/client";
import { useAppState } from "./helpers/appState/appStateRenderer";
import React from "react";
import { createIncrementAction } from "./helpers/appState/appStateCommon";

const App = () => {
  const [appState, dispatch] = useAppState();
  return (
    <div>
      <h1>Hello World</h1>
      <p>Count: {appState.count}</p>
      <button
        onClick={() => {
          dispatch(createIncrementAction());
        }}
      >
        Increment
      </button>
    </div>
  );
};

const rootElement = document.querySelector("#root");

if (!rootElement) {
  throw new Error("Could not find rootElement");
}

const root = createRoot(rootElement);
root.render(<App />);
