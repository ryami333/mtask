import { useInputState } from "@mantine/hooks";
import React from "react";
import { Todo } from "../helpers/appState";
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
  onSubmit: (todo: Todo) => void;
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
            onSubmit({
              uuid: crypto.randomUUID(),
              title: inputValue,
              completed: false,
            });
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
