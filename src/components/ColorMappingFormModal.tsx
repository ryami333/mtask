import React, { useId } from "react";
import { Modal } from "./Modal";
import { Input } from "./Input";
import { Button } from "./Button";
import { useForm, useFormState, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { isValidCssColor } from "is-valid-css-color";
import { Field } from "./Field/Field";
import styles from "./ColorMappingFormModal.module.css";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const validationSchema = z.object({
  prefix: z.string().nonempty(),
  color: z
    .string()
    .nonempty()
    .refine(isValidCssColor, { message: "Must be a valid CSS color" }),
});

export type ColorMappingFormValues = z.infer<typeof validationSchema>;

export function ColorMappingFormModal({
  isOpen,
  onRequestClose,
  onSubmit,
  defaultValues = { prefix: "", color: "#FF0000" },
}: {
  isOpen: boolean;
  onRequestClose: () => void;
  onSubmit: (formValues: ColorMappingFormValues) => void;
  defaultValues?: ColorMappingFormValues;
}) {
  const { register, handleSubmit, control } = useForm<ColorMappingFormValues>({
    defaultValues,
    resolver: zodResolver(validationSchema),
  });
  const { errors } = useFormState({ control });

  const prefixInputId = useId();
  const colorInputId = useId();

  const colorValue = useWatch({ control, name: "color" });

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <form onSubmit={handleSubmit(onSubmit)} className={cx("form")}>
        <div className={cx("fields")}>
          <Field
            label="Prefix"
            inputId={prefixInputId}
            errorMessage={errors.prefix?.message}
          >
            <Input
              id={prefixInputId}
              type="text"
              autoFocus
              {...register("prefix")}
            />
          </Field>
          <Field
            label="Color"
            inputId={colorInputId}
            errorMessage={errors.color?.message}
          >
            <Input
              id={colorInputId}
              type="text"
              {...register("color")}
              style={{ color: colorValue }}
            />
          </Field>
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </Modal>
  );
}
