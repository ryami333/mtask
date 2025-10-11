import React from "react";
import { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "./Input";

export default {
  title: "Blocks/Input",
  parameters: {
    layout: "padded",
  },
  args: {
    defaultValue: "Hello World",
  },
} satisfies Meta<typeof Input>;

export const Text: StoryObj<typeof Input> = {
  args: {
    type: "text",
    defaultValue: "Hello World",
  },
  render: (args) => <Input {...args} />,
};
