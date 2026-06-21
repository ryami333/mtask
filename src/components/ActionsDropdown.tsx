import React, { MouseEventHandler } from "react";
import styles from "./ActionsDropdown.module.css";
import classNames from "classnames/bind";
import { useMenuControls } from "../helpers/useMenuControls";
import { IconDots, IconProps } from "@tabler/icons-react";
import { Button } from "./Button";

const cx = classNames.bind(styles);

export function ActionsDropdown({
  triggerLabel,
  actions,
}: {
  triggerLabel: string;
  actions: {
    icon: React.ComponentType<IconProps>;
    label: string;
    onClick: MouseEventHandler;
  }[];
}) {
  const {
    isMenuOpen,
    menuId,
    menuRef,
    menuTriggerId,
    menuTriggerRef,
    onMenuBlur,
    onMenuKeydown,
    onTriggerClick,
    onTriggerKeyDown,
    closeMenu,
  } = useMenuControls();

  return (
    <div className={cx("container")}>
      <Button
        className={cx("trigger")}
        aria-haspopup="true"
        aria-expanded={isMenuOpen}
        aria-controls={menuId}
        aria-label={triggerLabel}
        id={menuTriggerId}
        type="button"
        onClick={onTriggerClick}
        onKeyDown={onTriggerKeyDown}
        ref={menuTriggerRef}
        icon={IconDots}
      />
      <div
        className={cx("flyover")}
        aria-hidden={!isMenuOpen}
        role="menu"
        id={menuId}
        aria-labelledby={menuTriggerId}
        ref={menuRef}
        onKeyDown={onMenuKeydown}
        onBlur={onMenuBlur}
      >
        {actions.map((action, index) => (
          <button
            key={index}
            type="button"
            className={cx("action")}
            onClick={(event) => {
              closeMenu();
              return action.onClick(event);
            }}
          >
            {action.icon && React.createElement(action.icon)}
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}
