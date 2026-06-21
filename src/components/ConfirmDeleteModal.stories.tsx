import React from "react";
import { Meta, StoryFn } from "@storybook/react-vite";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";
import { fn } from "storybook/test";

export default {
  title: "ConfirmDeleteModal",
  parameters: {
    layout: "padded",
  },
  args: {
    isOpen: true,
    onRequestClose: fn(),
    onConfirm: fn(),
  },
} satisfies Meta<typeof ConfirmDeleteModal>;

export const Static: StoryFn<typeof ConfirmDeleteModal> = (args) => (
  <ConfirmDeleteModal {...args} />
);
