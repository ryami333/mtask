import React from "react";
import { Meta, StoryFn } from "@storybook/react-vite";
import { TodoModal } from "./TodoModal";
import { fn } from "storybook/test";

export default {
  title: "TodoModal",
  parameters: {
    layout: "padded",
  },
  args: {
    isOpen: true,
    onRequestClose: fn(),
    onSubmit: fn(),
  },
} satisfies Meta<typeof TodoModal>;

export const Static: StoryFn<typeof TodoModal> = (args) => (
  <TodoModal {...args} />
);
