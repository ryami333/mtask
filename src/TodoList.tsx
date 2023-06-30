import { useAppState } from "./AppStateContext";
import styled from "styled-components";
import React from "react";

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const TodoWrapper = styled.div`
  display: flex;
`;

const TodoButton = styled.button`
  background: none;
  border: none;
  appearance: none;
  text-align: left;
  cursor: pointer;
  padding: 8px;
  border-radius: 2px;
  font-size: 16px;
  width: 100%;

  &:hover,
  &:focus {
    background-color: rgba(0, 0, 0, 0.5);
    font-weight: 500;
  }
`;

const TodoTitle = styled.span<{ $completed?: boolean }>`
  text-decoration: ${(props) => (props.$completed ? "line-through" : "normal")};
  color: ${(props) => (props.$completed ? "gray" : "white")};
`;

export const TodoList = () => {
  const appState = useAppState();

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
    <Container>
      {appState.todos.map((todo) => (
        <TodoWrapper key={todo.uuid}>
          <TodoButton onClick={() => toggleTodoCompleted(todo.uuid)}>
            <TodoTitle $completed={todo.completed}>{todo.title}</TodoTitle>
          </TodoButton>
        </TodoWrapper>
      ))}
    </Container>
  );
};
