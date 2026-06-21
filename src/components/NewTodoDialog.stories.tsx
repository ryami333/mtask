import React from "react";
import { Meta, StoryFn } from "@storybook/react-vite";
import { NewTodoDialog } from "./NewTodoDialog";
import { fn } from "storybook/test";

export default {
  title: "Blocks/NewTodoDialog",
  parameters: {
    layout: "padded",
  },
  args: {
    isOpen: true,
    onRequestClose: fn(),
    onSubmit: fn(),
  },
} satisfies Meta<typeof NewTodoDialog>;

export const Static: StoryFn<typeof NewTodoDialog> = (args) => (
  <NewTodoDialog {...args} />
);
