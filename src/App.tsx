import React, { useState } from "react";
import type { Todo } from "./helpers/appState";
import { v4 as createUuid } from "uuid";
import { useAppState } from "./AppStateContext";
import styled from "styled-components";
import { Button } from "./Button";
import { Input } from "./Input";

const TodoWrapper = styled.div`
  display: flex;
`;

const TodoButton = styled.button`
  all: unset;
  appearance: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 2px;
  font-size: 16px;

  &:hover,
  &:focus {
    font-weight: 500;
  }
`;

const TodoTitle = styled.span<{ $completed?: boolean }>`
  text-decoration: ${(props) => (props.$completed ? "line-through" : "normal")};
  color: ${(props) => (props.$completed ? "gray" : "white")};
`;

export const App = () => {
  const appState = useAppState();

  const [inputValue, setInputValue] = useState<string>("");

  const addTodo = (todo: Todo) => {
    window.appState.setState((current) => ({
      todos: [...current.todos, todo],
    }));
  };

  const removeCompletedTodos = () => {
    window.appState.setState((current) => ({
      todos: current.todos.filter((todo) => !todo.completed),
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
        <Input
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
        </TodoWrapper>
      ))}
      <Button onClick={() => removeCompletedTodos()}>Clear Completed</Button>
    </div>
  );
};
