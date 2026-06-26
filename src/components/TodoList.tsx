import React, { useRef } from "react";
import classNames from "classnames/bind";
import { TodoItem } from "./TodoItem";
import { ColorMapping, Todo } from "../helpers/appState";
import { ipcClient } from "../helpers/ipcClient";
import styles from "./TodoList.module.css";
import { FocusGroup } from "./FocusGroup";

const cx = classNames.bind(styles);

export const TodoList = ({
  onToggleTodo,
  onDeleteTodo,
  onEditTodo,
  colors,
  todos,
}: {
  onToggleTodo: (uuid: string) => void;
  onDeleteTodo: (uuid: string) => void;
  onEditTodo: (uuid: string) => void;
  colors: ColorMapping[];
  todos: Todo[];
}) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const openFirstLink = (todo: Todo) => {
    const firstLink = (todo.title.match(/\S+/g) ?? []).find((token) => {
      const url = URL.parse(token);
      return url?.protocol === "https:" || url?.protocol === "http:";
    });
    if (firstLink) {
      ipcClient.openLink(firstLink);
    }
  };

  return (
    <FocusGroup className={cx("container")} ref={wrapperRef} direction="block">
      {todos.map((todo) => (
        <TodoItem
          todo={todo}
          key={todo.uuid}
          onToggle={() => onToggleTodo(todo.uuid)}
          onDelete={() => onDeleteTodo(todo.uuid)}
          onOpenLink={() => openFirstLink(todo)}
          onEdit={() => onEditTodo(todo.uuid)}
          colors={colors}
        />
      ))}
    </FocusGroup>
  );
};
