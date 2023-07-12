import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { TodoItem } from "./TodoItem";
import { Todo } from "../helpers/appState";

type TodoItemProps = React.ComponentProps<typeof TodoItem>;

export default {
  title: "Blocks/TodoItem",
  parameters: {
    layout: "padded",
  },
  args: {
    active: false,
    todo: {
      uuid: "7fca56bb-3136-41e1-9a38-155022dd8826",
      title: "FOO: feed the raccoons",
      completed: false,
    } satisfies Todo,
    colors: [
      {
        uuid: "5200f8eb-0d8d-485c-97d0-e043c7f44229",
        prefix: "FOO",
        color: "#FF0000",
      },
    ],
  },
} satisfies Meta<TodoItemProps>;

export const Text: StoryObj<TodoItemProps> = {
  render: (args) => <TodoItem {...args} />,
};
