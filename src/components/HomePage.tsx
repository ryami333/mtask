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

  const onClickTodo = (uuid: string) => {
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

  const onDeleteKeyDown = (uuid: string) => {
    ipcClient.setState((current) => ({
      todos: current.todos.filter((todo) => todo.uuid !== uuid),
    }));
  };

  const onContextMenu = (uuid: string) => {
    ipcClient.showContextMenuForTodo(uuid);
  };

  const appState = useAppState();

  const [isNewTodoModalOpen, newTodoModalActions] = useDisclosure();

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
          onClickTodo={onClickTodo}
          onDeleteKeyDown={onDeleteKeyDown}
          onContextMenu={onContextMenu}
          todos={appState.todos}
          colors={appState.colors}
        />
      </div>
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
