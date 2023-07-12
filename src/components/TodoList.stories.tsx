import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { TodoList } from "./TodoList";

type TodoListProps = React.ComponentProps<typeof TodoList>;

export default {
  title: "Blocks/TodoList",
  parameters: {
    layout: "padded",
  },
  args: {
    todos: [
      {
        uuid: "7fca56bb-3136-41e1-9a38-155022dd8826",
        title: "FOO: feed the raccoons",
        completed: false,
      },
      {
        uuid: "163a9288-447d-4ce8-b0e7-6319f22d4fb7",
        title: "BAR: Book hours https://diesdas.atlassian.net/browse/INT-36",
        completed: false,
      },
      {
        uuid: "163a9288-447d-4ce8-b0e7-6319f22d4fb7",
        title:
          "BAZ: Review this PR https://github.com/redbullmediahouse/rb-pcs/pull/1471",
        completed: false,
      },
    ],
    colors: [
      {
        uuid: "5200f8eb-0d8d-485c-97d0-e043c7f44229",
        prefix: "FOO",
        color: "#FF0000",
      },
    ],
  },
} satisfies Meta<TodoListProps>;

export const Text: StoryObj<TodoListProps> = {
  render: (args) => <TodoList {...args} />,
};
