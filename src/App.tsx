import React, { useState } from "react";
import type { Todo } from "./helpers/appState";
import { v4 as createUuid } from "uuid";
import { useAppState } from "./AppStateContext";
import styled from "styled-components";

const TodoWrapper = styled.div`
  display: flex;
`;

const TodoButton = styled.button`
  all: unset;
  appearance: none;

  &:hover {
    background-color: rgb(#ff0000, 0.5);
  }
`;

const TodoTitle = styled.span<{ $completed?: boolean }>`
  text-decoration: ${(props) => (props.$completed ? "line-through" : "normal")};
`;

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

  const toggleTodoCompleted = (uuid: string) => {
    window.appState.setState((current) => ({
      todos: current.todos.map((todo) => {
        if (todo.uuid === uuid) {
          return {
            ...todo,
            completed: !todo.completed,
          };
        }
        return todo;
      }),
    }));
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();

          if (inputValue) {
            addTodo({
              uuid: createUuid(),
              title: inputValue,
              completed: false,
            });
          }
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
        <TodoWrapper key={todo.uuid}>
          <TodoButton onClick={() => toggleTodoCompleted(todo.uuid)}>
            <TodoTitle $completed={todo.completed}>{todo.title}</TodoTitle>
          </TodoButton>
          <button onClick={() => removeTodo(todo.uuid)}>Remove</button>
        </TodoWrapper>
      ))}
    </div>
  );
};
