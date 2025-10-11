import React from "react";
import { Meta, StoryFn } from "@storybook/react-vite";
import { Button } from "./Button";

export default {
  title: "Blocks/Button",
  parameters: {
    layout: "padded",
  },
  args: {
    children: "Click Me",
  },
} satisfies Meta<typeof Button>;

export const Static: StoryFn<typeof Button> = (args) => <Button {...args} />;
