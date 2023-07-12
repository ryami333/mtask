import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { Input } from "./Input";

type InputProps = React.ComponentProps<typeof Input>;

export default {
  title: "Blocks/Input",
  parameters: {
    layout: "padded",
  },
  args: {
    defaultValue: "Hello World",
  },
} satisfies Meta<InputProps>;

export const Text: StoryObj<InputProps> = {
  args: {
    type: "text",
    defaultValue: "Hello World",
  },
  render: (args) => <Input {...args} />,
};
