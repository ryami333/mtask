import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { Button } from "./Button";

type ButtonProps = React.ComponentProps<typeof Button>;

export default {
  title: "Blocks/Button",
  parameters: {
    layout: "padded",
  },
  args: {
    children: "Click Me",
  },
} satisfies Meta<ButtonProps>;

export const Static: StoryFn<ButtonProps> = (args) => <Button {...args} />;
