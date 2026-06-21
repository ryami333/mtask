import {
  useClickOutside,
  useFocusTrap,
  useInputState,
  useMergedRef,
} from "@mantine/hooks";
import React, { Ref } from "react";
import { Todo } from "../helpers/appState";
import { Input } from "./Input";

export function NewTodoDialog({
  isOpen,
  onRequestClose,
  inputRef,
  onSubmit,
}: {
  isOpen: boolean;
  onRequestClose: () => void;
  inputRef: Ref<HTMLInputElement>;
  onSubmit: (todo: Todo) => void;
}) {
  const focusTrapRef = useFocusTrap(isOpen);
  const clickawayref = useClickOutside(onRequestClose);
  const [inputValue, setInputValue] = useInputState("");

  const mergedRef = useMergedRef(focusTrapRef, clickawayref);
  return (
    <dialog
      open={isOpen}
      ref={mergedRef}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.preventDefault();
          onRequestClose();
        }
      }}
    >
      <form
        autoFocus
        // className={cx("form")}
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
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={setInputValue}
          placeholder="Please enter a new thing here"
        />
      </form>
    </dialog>
  );
}
