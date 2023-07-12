import React, { MouseEventHandler, useState } from "react";
import type { Todo } from "../helpers/appState";
import { v4 as createUuid } from "uuid";
import { Button } from "./Button";
import { Input } from "./Input";
import { TodoList } from "./TodoList";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  height: -webkit-fill-available;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
`;

const TodoListWrapper = styled.div`
  flex: 1;
`;

const ButtonWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 16px;
`;

export const HomePage = ({
  onClickSettings,
}: {
  onClickSettings: MouseEventHandler;
}) => {
  const [inputValue, setInputValue] = useState<string>("");

  const addTodo = (todo: Todo) => {
    window.appState.setState((current) => ({
      todos: [todo, ...current.todos],
    }));
  };

  const removeCompletedTodos = () => {
    window.appState.setState((current) => ({
      todos: current.todos.filter((todo) => !todo.completed),
    }));
  };

  return (
    <Container>
      <Form
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
      </Form>
      <TodoListWrapper>
        <TodoList />
      </TodoListWrapper>
      <ButtonWrapper>
        <Button onClick={() => removeCompletedTodos()}>
          Clear Completed 🚫
        </Button>
        <Button onClick={onClickSettings}>Settings ⚙️</Button>
      </ButtonWrapper>
    </Container>
  );
};
