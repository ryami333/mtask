import { createRoot } from "react-dom/client";
import React, { useState } from "react";
import { v4 as createUuid } from "uuid";
import { useAppState } from "./helpers/useAppState";

const App = () => {
  const appState = useAppState();

  const [inputValue, setInputValue] = useState<string>("");

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          window.appState.actions.addTodo({
            uuid: createUuid(),
            title: inputValue,
          });
          setInputValue("");
        }}
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </form>
      {appState.todos.map((todo) => (
        <div key={todo.uuid}>
          <p>{todo.title}</p>
          <button onClick={() => window.appState.actions.removeTodo(todo.uuid)}>
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};

const rootElement = document.querySelector("#root");

if (!rootElement) {
  throw new Error("Could not find rootElement");
}

const root = createRoot(rootElement);
root.render(<App />);
