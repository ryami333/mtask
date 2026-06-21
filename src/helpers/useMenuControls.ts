import React, { useId, useRef } from "react";
import {
  getHotkeyHandler,
  useClickOutside,
  useDisclosure,
} from "@mantine/hooks";

const MENU_ITEM_SELECTOR = "a, [role='menuitemcheckbox'], button";

export function useMenuControls() {
  const [isMenuOpen, { open, close, toggle }] = useDisclosure(false);

  const menuTriggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const menuId = useId();
  const menuTriggerId = useId();

  const getMenuItems = () =>
    Array.from(
      menuRef.current?.querySelectorAll<HTMLElement>(MENU_ITEM_SELECTOR) ?? [],
    );

  /**
   * The menuitems are not focussable until the menu element is visible
   * on the next frame, so focus moves are deferred with rAF.
   */
  const focusItemOnNextFrame = (
    resolve: (items: HTMLElement[]) => HTMLElement | undefined,
  ) => {
    requestAnimationFrame(() => resolve(getMenuItems())?.focus());
  };

  const openAndFocus = (
    resolve: (items: HTMLElement[]) => HTMLElement | undefined,
  ) => {
    open();
    focusItemOnNextFrame(resolve);
  };

  const onTriggerKeyDown = getHotkeyHandler([
    ["space", () => openAndFocus((items) => items[0])],
    ["enter", () => openAndFocus((items) => items[0])],
    ["arrowdown", () => openAndFocus((items) => items[0])],
    ["arrowup", () => openAndFocus((items) => items[items.length - 1])],
  ]);

  const onTriggerClick: React.MouseEventHandler<HTMLButtonElement> = () => {
    if (!isMenuOpen) {
      focusItemOnNextFrame((items) => items[0]);
    }
    toggle();
  };

  /** Move focus by `delta` items, clamped to the ends of the menu. */
  const moveFocus = (delta: number) => {
    const menuItems = getMenuItems();
    const index = menuItems.indexOf(document.activeElement as HTMLElement);
    if (index === -1) {
      return;
    }
    const next = Math.min(Math.max(index + delta, 0), menuItems.length - 1);
    menuItems[next]?.focus();
  };

  /**
   * Named keys are mapped declaratively (`getHotkeyHandler` calls
   * `preventDefault` on a match). Space+Enter are intentionally absent – the
   * link/button elements implicitly handle activation.
   */
  const handleMenuHotkeys = getHotkeyHandler([
    ["arrowdown", () => moveFocus(1)],
    ["arrowup", () => moveFocus(-1)],
    ["home", () => getMenuItems()[0]?.focus()],
    ["end", () => getMenuItems().at(-1)?.focus()],
    [
      "escape",
      () => {
        close();
        menuTriggerRef.current?.focus();
      },
    ],
  ]);

  const onMenuKeydown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    handleMenuHotkeys(event);

    /**
     * Type-ahead: jump to the first item starting with the pressed character.
     * Handled here rather than via `getHotkeyHandler` because it matches any
     * single printable key, not a fixed hotkey.
     */
    if (event.defaultPrevented || event.key.length !== 1) {
      return;
    }
    const char = event.key.toLowerCase();
    const match = getMenuItems().find((item) =>
      item.textContent?.startsWith(char),
    );
    match?.focus();
  };

  /**
   * Close the menu on "click away". `useClickOutside` treats clicks within
   * either the menu or its trigger as "inside", and only listens while open.
   */
  useClickOutside(
    () => close(),
    null,
    [menuRef.current, menuTriggerRef.current],
    isMenuOpen,
  );

  const onMenuBlur = ({ relatedTarget }: React.FocusEvent<HTMLDivElement>) => {
    /**
     * Close the menu on "tab-away"
     */
    if (
      !(
        relatedTarget instanceof Node &&
        (menuRef.current?.contains(relatedTarget) ||
          menuTriggerRef.current?.contains(relatedTarget))
      )
    ) {
      close();
    }
  };

  return {
    isMenuOpen,
    menuTriggerRef,
    menuRef,
    menuId,
    menuTriggerId,
    onMenuKeydown,
    onMenuBlur,
    onTriggerKeyDown,
    onTriggerClick,
    closeMenu: close,
  };
}
