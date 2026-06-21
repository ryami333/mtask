import React from "react";
import { Meta, StoryFn } from "@storybook/react-vite";
import { FocusGroup } from "./FocusGroup";
import { Button } from "./Button";

export default {
  title: "FocusGroup",
  component: FocusGroup,
  parameters: {
    layout: "padded",
  },
  argTypes: {
    direction: {
      control: "inline-radio",
      options: ["inline", "block", "all"],
    },
  },
  args: {
    direction: "all",
  },
} satisfies Meta<typeof FocusGroup>;

export const Default: StoryFn<typeof FocusGroup> = (args) => (
  <FocusGroup
    {...args}
    style={{ display: "flex", gap: "var(--spacing-md)", flexWrap: "wrap" }}
  >
    <Button>First</Button>
    <Button>Second</Button>
    <Button>Third</Button>
    <Button>Fourth</Button>
  </FocusGroup>
);
