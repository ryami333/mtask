import { useState } from "react";

/**
 * Manages the open/closed state of a delete-confirmation modal along with the
 * entity proposed for deletion.
 *
 * Modelled on `useCrudModalState`, but without the discriminated-union
 * (`"new"` | `"edit"`) `mode` — a delete modal only ever does one thing
 * (confirm deletion of a known entity), so there is no mode to discriminate on.
 *
 * The type parameter `T` may be either the entity type or the entity array
 * type — when `T` is an array, `selectedEntity` is typed as `T[number]` so
 * callers can pass e.g. `typeof rows` directly without writing `[number]`
 * themselves.
 *
 * Characteristics:
 *
 * - **`selectedEntity` persists while `isOpen` is `false`.** This lets the
 *   modal animate closed while still rendering its previous contents, so the
 *   user doesn't see the entity details flash to empty during the exit
 *   animation. It is `null` until `open` is first called, and is replaced the
 *   next time `open` is called.
 *
 * The returned object is intended to be spread onto the modal roughly like:
 *
 *     <DialogModal
 *       isOpen={deleteModalState.isOpen}
 *       onRequestClose={deleteModalState.close}
 *       heading="Foo löschen"
 *       confirmButtonLabel={deDictionary.actions.confirmDelete}
 *       onClickConfirmButton={() =>
 *         deleteModalState.selectedEntity &&
 *         handleDelete(deleteModalState.selectedEntity.globalID)
 *       }
 *     />
 *
 * Rows open the modal via
 * `deleteModalState.open({ selectedEntity: row })`.
 */

type UnArrayed<T> = T extends readonly (infer U)[] ? U : T;

export const useDeleteModalState = <T>() => {
  const [state, setState] = useState<{
    isOpen: boolean;
    selectedEntity: UnArrayed<T> | null;
  }>({ isOpen: false, selectedEntity: null });

  return {
    ...state,
    open: ({ selectedEntity }: { selectedEntity: UnArrayed<T> }) =>
      setState({ isOpen: true, selectedEntity }),

    /**
     * Closes the modal while preserving `selectedEntity` so the modal can
     * animate closed without its contents flashing to empty.
     */
    close: () => setState((current) => ({ ...current, isOpen: false })),
  };
};
