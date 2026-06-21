import { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./Button";
import { IconSettings } from "@tabler/icons-react";

const meta = {
  component: Button,
  title: "Button",
  parameters: {
    layout: "padded",
  },
  args: {
    children: "Click Me",
  },
} satisfies Meta<typeof Button>;

export default meta;

export const Default: StoryObj<typeof meta> = {};

export const WithIcon: StoryObj<typeof meta> = {
  args: {
    icon: IconSettings,
    children: "Settings",
  },
};

export const WithIconOnly: StoryObj<typeof meta> = {
  args: {
    icon: IconSettings,
    children: undefined,
  },
};
