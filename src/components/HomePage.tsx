import React, { MouseEventHandler, useState } from "react";
import { v4 as createUuid } from "uuid";
import { Button } from "./Button";
import { Input } from "./Input";
import { TodoList } from "./TodoList";
import styled from "styled-components";
import { useAppStore } from "../helpers/useAppStore";

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

  const todos = useAppStore((state) => state.todos);
  const colors = useAppStore((state) => state.colors);
  const addTodo = useAppStore((state) => state.addTodo);
  const toggleTodo = useAppStore((state) => state.toggleTodo);
  const deleteTodo = useAppStore((state) => state.deleteTodo);
  const clearCompleted = useAppStore((state) => state.clearCompleted);

  const onContextMenu = (uuid: string) => {
    window.appState.showContextMenuForTodo(uuid);
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
        <TodoList
          onClickTodo={toggleTodo}
          onDeleteKeyDown={deleteTodo}
          onContextMenu={onContextMenu}
          todos={todos}
          colors={colors}
        />
      </TodoListWrapper>
      <ButtonWrapper>
        <Button onClick={() => clearCompleted()}>
          Clear Completed 🚫
        </Button>
        <Button onClick={onClickSettings}>Settings ⚙️</Button>
      </ButtonWrapper>
    </Container>
  );
};
