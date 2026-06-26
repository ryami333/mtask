import React from "react";
import { ColorMapping } from "../helpers/appState";
import { Todo } from "../helpers/appState";
import classNames from "classnames/bind";
import { ipcClient } from "../helpers/ipcClient";
import styles from "./TodoItem.module.css";
import { getHotkeyHandler } from "@mantine/hooks";

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
              onDoubleClick={(event) => {
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

export function TodoItem({
  todo,
  colors,
  onToggle,
  onEdit,
  onOpenLink,
  onDelete,
}: {
  todo: Todo;
  colors: ColorMapping[];
  onToggle: React.MouseEventHandler;
  onEdit: React.MouseEventHandler;
  onOpenLink: React.MouseEventHandler;
  onDelete: React.MouseEventHandler;
}) {
  const onKeyDown = getHotkeyHandler([
    ["mod+Enter", onToggle],
    ["mod+Space", onToggle],
    ["mod+E", onEdit],
    ["mod+O", onOpenLink],
    ["mod+Delete", onDelete],
    ["mod+Backspace", onDelete],
  ]);

  return (
    <div className={cx("wrapper")}>
      <button
        className={cx("button")}
        onKeyDown={onKeyDown}
        onClick={(event) => {
          if (event.metaKey) {
            onToggle(event);
          }
        }}
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
}
