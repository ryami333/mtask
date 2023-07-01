import { useAppState } from "./AppStateContext";
import styled from "styled-components";
import React, { useRef, useState } from "react";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 2px;
  border: 2px solid transparent;

  &:has(:focus) {
    border: 2px solid white;
  }
`;

const TodoWrapper = styled.div`
  display: flex;
`;

const TodoButton = styled.button<{ $active?: boolean }>`
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

  const [activeIndex, setActiveIndex] = useState<number>(0);

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
        const newIndex = Math.max(
          0,
          (currentIndex - 1 + allButtons.length) % allButtons.length
        );
        setActiveIndex(newIndex);
        allButtons.at(newIndex)?.focus();
        break;
      }
      case "ArrowDown":
      case "ArrowRight": {
        event.preventDefault(); // Block scrolling
        const newIndex = (currentIndex + 1) % allButtons.length;
        setActiveIndex(newIndex);
        allButtons.at(newIndex)?.focus();
        break;
      }
      case "Home": {
        event.preventDefault(); // Block scrolling
        const newIndex = 0;
        setActiveIndex(newIndex);
        allButtons.at(newIndex)?.focus();
        break;
      }
      case "End": {
        event.preventDefault(); // Block scrolling
        const newIndex = Math.max(0, allButtons.length - 1);
        setActiveIndex(newIndex);
        allButtons.at(newIndex)?.focus();
        break;
      }
    }
  };

  return (
    <Container ref={wrapperRef}>
      {appState.todos.map((todo, index) => (
        <TodoWrapper key={todo.uuid}>
          <TodoButton
            onKeyDown={onKeyDown}
            tabIndex={activeIndex === index ? 0 : -1} // using "roving" tabIndex
            onClick={() => {
              setActiveIndex(index);
              toggleTodoCompleted(todo.uuid);
            }}
            data-todolist-button
            $active={activeIndex === index}
          >
            <TodoTitle $completed={todo.completed}>{todo.title}</TodoTitle>
          </TodoButton>
        </TodoWrapper>
      ))}
    </Container>
  );
};
