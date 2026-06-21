import React, { useRef, useState } from "react";
import classNames from "classnames/bind";
import { TodoItem } from "./TodoItem";
import { ColorMapping, Todo } from "../helpers/appState";
import styles from "./TodoList.module.css";

const cx = classNames.bind(styles);

export const TodoList = ({
  onClickTodo,
  onDeleteKeyDown,
  onContextMenu,
  colors,
  todos,
}: {
  onClickTodo: (uuid: string) => void;
  onDeleteKeyDown: (uuid: string) => void;
  onContextMenu: (uuid: string) => void;
  colors: ColorMapping[];
  todos: Todo[];
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const onKeyDown = (event: React.KeyboardEvent) => {
    const allButtons = Array.from(
      wrapperRef.current?.querySelectorAll("[data-todolist-button]") ?? [],
    ).filter((button): button is HTMLElement => button instanceof HTMLElement);

    const currentIndex = allButtons.findIndex(
      (button) => button === event.currentTarget,
    );

    switch (event.key) {
      case "ArrowUp":
      case "ArrowLeft": {
        event.preventDefault(); // Block scrolling
        const newIndex = Math.max(
          0,
          (currentIndex - 1 + allButtons.length) % allButtons.length,
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
          onDeleteKeyDown(uuid);
        }
        break;
      }
    }
  };

  return (
    <div className={cx("container")} ref={wrapperRef}>
      {todos.map((todo, index) => (
        <TodoItem
          todo={todo}
          key={todo.uuid}
          onKeyDown={onKeyDown}
          tabIndex={activeIndex === index ? 0 : -1} // using "roving" tabIndex
          onClick={() => {
            setActiveIndex(index);
            onClickTodo(todo.uuid);
          }}
          active={activeIndex === index}
          onContextMenu={() => onContextMenu(todo.uuid)}
          colors={colors}
        />
      ))}
    </div>
  );
};
