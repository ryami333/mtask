import { createRoot } from "react-dom/client";
import { useAppState } from "./helpers/appState/appStateRenderer";
import React, { useState } from "react";
import {
  createAddTodoAction,
  createRemoveTodoAction,
} from "./helpers/appState/appStateCommon";
import { v4 as createUuid } from "uuid";

const App = () => {
  const [appState, dispatch] = useAppState();

  const [inputValue, setInputValue] = useState<string>("");
  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          dispatch(
            createAddTodoAction({ uuid: createUuid(), title: inputValue })
          );
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
          <button
            onClick={() => {
              dispatch(createRemoveTodoAction(todo.uuid));
            }}
          >
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
