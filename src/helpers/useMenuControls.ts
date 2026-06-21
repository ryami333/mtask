import { useEffect, useId, useRef, useState } from "react";

export function useMenuControls() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const menuTriggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const menuId = useId();
  const menuTriggerId = useId();

  const onTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    switch (event.key) {
      case " ":
      case "Enter":
      case "ArrowDown":
      case "Down": {
        event.preventDefault();
        setIsMenuOpen(true);
        /**
         * The menuitems are not focussable until the menu element is visible
         * on the next frame:
         */
        requestAnimationFrame(() => {
          const items = menuRef.current?.querySelectorAll<HTMLElement>(
            "a, [role='menuitemcheckbox'], button",
          );
          (items?.length ? items[0] : undefined)?.focus();
        });
        break;
      }
      case "ArrowUp":
      case "Up": {
        event.preventDefault();
        setIsMenuOpen(true);
        /**
         * The menuitems are not focussable until the menu element is visible
         * on the next frame:
         */
        requestAnimationFrame(() => {
          const items = menuRef.current?.querySelectorAll<HTMLElement>(
            "a, [role='menuitemcheckbox'], button",
          );
          (items?.length ? items[items.length - 1] : undefined)?.focus();
        });
        break;
      }
    }
  };

  const onTriggerClick: React.MouseEventHandler<HTMLButtonElement> = () => {
    setIsMenuOpen((current) => {
      if (current === false) {
        requestAnimationFrame(() => {
          const first = menuRef.current?.querySelector<HTMLElement>(
            "a, [role='menuitemcheckbox'], button",
          );
          first?.focus();
        });
      }
      return !current;
    });
  };

  const onMenuKeydown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const { key } = event;
    switch (key) {
      /**
       * No Explicit handling for Space+Enter – the link elements implicitly
       * handle this.
       */
      case "ArrowDown":
      case "Down": {
        event.preventDefault();
        const menuItems = Array.from(
          menuRef.current?.querySelectorAll<HTMLElement>(
            "a, [role='menuitemcheckbox'], button",
          ) ?? [],
        );
        const focussedIndex = menuItems.findIndex(
          (item) => item === document.activeElement,
        );
        if (focussedIndex !== -1) {
          menuItems[Math.min(focussedIndex + 1, menuItems.length)]?.focus();
        }
        break;
      }
      case "ArrowUp":
      case "Up": {
        event.preventDefault();
        const menuItems = Array.from(
          menuRef.current?.querySelectorAll<HTMLElement>(
            "a, [role='menuitemcheckbox'], button",
          ) ?? [],
        );
        const focussedIndex = menuItems.findIndex(
          (item) => item === document.activeElement,
        );
        if (focussedIndex !== -1) {
          menuItems[Math.max(focussedIndex - 1, 0)]?.focus();
        }
        break;
      }
      case "Home": {
        event.preventDefault();
        const items = menuRef.current?.querySelectorAll<HTMLElement>(
          "a, [role='menuitemcheckbox'], button",
        );
        items?.[0]?.focus();
        break;
      }
      case "End": {
        event.preventDefault();
        const items = menuRef.current?.querySelectorAll<HTMLElement>(
          "a, [role='menuitemcheckbox'], button",
        );
        (items?.length ? items[items.length - 1] : undefined)?.focus();
        break;
      }
      case "Esc":
      case "Escape": {
        event.preventDefault();
        setIsMenuOpen(false);
        menuTriggerRef.current?.focus();
        break;
      }
      default: {
        if (key.length !== 1) {
          break;
        }
        const char = key.toLowerCase();
        const menuItems = Array.from(
          menuRef.current?.querySelectorAll<HTMLElement>(
            "a, [role='menuitemcheckbox'], button",
          ) ?? [],
        );
        const matchingLink = menuItems.find((item) =>
          item.textContent?.startsWith(char),
        );

        if (matchingLink) {
          matchingLink.focus();
        }
      }
    }
  };

  useEffect(() => {
    /**
     * Close the menu on "click away"
     */
    const onDocumentClick = (e: MouseEvent) => {
      const { target } = e;
      const menu = menuRef.current;
      const menuTrigger = menuTriggerRef.current;
      if (!menu || !menuTrigger) {
        throw new Error("Couldn't find menu or menuTrigger elements");
      }
      if (
        isMenuOpen &&
        !(
          target instanceof Node &&
          (menuTrigger.contains(target) || menu.contains(target))
        )
      ) {
        e.preventDefault();
        e.stopPropagation();
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("click", onDocumentClick);

    return () => document.removeEventListener("click", onDocumentClick);
  }, [isMenuOpen]);

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
      setIsMenuOpen(false);
    }
  };

  const closeMenu = () => setIsMenuOpen(() => false);

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
    closeMenu,
  };
}
