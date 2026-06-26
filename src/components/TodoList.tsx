import React, { useRef } from "react";
import classNames from "classnames/bind";
import { getHotkeyHandler } from "@mantine/hooks";
import { TodoItem } from "./TodoItem";
import { ColorMapping, Todo } from "../helpers/appState";
import { ipcClient } from "../helpers/ipcClient";
import styles from "./TodoList.module.css";
import { FocusGroup } from "./FocusGroup";

const cx = classNames.bind(styles);

export const TodoList = ({
  onToggleTodo,
  onDeleteKeyDown,
  onEditKeyDown,
  colors,
  todos,
}: {
  onToggleTodo: (uuid: string) => void;
  onDeleteKeyDown: (uuid: string) => void;
  onEditKeyDown: (uuid: string) => void;
  colors: ColorMapping[];
  todos: Todo[];
}) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const getButtons = () =>
    Array.from(
      wrapperRef.current?.querySelectorAll("[data-todolist-button]") ?? [],
    ).filter((button): button is HTMLElement => button instanceof HTMLElement);

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

  const openFirstLink = (event: KeyboardEvent) => {
    const uuid = (event.target as HTMLElement)
      .closest("[data-todolist-button]")
      ?.getAttribute("data-todolist-button");
    const todo = todos.find((todo) => todo.uuid === uuid);
    if (!todo) {
      return;
    }

    const firstLink = (todo.title.match(/\S+/g) ?? []).find((token) => {
      const url = URL.parse(token);
      return url?.protocol === "https:" || url?.protocol === "http:";
    });
    if (firstLink) {
      ipcClient.openLink(firstLink);
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
    ["mod+Enter", toggleActive],
    ["mod+Space", toggleActive],
    ["mod+E", editActive],
    ["mod+O", openFirstLink],
    ["mod+Delete", deleteActive],
    ["mod+Backspace", deleteActive],
  ]);

  return (
    <FocusGroup className={cx("container")} ref={wrapperRef} direction="block">
      {todos.map((todo) => (
        <TodoItem
          todo={todo}
          key={todo.uuid}
          onKeyDown={onKeyDown}
          colors={colors}
        />
      ))}
    </FocusGroup>
  );
};
