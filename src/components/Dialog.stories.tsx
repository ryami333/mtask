import React from "react";
import { Meta, StoryFn } from "@storybook/react-vite";
import { Dialog } from "./Dialog";
import { fn } from "storybook/test";

export default {
  title: "Blocks/Dialog",
  parameters: {
    layout: "padded",
  },
  args: {
    isOpen: true,
    onRequestClose: fn(),
    children: "Dialog content goes here",
  },
} satisfies Meta<typeof Dialog>;

export const Static: StoryFn<typeof Dialog> = (args) => <Dialog {...args} />;
