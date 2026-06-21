import React from "react";
import { Button } from "./Button";
import classNames from "classnames/bind";
import { useAppState } from "../helpers/AppStateContext";
import { ipcClient } from "../helpers/ipcClient";
import { useCrudModalState } from "../helpers/useCrudModalState";
import { useDeleteModalState } from "../helpers/useDeleteModalState";
import {
  ColorMappingFormModal,
  ColorMappingFormValues,
} from "./ColorMappingFormModal";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";
import styles from "./SettingsPage.module.css";
import {
  IconEdit,
  IconPlus,
  IconPlusFilled,
  IconSettings,
  IconTrash,
} from "@tabler/icons-react";
import { ActionsDropdown } from "./ActionsDropdown";

const cx = classNames.bind(styles);

export const SettingsPage = () => {
  const appState = useAppState();

  const formModalState = useCrudModalState<typeof appState.colors>();
  const deleteModalState = useDeleteModalState<typeof appState.colors>();

  const submitColorMapping = (formValues: ColorMappingFormValues) => {
    if (formModalState.mode === "edit") {
      const { uuid } = formModalState.selectedEntity;
      ipcClient.setState((current) => ({
        colors: current.colors.map((colorMapping) =>
          colorMapping.uuid === uuid
            ? { ...colorMapping, ...formValues }
            : colorMapping,
        ),
      }));
    } else {
      ipcClient.setState((current) => ({
        colors: [
          ...current.colors,
          {
            uuid: crypto.randomUUID(),
            ...formValues,
          },
        ],
      }));
    }
    formModalState.closeAndReset();
  };

  const removeColorMapping = (uuid: string) => {
    ipcClient.setState((current) => ({
      colors: current.colors.filter(
        (colorMapping) => colorMapping.uuid !== uuid,
      ),
    }));
  };

  const confirmRemoveColorMapping = () => {
    if (deleteModalState.selectedEntity) {
      removeColorMapping(deleteModalState.selectedEntity.uuid);
    }
    deleteModalState.close();
  };

  return (
    <div className={cx("container")}>
      <h3>Color Mappings</h3>
      <table className={cx("table")}>
        <thead>
          <tr>
            <th>Prefix</th>
            <th>Color</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {appState.colors.map((colorMapping) => (
            <tr key={colorMapping.uuid} style={{ color: colorMapping.color }}>
              <td>{colorMapping.prefix}</td>
              <td>{colorMapping.color}</td>
              <td>
                <ActionsDropdown
                  triggerLabel="actions"
                  icon={IconSettings}
                  actions={[
                    {
                      icon: IconEdit,
                      label: "Edit",
                      onClick: () =>
                        formModalState.openEdit({
                          selectedEntity: colorMapping,
                          key: colorMapping.uuid,
                        }),
                    },
                    {
                      icon: IconTrash,
                      label: "Delete",
                      onClick: () =>
                        deleteModalState.open({ selectedEntity: colorMapping }),
                    },
                  ]}
                />
              </td>
            </tr>
          ))}
          <tr>
            <td style={{ gridColumn: "span 2" }}>Create New</td>
            <td>
              <Button
                onClick={() => formModalState.openNew()}
                icon={IconPlusFilled}
              />
            </td>
          </tr>
        </tbody>
      </table>
      <ColorMappingFormModal
        isOpen={formModalState.isOpen}
        onRequestClose={() => formModalState.close()}
        onSubmit={submitColorMapping}
        defaultValues={
          formModalState.mode === "edit"
            ? {
                prefix: formModalState.selectedEntity.prefix,
                color: formModalState.selectedEntity.color,
              }
            : undefined
        }
        key={formModalState.key}
      />
      <ConfirmDeleteModal
        isOpen={deleteModalState.isOpen}
        onRequestClose={() => deleteModalState.close()}
        onConfirm={() => confirmRemoveColorMapping()}
        message={
          deleteModalState.selectedEntity
            ? `Are you sure you wish to delete the "${deleteModalState.selectedEntity.prefix}" color mapping?`
            : undefined
        }
      />
    </div>
  );
};
