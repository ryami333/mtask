import React, { useState } from "react";
import type { Todo } from "./helpers/appState";
import { v4 as createUuid } from "uuid";
import { Button } from "./Button";
import { Input } from "./Input";
import { TodoList } from "./TodoList";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  row-gap: 16px;
`;

const Rule = styled.hr`
  all: unset;
  height: 2px;
  background-color: white;
  width: 100%;
`;

export const App = () => {
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

  return (
    <Container>
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
      <Rule />
      <TodoList />
      <Rule />

      <Button onClick={() => removeCompletedTodos()}>Clear Completed</Button>
    </Container>
  );
};
