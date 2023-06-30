import React, { useState } from "react";
import type { Todo } from "./helpers/appState";
import { v4 as createUuid } from "uuid";
import { useAppState } from "./AppStateContext";

export const App = () => {
  const appState = useAppState();

  const [inputValue, setInputValue] = useState<string>("");

  const addTodo = (todo: Todo) => {
    window.appState.setState((current) => ({
      todos: [...current.todos, todo],
    }));
  };

  const removeTodo = (uuid: string) => {
    window.appState.setState((current) => ({
      todos: current.todos.filter((todo) => todo.uuid !== uuid),
    }));
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addTodo({
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
          <button onClick={() => removeTodo(todo.uuid)}>Remove</button>
        </div>
      ))}
    </div>
  );
};
