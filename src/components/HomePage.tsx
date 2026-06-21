import React, { MouseEventHandler } from "react";
import type { Todo } from "../helpers/appState";
import { Button } from "./Button";
import { TodoList } from "./TodoList";
import classNames from "classnames/bind";
import { useAppState } from "../helpers/AppStateContext";
import { useDisclosure, useHotkeys } from "@mantine/hooks";
import { ipcClient } from "../helpers/ipcClient";
import styles from "./HomePage.module.css";
import { IconBackspace, IconSettings } from "@tabler/icons-react";
import { NewTodoModal } from "./NewTodoModal";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";
import { useCrudModalState } from "../helpers/useCrudModalState";

const cx = classNames.bind(styles);

export const HomePage = ({
  onClickSettings,
}: {
  onClickSettings: MouseEventHandler;
}) => {
  useHotkeys([["mod+N", () => newTodoModalActions.open()]]);

  const addTodo = (todo: Todo) => {
    ipcClient.setState((current) => ({
      todos: [todo, ...current.todos],
    }));
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
    deleteModalState.openEdit({ key: uuid, selectedEntity: uuid });
  };

  const confirmDeleteTodo = () => {
    if (deleteModalState.mode === "edit") {
      const uuid = deleteModalState.selectedEntity;
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

  const [isNewTodoModalOpen, newTodoModalActions] = useDisclosure();

  const deleteModalState = useCrudModalState<string>();

  return (
    <div className={cx("container")}>
      <Button onClick={() => newTodoModalActions.open()}>New Todo</Button>
      <NewTodoModal
        isOpen={isNewTodoModalOpen}
        onRequestClose={() => newTodoModalActions.close()}
        onSubmit={(todo) => addTodo(todo)}
        key={1} // TODO: reset after submission
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
        key={deleteModalState.key}
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
