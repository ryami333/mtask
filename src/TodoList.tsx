import { useAppState } from "./AppStateContext";
import styled from "styled-components";
import React, { useRef } from "react";

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

  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const onKeyDown = (event: React.KeyboardEvent) => {
    const allButtons = Array.from(
      wrapperRef.current?.querySelectorAll("[data-todolist-button]") ?? []
    ).filter((button): button is HTMLElement => button instanceof HTMLElement);

    const currentIndex = allButtons.findIndex(
      (button) => button === event.currentTarget
    );

    switch (event.key) {
      case "ArrowUp":
      case "ArrowLeft": {
        event.preventDefault(); // Block scrolling
        allButtons.at(currentIndex - 1)?.focus();
        break;
      }
      case "ArrowDown":
      case "ArrowRight": {
        event.preventDefault(); // Block scrolling
        allButtons.at((currentIndex + 1) % allButtons.length)?.focus();
        break;
      }
      case "Home": {
        event.preventDefault(); // Block scrolling
        allButtons.at(0)?.focus();
        break;
      }
      case "End": {
        event.preventDefault(); // Block scrolling
        allButtons.at(-1)?.focus();
        break;
      }
    }
  };

  return (
    <Container ref={wrapperRef}>
      {appState.todos.map((todo) => (
        <TodoWrapper key={todo.uuid}>
          <TodoButton
            onClick={() => toggleTodoCompleted(todo.uuid)}
            data-todolist-button
            onKeyDown={onKeyDown}
          >
            <TodoTitle $completed={todo.completed}>{todo.title}</TodoTitle>
          </TodoButton>
        </TodoWrapper>
      ))}
    </Container>
  );
};
