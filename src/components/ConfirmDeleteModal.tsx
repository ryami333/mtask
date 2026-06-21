import React from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { FocusGroup } from "./FocusGroup";
import styles from "./ConfirmDeleteModal.module.css";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

export function ConfirmDeleteModal({
  isOpen,
  onRequestClose,
  onConfirm,
  message = "Are you sure you wish to delete this item?",
}: {
  isOpen: boolean;
  onRequestClose: () => void;
  onConfirm: React.MouseEventHandler;
  message?: string;
}) {
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <div className={cx("inner")}>
        <p>{message}</p>
        <FocusGroup direction="inline" className={cx("buttons")}>
          <Button onClick={onRequestClose}>Cancel</Button>
          <Button onClick={onConfirm} autoFocus>
            Confirm
          </Button>
        </FocusGroup>
      </div>
    </Modal>
  );
}
