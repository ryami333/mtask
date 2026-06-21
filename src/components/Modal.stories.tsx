import React from "react";
import { Meta, StoryFn } from "@storybook/react-vite";
import { Modal } from "./Modal";
import { fn } from "storybook/test";

export default {
  title: "Blocks/Modal",
  parameters: {
    layout: "padded",
  },
  args: {
    isOpen: true,
    onRequestClose: fn(),
    children: "Modal content goes here",
  },
} satisfies Meta<typeof Modal>;

export const Static: StoryFn<typeof Modal> = (args) => <Modal {...args} />;
