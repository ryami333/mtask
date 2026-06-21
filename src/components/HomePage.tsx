import React, { MouseEventHandler } from "react";
import type { Todo } from "../helpers/appState";
import { Button } from "./Button";
import { TodoList } from "./TodoList";
import classNames from "classnames/bind";
import { useAppState } from "../helpers/AppStateContext";
import { useHotkeys } from "@mantine/hooks";
import { ipcClient } from "../helpers/ipcClient";
import styles from "./HomePage.module.css";
import { IconBackspace, IconSettings } from "@tabler/icons-react";
import { NewTodoModal } from "./NewTodoModal";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";
import { useCrudModalState } from "../helpers/useCrudModalState";
import { useDeleteModalState } from "../helpers/useDeleteModalState";

const cx = classNames.bind(styles);

export const HomePage = ({
  onClickSettings,
}: {
  onClickSettings: MouseEventHandler;
}) => {
  useHotkeys([["mod+N", () => newTodoModalState.openNew()]]);

  const addTodo = (todo: Todo) => {
    ipcClient.setState((current) => ({
      todos: [todo, ...current.todos],
    }));
    newTodoModalState.closeAndReset();
  };

  const removeCompletedTodos = () => {
    ipcClient.setState((current) => ({
      todos: current.todos.filter((todo) => !todo.completed),
    }));
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

  const newTodoModalState = useCrudModalState<string>();

  const deleteModalState = useDeleteModalState<string>();

  return (
    <div className={cx("container")}>
      <Button onClick={() => newTodoModalState.openNew()}>New Todo</Button>
      <NewTodoModal
        isOpen={newTodoModalState.isOpen}
        onRequestClose={() => newTodoModalState.close()}
        onSubmit={(todo) => addTodo(todo)}
        key={newTodoModalState.key}
      />
      <div className={cx("todoListWrapper")}>
        <TodoList
          onToggleTodo={onToggleTodo}
          onDeleteKeyDown={requestDeleteTodo}
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
          onClick={() => removeCompletedTodos()}
          icon={IconBackspace}
          iconPlacement="after"
        >
          Clear Completed
        </Button>
        <Button
          onClick={onClickSettings}
          icon={IconSettings}
          iconPlacement="after"
        >
          Settings
        </Button>
      </div>
    </div>
  );
};
