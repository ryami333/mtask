import { fn } from "storybook/test";
import { ActionsDropdown } from "./ActionsDropdown";
import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { IconSettings } from "@tabler/icons-react";

const PADDING = 16;

const meta = {
  title: "Components/ActionsDropdown",
  component: ActionsDropdown,
  args: {
    icon: IconSettings,
    actions: [
      { icon: IconSettings, label: "Bearbeiten", onClick: fn() },
      { icon: IconSettings, label: "Löschen", onClick: fn() },
    ],
  },
  parameters: {
    layout: "padded",
  },
  /**
   * Rendering one instance in each corner of the viewport to demonstrate the
   * `flip-inline` and `flip-block` position-fallback behaviours.
   */
  render: (args) => (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActionsDropdown {...args} />
      </div>
      <div style={{ position: "fixed", top: PADDING, left: PADDING }}>
        <ActionsDropdown {...args} />
      </div>
      <div style={{ position: "fixed", top: PADDING, right: PADDING }}>
        <ActionsDropdown {...args} />
      </div>
      <div style={{ position: "fixed", bottom: PADDING, left: PADDING }}>
        <ActionsDropdown {...args} />
      </div>
      <div style={{ position: "fixed", bottom: PADDING, right: PADDING }}>
        <ActionsDropdown {...args} />
      </div>
    </>
  ),
} satisfies Meta<typeof ActionsDropdown>;

export default meta;

export const Default = {
  args: {},
} satisfies StoryObj<typeof ActionsDropdown>;
