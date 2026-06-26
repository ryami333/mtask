import { useMergedRef } from "@mantine/hooks";
import React from "react";

export type FocusGroupDirection = "inline" | "block" | "all";

/**
 * A small polyfill for the proposed `focusgroup` HTML attribute.
 *
 * Wraps a region of the UI and makes its descendant `<button>`s navigable with
 * the arrow keys (plus Home/End), the way a native `focusgroup` would. Tab still
 * moves into and out of the group as usual; the arrows move focus *between* the
 * buttons inside it.
 *
 * The `direction` prop mirrors the attribute's values:
 * - `"inline"` — Left/Right move between buttons.
 * - `"block"`  — Up/Down move between buttons.
 * - `"all"`    — either axis works: Right *or* Down is "next", Left *or* Up is
 *                "previous".
 *
 * Home/End always jump to the first/last button regardless of `direction`.
 */
export function FocusGroup({
  direction = "all",
  children,
  onKeyDown,
  ref,
  ...props
}: React.ComponentPropsWithRef<"div"> & {
  direction?: FocusGroupDirection;
}) {
  const innerRef = React.useRef<HTMLDivElement>(null);
  const mergedRef = useMergedRef(innerRef, ref);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || !innerRef.current) return;

    const nextKeys: string[] = [];
    const prevKeys: string[] = [];
    if (direction === "inline" || direction === "all") {
      nextKeys.push("ArrowRight");
      prevKeys.push("ArrowLeft");
    }
    if (direction === "block" || direction === "all") {
      nextKeys.push("ArrowDown");
      prevKeys.push("ArrowUp");
    }

    const isNext = nextKeys.includes(event.key);
    const isPrev = prevKeys.includes(event.key);
    const isHome = event.key === "Home";
    const isEnd = event.key === "End";
    if (!isNext && !isPrev && !isHome && !isEnd) return;

    // Only act on keys that originated from a button we manage.
    const buttons = Array.from(
      innerRef.current.querySelectorAll("button:not([disabled])"),
    ).filter((item) => item instanceof HTMLButtonElement);
    if (!document.activeElement) {
      return;
    }
    const currentIndex = buttons.findIndex(
      (button) => document.activeElement === button,
    );
    if (currentIndex === -1) return;

    event.preventDefault();

    let nextIndex: number;
    if (isHome) {
      nextIndex = 0;
    } else if (isEnd) {
      nextIndex = buttons.length - 1;
    } else {
      const delta = isNext ? 1 : -1;
      // Wrap around the ends, matching native focusgroup behaviour.
      nextIndex = (currentIndex + delta + buttons.length) % buttons.length;
    }

    buttons[nextIndex]?.focus();
  };

  return (
    <div ref={mergedRef} onKeyDown={handleKeyDown} {...props}>
      {children}
    </div>
  );
}
