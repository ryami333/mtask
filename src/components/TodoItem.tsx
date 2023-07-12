import React, { KeyboardEventHandler, MouseEventHandler } from "react";
import { ColorMapping } from "../helpers/appState";
import { Todo } from "../helpers/appState";
import styled from "styled-components";

const TodoButton = styled.button<{ $active?: boolean }>`
  background: none;
  border: none;
  appearance: none;
  text-align: left;
  cursor: pointer;
  padding: 8px;
  border-radius: 2px;
  font-size: 16px;
  width: 100%;

  &:hover,
  &:focus-visible {
    background-color: rgba(0, 0, 0, 0.5);
    font-weight: 500;
  }
`;

const TodoTitle = styled.span<{ $completed?: boolean }>`
  text-decoration: ${(props) => (props.$completed ? "line-through" : "normal")};
  color: ${(props) => (props.$completed ? "gray" : "white")};
`;

const ExternalLink = styled.span`
  font-weight: 600;
  font-style: italic;

  &:hover {
    text-decoration: underline;
  }
`;

const TodoWrapper = styled.div`
  display: flex;
`;

function TitleFormatter({ children }: { children: string }) {
  const tokens = children.match(/\S+\s?/g) ?? [];

  return (
    <>
      {tokens?.map((token, index) => {
        const jiraLinkMatch = token.match(
          /https:\/\/diesdas.atlassian.net\/browse\/([A-Z0-9\\-]+)/
        );
        if (jiraLinkMatch) {
          return (
            <ExternalLink
              key={index}
              onClick={(event) => {
                event.stopPropagation();
                window.appState.openLink(token);
              }}
            >
              {jiraLinkMatch[1]} 🔗
            </ExternalLink>
          );
        }

        const pullRequestMatch = token.match(
          /https:\/\/github.com\/\S+?\/(\S+)?\/pull\/(\S+)?/
        );
        if (pullRequestMatch) {
          return (
            <ExternalLink
              key={index}
              onClick={(event) => {
                event.stopPropagation();
                window.appState.openLink(token);
              }}
            >
              {pullRequestMatch[1]}/{pullRequestMatch[2]} 🔗
            </ExternalLink>
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
  onClick,
  onContextMenu,
  active,
  tabIndex,
  colors,
}: {
  todo: Todo;
  onKeyDown: KeyboardEventHandler;
  onClick: MouseEventHandler;
  onContextMenu: MouseEventHandler;
  tabIndex: number;
  active: boolean;
  colors: ColorMapping[];
}) => {
  return (
    <TodoWrapper>
      <TodoButton
        onKeyDown={onKeyDown}
        tabIndex={tabIndex}
        onClick={onClick}
        data-todolist-button={todo.uuid}
        $active={active}
        onContextMenu={onContextMenu}
      >
        <TodoTitle
          style={{
            color: colors.find((colorMapping) =>
              todo.title.startsWith(colorMapping.prefix)
            )?.color,
          }}
          $completed={todo.completed}
        >
          <TitleFormatter>{todo.title}</TitleFormatter>
        </TodoTitle>
      </TodoButton>
    </TodoWrapper>
  );
};
