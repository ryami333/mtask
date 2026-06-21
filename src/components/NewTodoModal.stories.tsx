import React from "react";
import { Meta, StoryFn } from "@storybook/react-vite";
import { NewTodoModal } from "./NewTodoModal";
import { fn } from "storybook/test";

export default {
  title: "Blocks/NewTodoModal",
  parameters: {
    layout: "padded",
  },
  args: {
    isOpen: true,
    onRequestClose: fn(),
    onSubmit: fn(),
  },
} satisfies Meta<typeof NewTodoModal>;

export const Static: StoryFn<typeof NewTodoModal> = (args) => (
  <NewTodoModal {...args} />
);
