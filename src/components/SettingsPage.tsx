import React, { useId } from "react";
import { Button } from "./Button";
import { Input } from "./Input";
import classNames from "classnames/bind";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppState } from "../helpers/AppStateContext";
import { ipcClient } from "../helpers/ipcClient";
import styles from "./SettingsPage.module.css";

const cx = classNames.bind(styles);

const validationSchema = z.object({
  prefix: z.string().nonempty(),
  color: z.string().nonempty(),
});

type FormValues = z.infer<typeof validationSchema>;

export const SettingsPage = () => {
  const { register, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      prefix: "",
      color: "#FF0000",
    },
    resolver: zodResolver(validationSchema),
  });

  const onSubmit = (formValues: FormValues) => {
    ipcClient.setState((current) => ({
      colors: [
        ...current.colors,
        {
          uuid: crypto.randomUUID(),
          ...formValues,
        },
      ],
    }));
    reset();
  };

  const prefixInputId = useId();
  const colorInputId = useId();

  const appState = useAppState();

  const removeColorMapping = (uuid: string) => {
    ipcClient.setState((current) => ({
      colors: current.colors.filter(
        (colorMapping) => colorMapping.uuid !== uuid,
      ),
    }));
  };

  return (
    <div className={cx("container")}>
      <form className={cx("form")} onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor={prefixInputId}>Prefix</label>
          <Input id={prefixInputId} type="text" {...register("prefix")} />
        </div>
        <div>
          <label htmlFor={colorInputId}>Color</label>
          <Input id={colorInputId} type="text" {...register("color")} />
        </div>
        <Button type="submit">Submit</Button>
      </form>
      <table>
        <thead>
          <tr>
            <th className={cx("th")}>Prefix</th>
            <th className={cx("th")}>Color</th>
            <th className={cx("th")}></th>
          </tr>
        </thead>
        <tbody>
          {appState.colors.map((colorMapping) => (
            <tr key={colorMapping.uuid} style={{ color: colorMapping.color }}>
              <td>{colorMapping.prefix}</td>
              <td>{colorMapping.color}</td>
              <td>
                <Button onClick={() => removeColorMapping(colorMapping.uuid)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
