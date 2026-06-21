import { useState } from "react";

/**
 * Manages the open/closed state of a CRUD modal along with its mode
 * (`"new"` | `"edit"`), the currently selected entity (for `"edit"`), and a
 * `key` intended to be passed to the modal component to force it to remount.
 *
 * The type parameter `T` may be either the entity type or the entity array
 * type — when `T` is an array, `selectedEntity` is typed as `T[number]` so
 * callers can pass e.g. `typeof rows` directly without writing `[number]`
 * themselves.
 *
 * Designed for pages that use a single modal to both create and edit a
 * resource (e.g. `FeiertagePage`, `AnlagenPage`), with the following
 * characteristics:
 *
 * - **`mode` and `selectedEntity` persist while `isOpen` is `false`.** This
 *   lets the modal animate closed while still rendering its previous contents,
 *   so the user doesn't see the form flash to an empty/new state during the
 *   exit animation. They are replaced the next time `openNew` / `openEdit` is
 *   called.
 *
 * - **`key` forces the modal (and its form state) to remount.** `openNew`
 *   generates a fresh UUID per call so each "new" session starts from a clean
 *   form. `openEdit` takes an explicit `key` — typically the entity's
 *   `globalID` — so switching between entities resets the form to that
 *   entity's default values rather than preserving in-progress edits from a
 *   previously-open entity.
 *
 * The returned object is intended to be spread onto the modal roughly like:
 *
 *     <FooModal
 *       isOpen={modalState.isOpen}
 *       key={modalState.key}
 *       mode={modalState.mode}
 *       onRequestClose={modalState.close}
 *       defaultValues={
 *         modalState.mode === "edit"
 *          ? toDefaults(modalState.selectedEntity)
 *          : undefined
 *       }
 *       // …
 *     />
 *
 * Rows open the modal via
 * `modalState.openEdit({ selectedEntity: row, key: row.globalID })`, and the
 * "add" affordance uses `modalState.openNew`.
 */

type UnArrayed<T> = T extends readonly (infer U)[] ? U : T;

export const useCrudModalState = <T>() => {
  const [state, setState] = useState<
    { isOpen: boolean; key: string } & (
      | { mode: "new" | undefined }
      | { mode: "edit"; selectedEntity: UnArrayed<T> }
    )
  >({ isOpen: false, key: crypto.randomUUID(), mode: undefined });

  return {
    ...state,
    openNew: () =>
      setState((current) => {
        /**
         * This means that if someone accidentally closes a "new" modal and then
         * immediately re-opens it we won't dismiss their changes (by preserving
         * the existing `key`).
         */
        if (current.mode === "new") {
          return {
            ...current,
            isOpen: true,
          };
        }
        return {
          isOpen: true,
          mode: "new",
          key: crypto.randomUUID(),
        };
      }),
    openEdit: ({
      key,
      selectedEntity,
    }: {
      key: string;
      selectedEntity: UnArrayed<T>;
    }) => setState({ isOpen: true, mode: "edit", selectedEntity, key }),
    close: () => setState((current) => ({ ...current, isOpen: false })),

    /**
     * For closing a modal after a successful submission – resets the `key`.
     */
    closeAndReset: () =>
      setState((current) => ({
        ...current,
        isOpen: false,
        key: crypto.randomUUID(),
      })),
  };
};
