import React, { MouseEventHandler, useRef, useState } from "react";
import type { Todo } from "../helpers/appState";
import { v4 as createUuid } from "uuid";
import { Button } from "./Button";
import { Input } from "./Input";
import { TodoList } from "./TodoList";
import classNames from "classnames/bind";
import { useAppState } from "../helpers/AppStateContext";
import { useHotkeys } from "@mantine/hooks";
import { ipcClient } from "../helpers/ipcClient";
import styles from "./HomePage.module.css";
import { IconBackspace, IconSettings } from "@tabler/icons-react";

const cx = classNames.bind(styles);

export const HomePage = ({
  onClickSettings,
}: {
  onClickSettings: MouseEventHandler;
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  useHotkeys([["mod+N", () => inputRef.current?.focus()]]);

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

  return (
    <div className={cx("container")}>
      <form
        className={cx("form")}
        onSubmit={(e) => {
          e.preventDefault();

          if (inputValue) {
            addTodo({
              uuid: createUuid(),
              title: inputValue,
              completed: false,
            });
          }
          setInputValue("");
        }}
      >
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </form>
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
