import React from "react";
import { Meta, StoryFn } from "@storybook/react-vite";
import { ColorMappingFormModal } from "./ColorMappingFormModal";
import { fn } from "storybook/test";

export default {
  title: "ColorMappingFormModal",
  parameters: {
    layout: "padded",
  },
  args: {
    isOpen: true,
    onRequestClose: fn(),
    onSubmit: fn(),
  },
} satisfies Meta<typeof ColorMappingFormModal>;

export const Static: StoryFn<typeof ColorMappingFormModal> = (args) => (
  <ColorMappingFormModal {...args} />
);
