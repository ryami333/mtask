import React from "react";
import type { Todo } from "../helpers/appState";
import { Button } from "./Button";
import { TodoList } from "./TodoList";
import classNames from "classnames/bind";
import { useAppState } from "../helpers/AppStateContext";
import { useHotkeys, useFocusReturn } from "@mantine/hooks";
import { ipcClient } from "../helpers/ipcClient";
import styles from "./HomePage.module.css";
import { IconSettings } from "@tabler/icons-react";
import { TodoModal } from "./TodoModal";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";
import { useCrudModalState } from "../helpers/useCrudModalState";
import { useDeleteModalState } from "../helpers/useDeleteModalState";

const cx = classNames.bind(styles);

export const HomePage = () => {
  useHotkeys([["mod+N", () => todoModalState.openNew()]]);

  const submitTodo = (title: string) => {
    if (todoModalState.mode === "edit") {
      const { uuid } = todoModalState.selectedEntity;
      ipcClient.setState((current) => ({
        todos: current.todos.map((todo) =>
          todo.uuid === uuid ? { ...todo, title } : todo,
        ),
      }));
    } else {
      ipcClient.setState((current) => ({
        todos: [
          { uuid: crypto.randomUUID(), title, completed: false },
          ...current.todos,
        ],
      }));
    }
    todoModalState.closeAndReset();
  };

  const requestEditTodo = (uuid: string) => {
    const todo = appState.todos.find((todo) => todo.uuid === uuid);
    if (todo) {
      todoModalState.openEdit({ selectedEntity: todo, key: todo.uuid });
    }
  };

  const onToggleTodo = (uuid: string) => {
    ipcClient.setState((current) => ({
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

  const requestDeleteTodo = (uuid: string) => {
    deleteModalState.open({ selectedEntity: uuid });
  };

  const confirmDeleteTodo = () => {
    const uuid = deleteModalState.selectedEntity;
    if (uuid !== null) {
      ipcClient.setState((current) => ({
        todos: current.todos.filter((todo) => todo.uuid !== uuid),
      }));
    }
    deleteModalState.close();
  };

  const onContextMenu = (uuid: string) => {
    ipcClient.showContextMenuForTodo(uuid);
  };

  const appState = useAppState();

  const todoModalState = useCrudModalState<Todo>();

  const deleteModalState = useDeleteModalState<string>();

  // Return focus to the element that opened a modal once it closes.
  useFocusReturn({
    opened: todoModalState.isOpen || deleteModalState.isOpen,
  });

  return (
    <div className={cx("container")}>
      <TodoModal
        isOpen={todoModalState.isOpen}
        onRequestClose={() => todoModalState.close()}
        onSubmit={(title) => submitTodo(title)}
        defaultValue={
          todoModalState.mode === "edit"
            ? todoModalState.selectedEntity.title
            : ""
        }
        key={todoModalState.key}
      />
      <div className={cx("todoListWrapper")}>
        <TodoList
          onToggleTodo={onToggleTodo}
          onDeleteKeyDown={requestDeleteTodo}
          onEditKeyDown={requestEditTodo}
          onContextMenu={onContextMenu}
          todos={appState.todos}
          colors={appState.colors}
        />
      </div>
      <ConfirmDeleteModal
        isOpen={deleteModalState.isOpen}
        onRequestClose={() => deleteModalState.close()}
        onConfirm={() => confirmDeleteTodo()}
      />
      <div className={cx("buttonWrapper")}>
        <Button
          onClick={() => ipcClient.openSettings()}
          icon={IconSettings}
          iconPlacement="after"
        >
          Settings
        </Button>
      </div>
    </div>
  );
};
