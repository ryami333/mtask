import { useAppState } from "../helpers/AppStateContext";
import styled from "styled-components";
import React, { useRef, useState } from "react";
import { TodoItem } from "./TodoItem";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 2px;
  border: 2px solid transparent;

  &:has(:focus-visible) {
    border: 2px solid white;
  }
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

  const removeTodo = (uuid: string) => {
    window.appState.setState((current) => ({
      todos: current.todos.filter((todo) => todo.uuid !== uuid),
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
      case "Delete":
      case "Backspace": {
        event.preventDefault(); // Block scrolling

        const nextButton = allButtons[activeIndex + 1];
        if (nextButton) {
          nextButton?.focus();
        } else {
          allButtons[activeIndex - 1]?.focus();
        }

        const uuid = event.currentTarget.getAttribute("data-todolist-button");
        if (uuid) {
          removeTodo(uuid);
        }
        break;
      }
    }
  };

  return (
    <Container ref={wrapperRef}>
      {appState.todos.map((todo, index) => (
        <TodoItem
          todo={todo}
          key={todo.uuid}
          onKeyDown={onKeyDown}
          tabIndex={activeIndex === index ? 0 : -1} // using "roving" tabIndex
          onClick={() => {
            setActiveIndex(index);
            toggleTodoCompleted(todo.uuid);
          }}
          active={activeIndex === index}
          onContextMenu={() => {
            window.appState.showContextMenuForTodo(todo.uuid);
          }}
          colors={appState.colors}
        />
      ))}
    </Container>
  );
};
