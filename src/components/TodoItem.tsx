import React, { KeyboardEventHandler } from "react";
import { ColorMapping } from "../helpers/appState";
import { Todo } from "../helpers/appState";
import classNames from "classnames/bind";
import { ipcClient } from "../helpers/ipcClient";
import styles from "./TodoItem.module.css";

const cx = classNames.bind(styles);

function TitleFormatter({ children }: { children: string }) {
  const tokens = children.match(/\S+\s?/g) ?? [];

  return (
    <>
      {tokens?.map((token, index) => {
        const jiraLinkMatch = token.match(
          /https:\/\/diesdas.atlassian.net\/browse\/([A-Z0-9\\-]+)/,
        );
        if (jiraLinkMatch) {
          return (
            <span
              key={index}
              className={cx("externalLink")}
              onClick={(event) => {
                event.stopPropagation();
                ipcClient.openLink(token);
              }}
            >
              {jiraLinkMatch[1]} 🔗
            </span>
          );
        }

        const pullRequestMatch = token.match(
          /https:\/\/github.com\/\S+?\/(\S+)?\/pull\/(\S+)?/,
        );
        if (pullRequestMatch) {
          return (
            <span
              key={index}
              className={cx("externalLink")}
              onClick={(event) => {
                event.stopPropagation();
                ipcClient.openLink(token);
              }}
            >
              {pullRequestMatch[1]}/{pullRequestMatch[2]} 🔗
            </span>
          );
        }

        return token;
      })}
    </>
  );
}

export const TodoItem = ({
  todo,
  onKeyDown,
  colors,
}: {
  todo: Todo;
  onKeyDown: KeyboardEventHandler<HTMLElement>;
  colors: ColorMapping[];
}) => {
  return (
    <div className={cx("wrapper")}>
      <button
        className={cx("button")}
        onKeyDown={onKeyDown}
        data-todolist-button={todo.uuid}
      >
        <span
          className={cx("title", { completed: todo.completed })}
          style={{
            color: colors.find((colorMapping) =>
              todo.title.startsWith(colorMapping.prefix),
            )?.color,
          }}
        >
          <TitleFormatter>{todo.title}</TitleFormatter>
        </span>
      </button>
    </div>
  );
};
