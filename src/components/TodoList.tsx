import React, { useRef } from "react";
import classNames from "classnames/bind";
import { getHotkeyHandler } from "@mantine/hooks";
import { TodoItem } from "./TodoItem";
import { ColorMapping, Todo } from "../helpers/appState";
import styles from "./TodoList.module.css";

const cx = classNames.bind(styles);

export const TodoList = ({
  onToggleTodo,
  onDeleteKeyDown,
  onEditKeyDown,
  onContextMenu,
  colors,
  todos,
}: {
  onToggleTodo: (uuid: string) => void;
  onDeleteKeyDown: (uuid: string) => void;
  onEditKeyDown: (uuid: string) => void;
  onContextMenu: (uuid: string) => void;
  colors: ColorMapping[];
  todos: Todo[];
}) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const getButtons = () =>
    Array.from(
      wrapperRef.current?.querySelectorAll("[data-todolist-button]") ?? [],
    ).filter((button): button is HTMLElement => button instanceof HTMLElement);

  const focusIndex = (index: number) => {
    const buttons = getButtons();
    const newIndex = Math.max(0, Math.min(index, buttons.length - 1));
    buttons.at(newIndex)?.focus();
  };

  const moveFocus = (event: KeyboardEvent, delta: number) => {
    const buttons = getButtons();
    const currentIndex = buttons.findIndex((button) => button === event.target);
    focusIndex((currentIndex + delta + buttons.length) % buttons.length);
  };

  const toggleActive = (event: KeyboardEvent) => {
    const uuid = (event.target as HTMLElement)
      .closest("[data-todolist-button]")
      ?.getAttribute("data-todolist-button");
    if (uuid) {
      onToggleTodo(uuid);
    }
  };

  const editActive = (event: KeyboardEvent) => {
    const uuid = (event.target as HTMLElement)
      .closest("[data-todolist-button]")
      ?.getAttribute("data-todolist-button");
    if (uuid) {
      onEditKeyDown(uuid);
    }
  };

  const deleteActive = (event: KeyboardEvent) => {
    const buttons = getButtons();
    const currentIndex = buttons.findIndex((button) => button === event.target);

    const nextButton = buttons[currentIndex + 1] ?? buttons[currentIndex - 1];
    nextButton?.focus();

    const uuid = (event.target as HTMLElement)
      .closest("[data-todolist-button]")
      ?.getAttribute("data-todolist-button");
    if (uuid) {
      onDeleteKeyDown(uuid);
    }
  };

  // `getHotkeyHandler` calls `event.preventDefault()` by default, which blocks
  // scrolling on the arrow/Home/End/Delete keys.
  const onKeyDown = getHotkeyHandler([
    ["ArrowUp", (event) => moveFocus(event, -1)],
    ["ArrowLeft", (event) => moveFocus(event, -1)],
    ["ArrowDown", (event) => moveFocus(event, 1)],
    ["ArrowRight", (event) => moveFocus(event, 1)],
    ["Home", () => focusIndex(0)],
    ["End", () => focusIndex(getButtons().length - 1)],
    ["mod+Enter", toggleActive],
    ["mod+Space", toggleActive],
    ["mod+E", editActive],
    ["mod+Delete", deleteActive],
    ["mod+Backspace", deleteActive],
  ]);

  return (
    <div className={cx("container")} ref={wrapperRef}>
      {todos.map((todo) => (
        <TodoItem
          todo={todo}
          key={todo.uuid}
          onKeyDown={onKeyDown}
          onContextMenu={() => onContextMenu(todo.uuid)}
          colors={colors}
        />
      ))}
    </div>
  );
};
