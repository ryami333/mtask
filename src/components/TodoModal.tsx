import { useInputState } from "@mantine/hooks";
import React from "react";
import { Modal } from "./Modal";
import { Input } from "./Input";

export function TodoModal({
  isOpen,
  onRequestClose,
  onSubmit,
  defaultValue = "",
}: {
  isOpen: boolean;
  onRequestClose: () => void;
  onSubmit: (title: string) => void;
  defaultValue?: string;
}) {
  const [inputValue, setInputValue] = useInputState(defaultValue);

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <form
        autoFocus
        onSubmit={(e) => {
          e.preventDefault();

          if (inputValue) {
            onSubmit(inputValue);
          }
          setInputValue("");
        }}
      >
        <Input
          type="text"
          value={inputValue}
          onChange={setInputValue}
          placeholder="Please enter a new thing here"
        />
      </form>
    </Modal>
  );
}
