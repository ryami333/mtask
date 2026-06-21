import React from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";

export function ConfirmDeleteModal({
  isOpen,
  onRequestClose,
  onConfirm,
}: {
  isOpen: boolean;
  onRequestClose: () => void;
  onConfirm: React.MouseEventHandler;
}) {
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <h1>Confirm Delete</h1>
      <p>Are you sure you wish to delete this item?</p>
      <Button onClick={onConfirm} autoFocus>
        Confirm
      </Button>
    </Modal>
  );
}
