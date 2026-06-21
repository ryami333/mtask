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
        // Tokens may carry a trailing space; parse only the URL itself and
        // re-append the whitespace so word spacing is preserved.
        const trimmed = token.trimEnd();
        const trailing = token.slice(trimmed.length);
        const url = URL.parse(trimmed);

        if (url?.protocol !== "https:" && url?.protocol !== "http:") {
          return token;
        }

        // Open the full URL, but hide the protocol when displaying it.
        const label = trimmed.slice(`${url.protocol}//`.length);

        return (
          <span key={index}>
            <span
              className={cx("externalLink")}
              onClick={(event) => {
                event.stopPropagation();
                ipcClient.openLink(trimmed);
              }}
            >
              {label}
            </span>
            {trailing}
          </span>
        );
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
