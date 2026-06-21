import { useClickOutside, useFocusTrap, useMergedRef } from "@mantine/hooks";
import React from "react";
import classNames from "classnames/bind";
import styles from "./Dialog.module.css";

const cx = classNames.bind(styles);

export function Dialog({
  isOpen,
  onRequestClose,
  children,
}: {
  isOpen: boolean;
  onRequestClose: () => void;
  children?: React.ReactNode;
}) {
  const focusTrapRef = useFocusTrap(isOpen);
  const clickawayRef = useClickOutside(onRequestClose);
  const mergedRef = useMergedRef(focusTrapRef, clickawayRef);

  return (
    <>
      {isOpen && <div className={cx("backdrop")} onClick={onRequestClose} />}
      <dialog
        className={cx("dialog")}
        open={isOpen}
        ref={mergedRef}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.preventDefault();
            onRequestClose();
          }
        }}
      >
        {children}
      </dialog>
    </>
  );
}
