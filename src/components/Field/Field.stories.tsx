import React from "react";
import { Meta, StoryFn } from "@storybook/react-vite";
import { Field } from "./Field";
import { Input } from "../Input";

export default {
  title: "Field",
  parameters: {
    layout: "padded",
  },
  args: {
    label: "Address",
    children: undefined,
    errorMessage: "Lorem ipsum labore proident dolor esse sunt id nostrud.",
  },
} satisfies Meta<typeof Field>;

export const Static: StoryFn<typeof Field> = (args) => (
  <Field {...args}>
    <Input placeholder="Sint et sit anim." />
  </Field>
);
